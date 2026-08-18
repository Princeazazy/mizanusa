import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Loader2,
  Mail,
  Plus,
  Trash2,
  Users,
  Pencil,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  BillingCustomer,
  ClientInvoice,
  InvoiceItem,
  deleteCustomer,
  deleteInvoice,
  fetchInvoicing,
  fmtMoney,
  recordPayment,
  saveCustomer,
  saveInvoice,
  sendInvoice,
  voidInvoice,
  type InvoicingAuth,
} from "@/lib/invoicing/api";

interface InvoicingPanelProps {
  clientId: string;
  clientName?: string;
  sessionToken?: string;
}

const blankItem = (): InvoiceItem => ({ description: "", quantity: 1, rate: 0, amount: 0 });

const statusStyles: Record<string, string> = {
  draft: "bg-muted/40 text-muted-foreground border-border/40",
  sent: "bg-primary/15 text-primary border-primary/30",
  partial: "bg-warning/15 text-warning border-warning/30",
  paid: "bg-income/15 text-income border-income/30",
  void: "bg-destructive/15 text-destructive border-destructive/30",
};

export const InvoicingPanel = ({ clientId, clientName, sessionToken }: InvoicingPanelProps) => {
  const { toast } = useToast();
  const auth: InvoicingAuth = useMemo(() => ({ clientId, sessionToken }), [clientId, sessionToken]);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [customers, setCustomers] = useState<BillingCustomer[]>([]);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<ClientInvoice | null>(null);
  const [customersOpen, setCustomersOpen] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    bill_to_name: "",
    bill_to_email: "",
    bill_to_address: "",
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: "",
    tax_rate: 0,
    notes: "",
    terms: "Payment due within 30 days.",
  });
  const [items, setItems] = useState<InvoiceItem[]>([blankItem()]);

  const [customerDraft, setCustomerDraft] = useState({ name: "", email: "", phone: "", address: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchInvoicing(auth);
      setInvoices(data.invoices ?? []);
      setCustomers(data.customers ?? []);
    } catch (error) {
      toast({
        title: "Could not load invoices",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [auth, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const subtotal = items.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.rate || 0), 0);
  const taxAmount = (subtotal * Number(form.tax_rate || 0)) / 100;
  const total = subtotal + taxAmount;

  const totals = useMemo(() => {
    const live = invoices.filter((i) => i.status !== "void");
    const invoiced = live.reduce((s, i) => s + Number(i.total), 0);
    const paid = live.reduce((s, i) => s + Number(i.amount_paid), 0);
    return { invoiced, paid, outstanding: invoiced - paid, count: live.length };
  }, [invoices]);

  const openNew = () => {
    setEditing(null);
    setForm({
      customer_id: "",
      bill_to_name: "",
      bill_to_email: "",
      bill_to_address: "",
      issue_date: new Date().toISOString().slice(0, 10),
      due_date: "",
      tax_rate: 0,
      notes: "",
      terms: "Payment due within 30 days.",
    });
    setItems([blankItem()]);
    setEditorOpen(true);
  };

  const openEdit = (invoice: ClientInvoice) => {
    setEditing(invoice);
    setForm({
      customer_id: invoice.customer_id ?? "",
      bill_to_name: invoice.bill_to_name ?? "",
      bill_to_email: invoice.bill_to_email ?? "",
      bill_to_address: invoice.bill_to_address ?? "",
      issue_date: invoice.issue_date,
      due_date: invoice.due_date ?? "",
      tax_rate: Number(invoice.tax_rate ?? 0),
      notes: invoice.notes ?? "",
      terms: invoice.terms ?? "",
    });
    setItems(
      (invoice.items ?? []).length
        ? [...invoice.items]
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((i) => ({ ...i, quantity: Number(i.quantity), rate: Number(i.rate) }))
        : [blankItem()],
    );
    setEditorOpen(true);
  };

  const handleSave = async () => {
    if (items.every((i) => !i.description.trim())) {
      toast({ title: "Add at least one line item", variant: "destructive" });
      return;
    }
    setBusy("save");
    try {
      await saveInvoice(
        auth,
        {
          id: editing?.id,
          invoice_number: editing?.invoice_number,
          customer_id: form.customer_id || null,
          bill_to_name: form.bill_to_name,
          bill_to_email: form.bill_to_email,
          bill_to_address: form.bill_to_address,
          issue_date: form.issue_date,
          due_date: form.due_date || null,
          tax_rate: Number(form.tax_rate || 0),
          amount_paid: editing ? Number(editing.amount_paid) : 0,
          notes: form.notes,
          terms: form.terms,
        } as Partial<ClientInvoice>,
        items.filter((i) => i.description.trim()),
      );
      setEditorOpen(false);
      toast({ title: editing ? "Invoice updated" : "Invoice created" });
      await load();
    } catch (error) {
      toast({
        title: "Could not save invoice",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  const runAction = async (key: string, fn: () => Promise<unknown>, success: string) => {
    setBusy(key);
    try {
      await fn();
      toast({ title: success });
      await load();
    } catch (error) {
      toast({
        title: "Action failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  const handleCustomerSave = async () => {
    setBusy("customer");
    try {
      await saveCustomer(auth, customerDraft);
      setCustomerDraft({ name: "", email: "", phone: "", address: "" });
      toast({ title: "Customer saved" });
      await load();
    } catch (error) {
      toast({
        title: "Could not save customer",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(null);
    }
  };

  const updateItem = (index: number, patch: Partial<InvoiceItem>) =>
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Invoicing</h2>
          <p className="text-sm text-muted-foreground">
            Bill {clientName ? `${clientName}'s` : "your"} customers by email and track what is paid.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCustomersOpen(true)} className="gap-2">
            <Users className="h-4 w-4" /> Customers
          </Button>
          <Button onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> New invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Invoices", value: String(totals.count) },
          { label: "Invoiced", value: fmtMoney(totals.invoiced) },
          { label: "Collected", value: fmtMoney(totals.paid), tone: "text-income" },
          {
            label: "Outstanding",
            value: fmtMoney(totals.outstanding),
            tone: totals.outstanding > 0 ? "text-warning" : "text-income",
          },
        ].map((card) => (
          <div key={card.label} className="glass-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.tone ?? "text-foreground"}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading invoices…
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-10 text-center">
            <BadgeDollarSign className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-medium text-foreground">No invoices yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first invoice and email it straight to the customer.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/30">
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-border/20">
                  <TableCell className="font-mono font-medium text-foreground">
                    #{invoice.invoice_number}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{invoice.issue_date}</TableCell>
                  <TableCell className="max-w-[220px] truncate text-foreground">
                    {invoice.bill_to_name}
                    <span className="block truncate text-xs text-muted-foreground">
                      {invoice.bill_to_email}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {fmtMoney(Number(invoice.total))}
                  </TableCell>
                  <TableCell className="text-right text-income">
                    {fmtMoney(Number(invoice.amount_paid))}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusStyles[invoice.status]}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1"
                        disabled={busy !== null || invoice.status === "void"}
                        onClick={() =>
                          runAction(
                            `send-${invoice.id}`,
                            () => sendInvoice(auth, invoice.id),
                            `Invoice #${invoice.invoice_number} emailed`,
                          )
                        }
                      >
                        {busy === `send-${invoice.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )}
                        Send
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy !== null || invoice.status === "void"}
                        onClick={() =>
                          runAction(
                            `paid-${invoice.id}`,
                            () => recordPayment(auth, invoice.id, Number(invoice.total)),
                            "Marked as paid",
                          )
                        }
                      >
                        Mark paid
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(invoice)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy !== null || invoice.status === "void"}
                        onClick={() =>
                          runAction(
                            `void-${invoice.id}`,
                            () => voidInvoice(auth, invoice.id),
                            "Invoice voided",
                          )
                        }
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy !== null}
                        onClick={() =>
                          runAction(
                            `del-${invoice.id}`,
                            () => deleteInvoice(auth, invoice.id),
                            "Invoice deleted",
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Invoice editor */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit invoice #${editing.invoice_number}` : "New invoice"}</DialogTitle>
            <DialogDescription>
              Line items, tax and terms. The invoice emails as a branded statement from Mizan.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select
                  value={form.customer_id || "manual"}
                  onValueChange={(value) => {
                    if (value === "manual") {
                      setForm((f) => ({ ...f, customer_id: "" }));
                      return;
                    }
                    const customer = customers.find((c) => c.id === value);
                    setForm((f) => ({
                      ...f,
                      customer_id: value,
                      bill_to_name: customer?.name ?? "",
                      bill_to_email: customer?.email ?? "",
                      bill_to_address: customer?.address ?? "",
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a saved customer" />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    <SelectItem value="manual">Enter manually</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bill to (name)</Label>
                <Input
                  value={form.bill_to_name}
                  onChange={(e) => setForm((f) => ({ ...f, bill_to_name: e.target.value }))}
                  placeholder="Acme Property Co"
                />
              </div>
              <div className="space-y-2">
                <Label>Customer email</Label>
                <Input
                  type="email"
                  value={form.bill_to_email}
                  onChange={(e) => setForm((f) => ({ ...f, bill_to_email: e.target.value }))}
                  placeholder="ap@acme.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Billing address</Label>
                <Input
                  value={form.bill_to_address}
                  onChange={(e) => setForm((f) => ({ ...f, bill_to_address: e.target.value }))}
                  placeholder="123 Market St, Philadelphia, PA"
                />
              </div>
              <div className="space-y-2">
                <Label>Issue date</Label>
                <Input
                  type="date"
                  value={form.issue_date}
                  onChange={(e) => setForm((f) => ({ ...f, issue_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Due date</Label>
                <Input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Line items</Label>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2">
                    <Input
                      className="col-span-6"
                      placeholder="Description of work"
                      value={item.description}
                      onChange={(e) => updateItem(index, { description: e.target.value })}
                    />
                    <Input
                      className="col-span-2"
                      type="number"
                      step="0.01"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, { quantity: Number(e.target.value) })}
                    />
                    <Input
                      className="col-span-2"
                      type="number"
                      step="0.01"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(index, { rate: Number(e.target.value) })}
                    />
                    <div className="col-span-1 flex items-center justify-end text-sm text-foreground">
                      {fmtMoney(Number(item.quantity || 0) * Number(item.rate || 0))}
                    </div>
                    <Button
                      className="col-span-1"
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setItems((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setItems((p) => [...p, blankItem()])}>
                <Plus className="h-4 w-4" /> Add line
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tax rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.tax_rate}
                  onChange={(e) => setForm((f) => ({ ...f, tax_rate: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1 rounded-lg border border-border/40 p-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{fmtMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>{fmtMoney(taxAmount)}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span>{fmtMoney(total)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Notes to customer</Label>
                <Textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment terms</Label>
                <Textarea
                  rows={3}
                  value={form.terms}
                  onChange={(e) => setForm((f) => ({ ...f, terms: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={busy === "save"} className="gap-2">
              {busy === "save" && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Save changes" : "Create invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Customer book */}
      <Dialog open={customersOpen} onOpenChange={setCustomersOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customers</DialogTitle>
            <DialogDescription>Saved billing contacts you can invoice in one click.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {customers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved customers yet.</p>
            ) : (
              customers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between rounded-lg border border-border/40 p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{customer.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {customer.email}
                      {customer.phone ? ` · ${customer.phone}` : ""}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={busy !== null}
                    onClick={() =>
                      runAction(`cust-${customer.id}`, () => deleteCustomer(auth, customer.id), "Customer removed")
                    }
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3 border-t border-border/40 pt-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Customer name"
                value={customerDraft.name}
                onChange={(e) => setCustomerDraft((c) => ({ ...c, name: e.target.value }))}
              />
              <Input
                type="email"
                placeholder="Email"
                value={customerDraft.email}
                onChange={(e) => setCustomerDraft((c) => ({ ...c, email: e.target.value }))}
              />
              <Input
                placeholder="Phone (optional)"
                value={customerDraft.phone}
                onChange={(e) => setCustomerDraft((c) => ({ ...c, phone: e.target.value }))}
              />
              <Input
                placeholder="Address (optional)"
                value={customerDraft.address}
                onChange={(e) => setCustomerDraft((c) => ({ ...c, address: e.target.value }))}
              />
            </div>
            <Button onClick={handleCustomerSave} disabled={busy === "customer"} className="gap-2">
              {busy === "customer" && <Loader2 className="h-4 w-4 animate-spin" />}
              Add customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicingPanel;
