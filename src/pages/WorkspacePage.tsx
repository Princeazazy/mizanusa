import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Paperclip, Plus, SendHorizontal, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { FuturisticSidebar } from "@/components/FuturisticSidebar";
import { FuturisticHeader } from "@/components/FuturisticHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DraftSheetsPanel } from "@/components/workspace/DraftSheetsPanel";
import { BOOKS_CLIENTS } from "@/lib/books/clients";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  MAX_ATTACHMENT_BYTES,
  createThread,
  deleteThread,
  fetchMessages,
  fetchSheets,
  fetchThreads,
  readAttachment,
  renameThread,
  sendWorkspaceMessage,
  type OutgoingAttachment,
  type WorkspaceMessage,
  type WorkspaceSheet,
  type WorkspaceThread,
} from "@/lib/workspace/api";

const SUGGESTIONS = [
  "Parse this statement line by line and build a transaction register with COA codes.",
  "Build the Profit & Loss for this period from the register.",
  "Build the balance sheet and a direct-method cash flow.",
  "Keep internal transfers on a separate sheet and confirm nothing is double counted.",
];

const WorkspacePage = () => {
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();
  const { user } = useAuth();

  const [clientId, setClientId] = useState(BOOKS_CLIENTS[0].id);
  const [threads, setThreads] = useState<WorkspaceThread[]>([]);
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [sheets, setSheets] = useState<WorkspaceSheet[]>([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadedThreadRef = useRef<string | null>(null);

  const client = BOOKS_CLIENTS.find((c) => c.id === clientId) ?? BOOKS_CLIENTS[0];
  const activeThread = threads.find((t) => t.id === threadId) ?? null;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth?role=bookkeeper", { replace: true });
  };

  const loadSheets = useCallback(async () => {
    try {
      setSheets(await fetchSheets(clientId));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load sheets");
    }
  }, [clientId]);

  const loadThreads = useCallback(async () => {
    try {
      const list = await fetchThreads(clientId);
      setThreads(list);
      return list;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not load conversations");
      return [];
    }
  }, [clientId]);

  useEffect(() => {
    void loadThreads();
    void loadSheets();
  }, [loadThreads, loadSheets]);

  // Load the messages for the thread named in the URL. Threads created from the
  // composer are marked as already loaded so the in-flight exchange is not wiped.
  useEffect(() => {
    if (!threadId) {
      setMessages([]);
      return;
    }
    if (loadedThreadRef.current === threadId) return;
    loadedThreadRef.current = threadId;
    let cancelled = false;
    setLoadingThread(true);
    fetchMessages(threadId)
      .then((m) => {
        if (!cancelled) setMessages(m);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Could not load this conversation"))
      .finally(() => {
        if (!cancelled) setLoadingThread(false);
      });
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  useEffect(() => {
    composerRef.current?.focus();
  }, [threadId, sending]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const startThread = async () => {
    try {
      const thread = await createThread(clientId, null, "New conversation");
      setThreads((prev) => [thread, ...prev]);
      navigate(`/workspace/${thread.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not start a conversation");
    }
  };

  const removeThread = async (id: string) => {
    try {
      await deleteThread(id);
      const remaining = threads.filter((t) => t.id !== id);
      setThreads(remaining);
      if (threadId === id) navigate("/workspace", { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete the conversation");
    }
  };

  const pickFiles = (list: FileList | null) => {
    if (!list) return;
    const accepted: File[] = [];
    for (const file of Array.from(list)) {
      if (file.size > MAX_ATTACHMENT_BYTES) {
        toast.error(`${file.name} is larger than 15 MB.`);
        continue;
      }
      accepted.push(file);
    }
    setFiles((prev) => [...prev, ...accepted].slice(0, 6));
  };

  const submit = async () => {
    const text = input.trim();
    if ((!text && files.length === 0) || sending) return;

    let id = threadId;
    if (!id) {
      try {
        const thread = await createThread(clientId, null, text.slice(0, 60) || files[0]?.name || "New conversation");
        setThreads((prev) => [thread, ...prev]);
        id = thread.id;
        navigate(`/workspace/${thread.id}`, { replace: true });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not start a conversation");
        return;
      }
    }

    const attachmentMeta = files.map((f) => ({ name: f.name, mimeType: f.type || "application/octet-stream" }));
    const optimistic: WorkspaceMessage = {
      id: `local-${Date.now()}`,
      thread_id: id,
      role: "user",
      content: text,
      attachments: attachmentMeta,
      actions: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setSending(true);

    try {
      const payload: OutgoingAttachment[] = [];
      for (const file of files) payload.push(await readAttachment(file));
      setFiles([]);

      const result = await sendWorkspaceMessage({
        threadId: id,
        clientId,
        clientName: client.name,
        period: activeThread?.period ?? null,
        message: text,
        attachments: payload,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          thread_id: id!,
          role: "assistant",
          content: result.reply,
          attachments: [],
          actions: result.actions ?? [],
          created_at: new Date().toISOString(),
        },
      ]);

      if (result.actions?.length) await loadSheets();

      // Give a fresh thread a meaningful title from its first message.
      const thread = threads.find((t) => t.id === id);
      if (thread && thread.title === "New conversation" && text) {
        const title = text.slice(0, 60);
        await renameThread(id, title);
        setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "The workspace assistant failed");
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="futuristic-bg relative min-h-screen overflow-hidden">
      <div className="light-beam light-beam-left opacity-50" />
      <div className="light-beam light-beam-right opacity-50" />

      <FuturisticSidebar onSignOut={handleSignOut} />

      <div className="ml-16">
        <div className="mx-auto max-w-[1600px] px-6 py-8 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <FuturisticHeader
              title="AI Workspace"
              subtitle="Bookkeepers only. Attach statements, let the assistant draft the books, then publish tabs to the client when they are ready."
              accountEmail={user?.email ?? undefined}
              onSignOut={handleSignOut}
            />

            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Select value={clientId} onValueChange={(v) => { setClientId(v); navigate("/workspace"); }}>
                <SelectTrigger className="h-9 w-[280px] text-[12.5px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKS_CLIENTS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={startThread} className="h-9 text-[12.5px]">
                <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" /> New conversation
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[240px_minmax(0,1fr)_400px]">
              {/* Threads */}
              <aside className="glass-panel rounded-2xl p-3">
                <h2 className="mb-2 px-1 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Conversations
                </h2>
                {threads.length === 0 ? (
                  <p className="px-1 text-[12px] text-muted-foreground">No conversations yet.</p>
                ) : (
                  <ul className="space-y-1">
                    {threads.map((t) => (
                      <li
                        key={t.id}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-2 py-1.5",
                          t.id === threadId ? "bg-primary/15" : "hover:bg-white/[0.04]",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/workspace/${t.id}`)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <span className="block truncate text-[12.5px]">{t.title}</span>
                          <span className="block text-[10.5px] text-muted-foreground">
                            {new Date(t.updated_at).toLocaleDateString()}
                          </span>
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${t.title}`}
                          onClick={() => removeThread(t.id)}
                          className="rounded p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </aside>

              {/* Chat */}
              <section className="glass-panel flex min-h-[620px] flex-col rounded-2xl">
                <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                  {loadingThread && <p className="text-[12px] text-muted-foreground">Loading conversation…</p>}

                  {!loadingThread && messages.length === 0 && (
                    <div className="mx-auto max-w-xl py-10 text-center">
                      <Sparkles className="mx-auto mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                      <h3 className="text-[15px] font-semibold">Draft {client.name}'s books</h3>
                      <p className="mt-1 text-[12.5px] text-muted-foreground">
                        Attach statements (PDF, image, CSV/Excel export) and tell the assistant what to build. Everything
                        it creates stays a draft until you publish it.
                      </p>
                      <div className="mt-5 grid gap-2 text-left">
                        {SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setInput(s)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-[12px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((m) => (
                    <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                          m.role === "user" ? "bg-primary/20" : "border border-white/10 bg-white/[0.03]",
                        )}
                      >
                        {m.content && <p className="whitespace-pre-wrap">{m.content}</p>}
                        {m.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {m.attachments.map((a) => (
                              <Badge key={a.name} variant="outline" className="text-[10.5px]">
                                <Paperclip className="mr-1 h-3 w-3" aria-hidden="true" />
                                {a.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {m.actions.length > 0 && (
                          <ul className="mt-2 space-y-1 border-t border-white/10 pt-2 text-[11.5px] text-primary">
                            {m.actions.map((a, i) => (
                              <li key={i}>✓ {a.summary}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}

                  {sending && (
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                      Reading the documents and drafting…
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 p-3">
                  {files.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {files.map((f) => (
                        <Badge key={f.name} variant="secondary" className="text-[10.5px]">
                          {f.name}
                          <button
                            type="button"
                            aria-label={`Remove ${f.name}`}
                            onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}
                            className="ml-1"
                          >
                            <X className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <input
                      ref={fileRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        pickFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Attach files"
                      onClick={() => fileRef.current?.click()}
                      className="h-10 w-10 shrink-0"
                    >
                      <Paperclip className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Textarea
                      ref={composerRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void submit();
                        }
                      }}
                      rows={2}
                      placeholder={`Ask the assistant to draft ${client.name}'s books…`}
                      className="min-h-[44px] resize-none text-[13px]"
                    />
                    <Button
                      onClick={() => void submit()}
                      disabled={sending || (!input.trim() && files.length === 0)}
                      className="h-10 shrink-0"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </div>
              </section>

              {/* Drafts / publishing */}
              <aside className="glass-panel rounded-2xl p-4">
                <h2 className="mb-3 text-[13px] font-semibold">Generated tabs — {client.name}</h2>
                <DraftSheetsPanel sheets={sheets} onChanged={loadSheets} />
              </aside>
            </div>
          </motion.div>
        </div>

        <SiteFooter className="mt-16" />
      </div>
    </div>
  );
};

export default WorkspacePage;
