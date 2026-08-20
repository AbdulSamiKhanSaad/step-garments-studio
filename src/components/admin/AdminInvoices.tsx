import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Download, Plus, Trash2, FileText } from "lucide-react";
import { COMPANY, computeTotals, generateInvoicePdf, parseItems, type InvoiceItem } from "@/lib/invoicePdf";

interface Profile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
}

const emptyItem = (): InvoiceItem => ({ description: "", hs_code: "", quantity: 1, unit: "pcs", unit_price: 0 });

const today = () => new Date().toISOString().slice(0, 10);
const inDays = (days: number) => new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [form, setForm] = useState({
    user_id: "",
    order_id: "",
    issue_date: today(),
    due_date: inDays(30),
    currency: "USD",
    po_number: "",
    status: "unpaid",
    bill_to_name: "",
    bill_to_company: "",
    bill_to_email: "",
    bill_to_address: "",
    bill_to_tax_id: "",
    ship_to_address: "",
    discount: "0",
    tax_label: "VAT/GST",
    tax_rate: "0",
    shipping_cost: "0",
    incoterms: "FOB",
    country_of_origin: "Pakistan",
    hs_code: "6109.10",
    payment_terms: "50% advance, 50% before shipment (Net 30)",
    bank_details: COMPANY.bank,
    notes: "",
    terms: "",
  });

  const fetchAll = async () => {
    const [inv, profs, ords] = await Promise.all([
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, full_name, email, company, phone").order("full_name"),
      supabase.from("orders").select("id, order_number, ref_no, user_id, product_type").order("created_at", { ascending: false }),
    ]);
    setInvoices(inv.data || []);
    setProfiles((profs.data as Profile[]) || []);
    setOrders(ords.data || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const profileMap = useMemo(() => Object.fromEntries(profiles.map((p) => [p.user_id, p])), [profiles]);

  const totals = computeTotals(items, Number(form.discount) || 0, Number(form.tax_rate) || 0, Number(form.shipping_cost) || 0);

  const selectCustomer = (userId: string) => {
    const p = profileMap[userId];
    setForm((f) => ({
      ...f,
      user_id: userId,
      order_id: "",
      bill_to_name: p?.full_name || f.bill_to_name,
      bill_to_company: p?.company || f.bill_to_company,
      bill_to_email: p?.email || f.bill_to_email,
    }));
  };

  const updateItem = (index: number, patch: Partial<InvoiceItem>) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user_id) { toast({ title: "Select a customer", variant: "destructive" }); return; }
    const orderId = form.order_id || orders.find((o) => o.user_id === form.user_id)?.id;
    if (!orderId) {
      toast({ title: "No order available", description: "Create an order for this customer first — an invoice must be linked to one.", variant: "destructive" });
      return;
    }
    const validItems = items.filter((i) => i.description.trim());
    if (!validItems.length) { toast({ title: "Add at least one line item", variant: "destructive" }); return; }

    setSaving(true);
    const { error } = await supabase.from("invoices").insert({
      user_id: form.user_id,
      order_id: orderId,
      issue_date: form.issue_date,
      due_date: form.due_date || null,
      currency: form.currency,
      po_number: form.po_number,
      status: form.status,
      bill_to_name: form.bill_to_name,
      bill_to_company: form.bill_to_company,
      bill_to_email: form.bill_to_email,
      bill_to_address: form.bill_to_address,
      bill_to_tax_id: form.bill_to_tax_id,
      ship_to_address: form.ship_to_address,
      items: validItems as unknown as never,
      subtotal: totals.subtotal,
      discount: Number(form.discount) || 0,
      tax_label: form.tax_label,
      tax_rate: Number(form.tax_rate) || 0,
      tax_amount: totals.taxAmount,
      shipping_cost: Number(form.shipping_cost) || 0,
      amount: totals.total,
      incoterms: form.incoterms,
      country_of_origin: form.country_of_origin,
      hs_code: form.hs_code,
      payment_terms: form.payment_terms,
      bank_details: form.bank_details,
      notes: form.notes,
      terms: form.terms,
    });
    setSaving(false);
    if (error) { toast({ title: "Invoice not created", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Invoice created", description: "The customer can now view and download it." });
    setShowForm(false);
    setItems([emptyItem()]);
    fetchAll();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("invoices").update({ status }).eq("id", id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Marked ${status}` });
    fetchAll();
  };

  const removeInvoice = async (id: string) => {
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Invoice deleted" });
    fetchAll();
  };

  const statusColor: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    unpaid: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-muted text-muted-foreground",
  };

  const input = "w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm";
  const label = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Invoices</h2>
          <p className="text-sm text-muted-foreground">Create compliant commercial invoices with tax, incoterms and branded PDF export.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2">
          {showForm ? "Cancel" : "New Invoice"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={createInvoice} className="bg-card border border-border rounded-lg p-6 mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={label}>Customer</label>
              <select value={form.user_id} onChange={(e) => selectCustomer(e.target.value)} required className={input}>
                <option value="">Select customer</option>
                {profiles.map((p) => (
                  <option key={p.user_id} value={p.user_id}>{p.full_name || p.email} {p.company ? `— ${p.company}` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Linked Order</label>
              <select value={form.order_id} onChange={(e) => setForm({ ...form, order_id: e.target.value })} className={input}>
                <option value="">Latest order for this customer</option>
                {orders.filter((o) => !form.user_id || o.user_id === form.user_id).map((o) => (
                  <option key={o.id} value={o.id}>#{o.ref_no ?? "—"} · {o.order_number} · {o.product_type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={input}>
                {["unpaid", "paid", "overdue", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className={label}>Issue Date</label><input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} className={input} /></div>
            <div><label className={label}>Due Date</label><input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className={input} /></div>
            <div>
              <label className={label}>Currency</label>
              <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={input}>
                {["USD", "EUR", "GBP", "AED", "PKR"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={label}>PO Number</label><input value={form.po_number} onChange={(e) => setForm({ ...form, po_number: e.target.value })} className={input} /></div>
            <div><label className={label}>Buyer Tax / VAT ID</label><input value={form.bill_to_tax_id} onChange={(e) => setForm({ ...form, bill_to_tax_id: e.target.value })} className={input} /></div>
            <div><label className={label}>Buyer Company</label><input value={form.bill_to_company} onChange={(e) => setForm({ ...form, bill_to_company: e.target.value })} className={input} /></div>
            <div><label className={label}>Buyer Contact Name</label><input value={form.bill_to_name} onChange={(e) => setForm({ ...form, bill_to_name: e.target.value })} className={input} /></div>
            <div><label className={label}>Buyer Email</label><input type="email" value={form.bill_to_email} onChange={(e) => setForm({ ...form, bill_to_email: e.target.value })} className={input} /></div>
            <div><label className={label}>Billing Address</label><input value={form.bill_to_address} onChange={(e) => setForm({ ...form, bill_to_address: e.target.value })} className={input} /></div>
            <div className="md:col-span-3"><label className={label}>Shipping Address</label><input value={form.ship_to_address} onChange={(e) => setForm({ ...form, ship_to_address: e.target.value })} className={input} /></div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading font-bold text-sm text-foreground">Line Items</h3>
              <button type="button" onClick={() => setItems([...items, emptyItem()])} className="inline-flex items-center gap-1 text-accent text-sm font-semibold">
                <Plus className="w-4 h-4" />Add item
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, { description: e.target.value })} className="col-span-12 md:col-span-4 h-10 rounded-md border border-input bg-background px-3 text-sm" />
                  <input placeholder="HS code" value={item.hs_code} onChange={(e) => updateItem(i, { hs_code: e.target.value })} className="col-span-4 md:col-span-2 h-10 rounded-md border border-input bg-background px-3 text-sm" />
                  <input type="number" min="0" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} className="col-span-3 md:col-span-1 h-10 rounded-md border border-input bg-background px-3 text-sm" />
                  <input placeholder="Unit" value={item.unit} onChange={(e) => updateItem(i, { unit: e.target.value })} className="col-span-2 md:col-span-1 h-10 rounded-md border border-input bg-background px-3 text-sm" />
                  <input type="number" min="0" step="0.01" placeholder="Unit price" value={item.unit_price} onChange={(e) => updateItem(i, { unit_price: Number(e.target.value) })} className="col-span-3 md:col-span-2 h-10 rounded-md border border-input bg-background px-3 text-sm" />
                  <div className="col-span-8 md:col-span-1 text-sm text-muted-foreground">{(item.quantity * item.unit_price).toFixed(2)}</div>
                  <button type="button" onClick={() => setItems(items.filter((_, index) => index !== i))} className="col-span-4 md:col-span-1 text-red-500 justify-self-end p-2" aria-label="Remove item">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className={label}>Discount</label><input type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className={input} /></div>
            <div><label className={label}>Tax Label</label><input value={form.tax_label} onChange={(e) => setForm({ ...form, tax_label: e.target.value })} className={input} /></div>
            <div><label className={label}>Tax Rate %</label><input type="number" min="0" step="0.01" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} className={input} /></div>
            <div><label className={label}>Freight / Shipping</label><input type="number" min="0" step="0.01" value={form.shipping_cost} onChange={(e) => setForm({ ...form, shipping_cost: e.target.value })} className={input} /></div>
            <div><label className={label}>Incoterms</label>
              <select value={form.incoterms} onChange={(e) => setForm({ ...form, incoterms: e.target.value })} className={input}>
                {["EXW", "FOB", "FCA", "CIF", "CFR", "DAP", "DDP"].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div><label className={label}>Country of Origin</label><input value={form.country_of_origin} onChange={(e) => setForm({ ...form, country_of_origin: e.target.value })} className={input} /></div>
            <div><label className={label}>Consignment HS Code</label><input value={form.hs_code} onChange={(e) => setForm({ ...form, hs_code: e.target.value })} className={input} /></div>
            <div><label className={label}>Payment Terms</label><input value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} className={input} /></div>
            <div className="md:col-span-2"><label className={label}>Bank Details</label><input value={form.bank_details} onChange={(e) => setForm({ ...form, bank_details: e.target.value })} className={input} /></div>
            <div className="md:col-span-2"><label className={label}>Notes</label><input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={input} /></div>
            <div className="md:col-span-4"><label className={label}>Terms & Conditions (optional override)</label><textarea value={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.value })} rows={2} className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p>Subtotal: <span className="text-foreground font-medium">{form.currency} {totals.subtotal.toFixed(2)}</span></p>
              <p>{form.tax_label} ({form.tax_rate || 0}%): <span className="text-foreground font-medium">{form.currency} {totals.taxAmount.toFixed(2)}</span></p>
              <p className="text-base text-foreground font-bold">Total: {form.currency} {totals.total.toFixed(2)}</p>
            </div>
            <button type="submit" disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-60">
              {saving ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {invoices.length === 0 && <p className="text-sm text-muted-foreground">No invoices yet.</p>}
        {invoices.map((inv) => {
          const profile = profileMap[inv.user_id];
          const lineCount = parseItems(inv.items).length;
          return (
            <div key={inv.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <p className="font-bold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    {inv.invoice_number} <span className="text-xs text-muted-foreground font-normal">#{inv.ref_no ?? "—"}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.full_name || profile?.email || inv.bill_to_name || "Customer"} • {inv.currency || "USD"} {Number(inv.amount || 0).toFixed(2)} • {lineCount} item{lineCount === 1 ? "" : "s"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Issued {inv.issue_date || "—"} • Due {inv.due_date || "—"} • {inv.incoterms || "—"} • {inv.tax_label || "Tax"} {Number(inv.tax_rate || 0)}%
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[inv.status] || "bg-muted text-muted-foreground"}`}>{inv.status}</span>
                  <select value={inv.status} onChange={(e) => updateStatus(inv.id, e.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium">
                    {["unpaid", "paid", "overdue", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => generateInvoicePdf(inv)} className="inline-flex items-center gap-1 h-8 px-3 rounded-md bg-accent text-accent-foreground text-xs font-semibold">
                    <Download className="w-3.5 h-3.5" />PDF
                  </button>
                  <button onClick={() => removeInvoice(inv.id)} className="h-8 px-2 rounded-md border border-border text-red-500" aria-label="Delete invoice">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminInvoices;
