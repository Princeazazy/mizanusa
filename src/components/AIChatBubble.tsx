import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Paperclip, Loader2, Bot, User, Sparkles, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import mizanLogo from "@/assets/mizan-logo-brand.png";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: { name: string; type: string; content?: string }[];
};

interface AIChatBubbleProps {
  clientId: string;
  clientName: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/accountant-chat`;

// Supported file types for upload
const SUPPORTED_FILE_TYPES = [
  "text/csv",
  "application/pdf",
  "text/plain",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export const AIChatBubble = ({ clientId, clientName }: AIChatBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<{ name: string; content: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Execute tool calls on the backend
  const executeActions = async (toolCalls: any[]) => {
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          clientId, 
          executeActions: toolCalls.map(tc => ({
            name: tc.function.name,
            arguments: JSON.parse(tc.function.arguments || '{}')
          }))
        }),
      });

      if (!resp.ok) {
        throw new Error("Failed to execute actions");
      }

      const data = await resp.json();
      return data.results;
    } catch (error) {
      console.error("Action execution error:", error);
      throw error;
    }
  };

  const streamChat = useCallback(async (userMessage: string) => {
    const newUserMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    const allMessages = [...messages, newUserMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, clientId }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${resp.status}`);
      }

      if (!resp.body) {
        throw new Error("No response body");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      const assistantId = crypto.randomUUID();
      let toolCalls: any[] = [];
      let currentToolCall: any = null;

      // Create initial assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta;
            
            // Handle regular content
            const content = delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantSoFar } : m
                )
              );
            }
            
            // Handle tool calls
            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                if (tc.index !== undefined) {
                  if (!toolCalls[tc.index]) {
                    toolCalls[tc.index] = { 
                      id: tc.id || '', 
                      function: { name: '', arguments: '' } 
                    };
                  }
                  if (tc.id) toolCalls[tc.index].id = tc.id;
                  if (tc.function?.name) toolCalls[tc.index].function.name = tc.function.name;
                  if (tc.function?.arguments) toolCalls[tc.index].function.arguments += tc.function.arguments;
                }
              }
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantSoFar } : m
                )
              );
            }
          } catch {
            /* ignore */
          }
        }
      }

      // Execute any tool calls
      if (toolCalls.length > 0 && toolCalls.some(tc => tc.function.name)) {
        const validToolCalls = toolCalls.filter(tc => tc.function.name);
        
        // Show what actions are being taken
        const actionNames = validToolCalls.map(tc => tc.function.name).join(', ');
        const actionMessage = `\n\n⚙️ **Executing actions:** ${actionNames}...`;
        assistantSoFar += actionMessage;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantSoFar } : m
          )
        );

        try {
          const results = await executeActions(validToolCalls);
          
          // Update message with results
          let resultMessage = "\n\n✅ **Actions completed:**\n";
          for (const result of results) {
            if (result.success) {
              resultMessage += `• ${result.message}\n`;
              toast({
                title: "Action completed",
                description: result.message,
              });
            } else {
              resultMessage += `• ❌ ${result.action} failed: ${result.error}\n`;
              toast({
                variant: "destructive",
                title: "Action failed",
                description: result.error,
              });
            }
          }
          
          assistantSoFar += resultMessage;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantSoFar } : m
            )
          );
        } catch (error) {
          const errorMessage = "\n\n❌ Failed to execute actions. Please try again.";
          assistantSoFar += errorMessage;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: assistantSoFar } : m
            )
          );
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Failed to send message",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, clientId, toast]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!SUPPORTED_FILE_TYPES.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast({
        variant: "destructive",
        title: "Unsupported file type",
        description: "Please upload a CSV, TXT, PDF, or Excel file.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      // For text-based files, read the content
      if (file.type === "text/csv" || file.type === "text/plain" || file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
        const text = await file.text();
        setPendingFile({ name: file.name, content: text });
        toast({
          title: "File ready",
          description: `${file.name} is ready to be analyzed.`,
        });
      } else {
        // For binary files (PDF, Excel), we'll just note the file name
        // In a full implementation, we'd upload to storage and parse server-side
        setPendingFile({ 
          name: file.name, 
          content: `[File: ${file.name}]\n\nNote: This is a ${file.type} file. Please describe the data you'd like me to help with, or paste the relevant content.` 
        });
        toast({
          title: "File attached",
          description: `${file.name} attached. For best results with PDFs/Excel, please describe the data or paste key sections.`,
        });
      }
    } catch (error) {
      console.error("File read error:", error);
      toast({
        variant: "destructive",
        title: "Error reading file",
        description: "Could not read the file. Please try again.",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !pendingFile) || isLoading) return;
    
    let message = input.trim();
    
    // If there's a pending file, include its content
    if (pendingFile) {
      const fileContext = `[Uploaded File: ${pendingFile.name}]\n\n${pendingFile.content}\n\n---\n\n`;
      message = message ? `${fileContext}User request: ${message}` : `${fileContext}Please analyze this file and summarize the key financial data.`;
      setPendingFile(null);
    }
    
    setInput("");
    streamChat(message);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-card/90 backdrop-blur-sm border border-primary/50 shadow-2xl flex items-center justify-center hover:shadow-primary/50 transition-shadow"
          >
            <img
              src={mizanLogo}
              alt="Mizan AI"
              className="h-12 w-12 object-contain logo-glow-pulse"
            />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-income rounded-full border-2 border-background animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] bg-[#0a0e17] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/20 to-blue-600/20 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
              <img
                src={mizanLogo}
                alt="Mizan AI"
                className="h-16 w-16 object-contain mix-blend-lighten logo-glow-pulse"
              />
                </div>
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    Mizan AI
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </h3>
                  <p className="text-xs text-slate-400">{clientName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="text-white font-medium mb-2">
                    How can I help with {clientName}?
                  </h4>
                  <p className="text-sm text-slate-400 mb-4">
                    Upload statements, ask questions, or let me help manage your financial data.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "Parse a bank statement",
                      "Create a new sheet",
                      "Categorize transactions",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          setInput(suggestion);
                          inputRef.current?.focus();
                        }}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${
                        message.role === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === "user"
                            ? "bg-primary/20"
                            : "bg-gradient-to-br from-primary to-blue-600"
                        }`}
                      >
                        {message.role === "user" ? (
                          <User className="h-4 w-4 text-primary" />
                        ) : (
                          <img
                            src={mizanLogo}
                            alt="AI"
                            className="h-5 w-5 object-contain mix-blend-lighten"
                          />
                        )}
                      </div>
                      <div
                        className={`flex-1 px-4 py-2.5 rounded-2xl max-w-[80%] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-white/5 text-slate-200 border border-white/10"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      </div>
                      <div className="flex-1 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                          <span
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <span
                            className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Pending file indicator */}
            {pendingFile && (
              <div className="px-4 py-2 border-t border-white/10 bg-primary/10">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-slate-300 truncate flex-1">{pendingFile.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPendingFile(null)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/10 bg-black/20"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv,.pdf,.txt,.xls,.xlsx"
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white hover:bg-white/10"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Paperclip className="h-5 w-5" />
                  )}
                </Button>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={pendingFile ? "Describe what to do with this file..." : "Ask about financial data..."}
                  className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={(!input.trim() && !pendingFile) || isLoading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
