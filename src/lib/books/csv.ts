import type { ColumnMapping } from "./types";

/** Minimal RFC4180-ish CSV parser (handles quoted fields and embedded commas/newlines). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const src = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
      continue;
    }
    if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      field = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((v) => v.trim() !== "")) rows.push(row);
  return rows.map((r) => r.map((v) => v.trim()));
}

const AMOUNT_CLEAN = /[$,\s]/g;

export function parseAmount(value: string): number | null {
  if (!value) return null;
  let raw = value.replace(AMOUNT_CLEAN, "");
  let negative = false;
  if (/^\(.*\)$/.test(raw)) {
    negative = true;
    raw = raw.slice(1, -1);
  }
  if (raw.startsWith("-")) {
    negative = true;
    raw = raw.slice(1);
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

/** Accepts MM/DD/YYYY, M/D/YY, YYYY-MM-DD, and "Apr 3, 2026". Returns ISO yyyy-mm-dd. */
export function parseDate(value: string, fallbackYear = new Date().getFullYear()): string | null {
  if (!value) return null;
  const v = value.trim();
  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const slash = v.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/);
  if (slash) {
    const month = Number(slash[1]);
    const day = Number(slash[2]);
    let year = slash[3] ? Number(slash[3]) : fallbackYear;
    if (year < 100) year += 2000;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  const parsed = new Date(v);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(
      parsed.getDate(),
    ).padStart(2, "0")}`;
  }
  return null;
}

const HEADER_HINTS: Record<keyof ColumnMapping, string[]> = {
  date: ["date", "posted", "transaction date", "post date"],
  description: ["description", "memo", "details", "narrative", "transaction"],
  amount: ["amount", "value", "net"],
  debit: ["debit", "withdrawal", "withdrawals", "money out", "paid out"],
  credit: ["credit", "deposit", "deposits", "money in", "paid in"],
  payee: ["payee", "merchant", "name", "vendor"],
  positiveIsIn: [],
};

/** Best-effort auto-detection of a bank's column layout. */
export function guessMapping(headers: string[]): ColumnMapping {
  const find = (keys: string[]) =>
    headers.find((h) => keys.some((k) => h.toLowerCase() === k)) ??
    headers.find((h) => keys.some((k) => h.toLowerCase().includes(k)));

  return {
    date: find(HEADER_HINTS.date) ?? headers[0] ?? "",
    description: find(HEADER_HINTS.description) ?? headers[1] ?? "",
    amount: find(HEADER_HINTS.amount) ?? "",
    debit: find(HEADER_HINTS.debit),
    credit: find(HEADER_HINTS.credit),
    payee: find(HEADER_HINTS.payee),
    positiveIsIn: true,
  };
}

/** Stable, collision-resistant-enough fingerprint for date + amount + description. */
export function dedupeHash(date: string, amount: number, description: string, source: string) {
  const key = `${date}|${amount.toFixed(2)}|${description.toLowerCase().replace(/\s+/g, " ").trim()}|${source}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < key.length; i++) {
    h1 = ((h1 ^ key.charCodeAt(i)) * 16777619) >>> 0;
    h2 = ((h2 + key.charCodeAt(i) * (i + 7)) * 2654435761) >>> 0;
  }
  return `${h1.toString(36)}${h2.toString(36)}-${key.length.toString(36)}`;
}

export interface MappedRow {
  txn_date: string;
  description: string;
  payee: string | null;
  amount: number;
  direction: "in" | "out";
  raw_row: Record<string, string>;
}

export function mapRows(
  headers: string[],
  rows: string[][],
  mapping: ColumnMapping,
): { rows: MappedRow[]; skipped: number } {
  const idx = (name?: string) => (name ? headers.indexOf(name) : -1);
  const dateI = idx(mapping.date);
  const descI = idx(mapping.description);
  const amountI = idx(mapping.amount);
  const debitI = idx(mapping.debit);
  const creditI = idx(mapping.credit);
  const payeeI = idx(mapping.payee);

  const mapped: MappedRow[] = [];
  let skipped = 0;

  for (const row of rows) {
    const txn_date = parseDate(row[dateI] ?? "");
    const description = (row[descI] ?? "").trim();

    let signed: number | null = null;
    if (debitI >= 0 || creditI >= 0) {
      const debit = debitI >= 0 ? parseAmount(row[debitI] ?? "") : null;
      const credit = creditI >= 0 ? parseAmount(row[creditI] ?? "") : null;
      if (credit) signed = Math.abs(credit);
      else if (debit) signed = -Math.abs(debit);
    }
    if (signed === null && amountI >= 0) {
      const value = parseAmount(row[amountI] ?? "");
      if (value !== null) signed = mapping.positiveIsIn === false ? -value : value;
    }

    if (!txn_date || !description || signed === null || signed === 0) {
      skipped++;
      continue;
    }

    const raw_row: Record<string, string> = {};
    headers.forEach((h, i) => {
      if (row[i]) raw_row[h] = row[i];
    });

    mapped.push({
      txn_date,
      description,
      payee: payeeI >= 0 ? row[payeeI] || null : null,
      amount: Math.abs(signed),
      direction: signed > 0 ? "in" : "out",
      raw_row,
    });
  }

  return { rows: mapped, skipped };
}
