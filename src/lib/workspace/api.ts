import { supabase } from "@/integrations/supabase/client";

export interface WorkspaceThread {
  id: string;
  client_id: string;
  period: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceAttachment {
  name: string;
  mimeType: string;
}

export interface WorkspaceAction {
  tool: string;
  summary: string;
}

export interface WorkspaceMessage {
  id: string;
  thread_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments: WorkspaceAttachment[];
  actions: WorkspaceAction[];
  created_at: string;
}

export interface WorkspaceSheet {
  id: string;
  client_id: string;
  name: string;
  sheet_type: string;
  period: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  data: { columns?: string[]; rows?: Record<string, unknown>[]; notes?: string | null };
}

/** Files sent to the model: text is inlined, PDFs/images ride as base64 data URLs. */
export interface OutgoingAttachment {
  name: string;
  mimeType: string;
  dataUrl?: string;
  text?: string;
}

export const MAX_ATTACHMENT_BYTES = 15 * 1024 * 1024;

const TEXTUAL = /\.(csv|txt|tsv|json|md|ofx|qfx|qbo|xml|yml|yaml|log|rtf)$/i;
const SPREADSHEET = /\.(xlsx|xlsm|xls|numbers)$/i;
const WORD = /\.(docx)$/i;
const HTML = /\.(html?|htm)$/i;

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

const stripHtml = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body?.textContent?.replace(/\n{3,}/g, "\n\n").trim() ?? "";

export async function readAttachment(file: File): Promise<OutgoingAttachment> {
  const mimeType = file.type || "application/octet-stream";

  // Images and PDFs go to the model natively.
  if (mimeType.startsWith("image/") || mimeType === "application/pdf" || /\.pdf$/i.test(file.name)) {
    return { name: file.name, mimeType: mimeType === "application/octet-stream" ? "application/pdf" : mimeType, dataUrl: await toDataUrl(file) };
  }

  // Spreadsheets → CSV text per sheet.
  if (SPREADSHEET.test(file.name) || mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const text = wb.SheetNames.map(
      (n) => `--- Sheet: ${n} ---\n${XLSX.utils.sheet_to_csv(wb.Sheets[n])}`,
    ).join("\n\n");
    return { name: file.name, mimeType, text };
  }

  // Word documents → plain text.
  if (WORD.test(file.name) || mimeType.includes("wordprocessing")) {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return { name: file.name, mimeType, text: value };
  }

  if (HTML.test(file.name) || mimeType === "text/html") {
    return { name: file.name, mimeType, text: stripHtml(await file.text()) };
  }

  if (TEXTUAL.test(file.name) || mimeType.startsWith("text/") || mimeType === "application/json") {
    return { name: file.name, mimeType, text: await file.text() };
  }

  // Unknown type: try reading it as text, otherwise send the bytes and let the server decide.
  try {
    const text = await file.text();
    // Reject binary garbage (lots of control characters).
    const suspect = (text.match(/[\u0000-\u0008\u000E-\u001F]/g) ?? []).length;
    if (text.trim() && suspect / Math.max(text.length, 1) < 0.01) {
      return { name: file.name, mimeType, text };
    }
  } catch {
    /* fall through */
  }
  return { name: file.name, mimeType, dataUrl: await toDataUrl(file) };
}


export async function fetchThreads(clientId: string) {
  const { data, error } = await supabase
    .from("workspace_threads")
    .select("id, client_id, period, title, created_at, updated_at")
    .eq("client_id", clientId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as WorkspaceThread[];
}

export async function createThread(clientId: string, period: string | null, title: string) {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("workspace_threads")
    .insert({ client_id: clientId, period, title, created_by: userData?.user?.id ?? null })
    .select("id, client_id, period, title, created_at, updated_at")
    .single();
  if (error) throw error;
  return data as WorkspaceThread;
}

export async function renameThread(threadId: string, title: string) {
  const { error } = await supabase.from("workspace_threads").update({ title }).eq("id", threadId);
  if (error) throw error;
}

export async function deleteThread(threadId: string) {
  const { error } = await supabase.from("workspace_threads").delete().eq("id", threadId);
  if (error) throw error;
}

export async function fetchMessages(threadId: string) {
  const { data, error } = await supabase
    .from("workspace_messages")
    .select("id, thread_id, role, content, attachments, actions, created_at")
    .eq("thread_id", threadId)
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((m) => ({
    ...m,
    attachments: (m.attachments ?? []) as unknown as WorkspaceAttachment[],
    actions: (m.actions ?? []) as unknown as WorkspaceAction[],
  })) as WorkspaceMessage[];
}

export async function fetchSheets(clientId: string) {
  const { data, error } = await supabase
    .from("financial_sheets")
    .select("id, client_id, name, sheet_type, period, is_published, published_at, created_at, data")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as WorkspaceSheet[];
}

export async function setSheetPublished(sheetId: string, published: boolean) {
  const { error } = await supabase
    .from("financial_sheets")
    .update({ is_published: published, published_at: published ? new Date().toISOString() : null })
    .eq("id", sheetId);
  if (error) throw error;
}

export async function deleteSheet(sheetId: string) {
  const { error } = await supabase.from("financial_sheets").delete().eq("id", sheetId);
  if (error) throw error;
}

export interface SendResult {
  reply: string;
  actions: WorkspaceAction[];
}

export async function sendWorkspaceMessage(input: {
  threadId: string;
  clientId: string;
  clientName: string;
  period?: string | null;
  message: string;
  attachments: OutgoingAttachment[];
}) {
  const { data, error } = await supabase.functions.invoke("workspace-chat", {
    body: {
      threadId: input.threadId,
      clientId: input.clientId,
      clientName: input.clientName,
      period: input.period ?? "",
      message: input.message,
      attachments: input.attachments,
    },
  });

  if (error) {
    let detail = error.message;
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const body = await ctx.json();
        if (body?.error) detail = body.error;
      } catch {
        /* keep the original message */
      }
    }
    throw new Error(detail);
  }
  if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);
  return data as SendResult;
}
