import jsPDF from "jspdf";
import logoUrl from "@/assets/brand-logo.png";

export const COMPANY = {
  name: "Step Garments",
  tagline: "Apparel Manufacturer",
  address: "Plot 42, Industrial Estate, Sialkot 51310, Pakistan",
  email: "sales@stepgarments.com",
  phone: "+92 300 000 0000",
  website: "www.stepgarments.com",
  taxId: "NTN 1234567-8",
  regNo: "Company Reg. No. SG-2019-0042",
  bank: "Bank: Meezan Bank • IBAN: PK00MEZN0000000000000000 • SWIFT: MEZNPKKA",
};

export interface InvoiceItem {
  description: string;
  hs_code?: string;
  quantity: number;
  unit: string;
  unit_price: number;
}

export interface InvoiceRecord {
  invoice_number: string;
  ref_no?: number | null;
  issue_date?: string | null;
  due_date?: string | null;
  currency?: string | null;
  status?: string | null;
  po_number?: string | null;
  bill_to_name?: string | null;
  bill_to_company?: string | null;
  bill_to_email?: string | null;
  bill_to_address?: string | null;
  bill_to_tax_id?: string | null;
  ship_to_address?: string | null;
  items?: InvoiceItem[] | unknown;
  subtotal?: number | null;
  discount?: number | null;
  tax_label?: string | null;
  tax_rate?: number | null;
  tax_amount?: number | null;
  shipping_cost?: number | null;
  amount?: number | null;
  incoterms?: string | null;
  country_of_origin?: string | null;
  hs_code?: string | null;
  payment_terms?: string | null;
  bank_details?: string | null;
  notes?: string | null;
  terms?: string | null;
}

export const parseItems = (raw: unknown): InvoiceItem[] =>
  Array.isArray(raw)
    ? (raw as InvoiceItem[]).map((item) => ({
        description: String(item?.description ?? ""),
        hs_code: item?.hs_code ? String(item.hs_code) : "",
        quantity: Number(item?.quantity) || 0,
        unit: String(item?.unit ?? "pcs"),
        unit_price: Number(item?.unit_price) || 0,
      }))
    : [];

export const computeTotals = (
  items: InvoiceItem[],
  discount = 0,
  taxRate = 0,
  shipping = 0
) => {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const taxable = Math.max(subtotal - discount, 0);
  const taxAmount = (taxable * taxRate) / 100;
  const total = taxable + taxAmount + shipping;
  return { subtotal, taxAmount, total };
};

const loadLogo = async (): Promise<string | null> => {
  try {
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

export const generateInvoicePdf = async (invoice: InvoiceRecord) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 42;
  const currency = invoice.currency || "USD";
  const items = parseItems(invoice.items);
  const money = (value: number) =>
    `${currency} ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const logo = await loadLogo();
  if (logo) doc.addImage(logo, "PNG", margin, 32, 68, 68);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(16, 38, 74);
  doc.text(COMPANY.name.toUpperCase(), margin + 82, 52);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 96, 110);
  doc.text(
    [COMPANY.tagline, COMPANY.address, `${COMPANY.email}  •  ${COMPANY.phone}`, `${COMPANY.website}  •  ${COMPANY.taxId}  •  ${COMPANY.regNo}`],
    margin + 82,
    66
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(16, 38, 74);
  doc.text("INVOICE", pageWidth - margin, 52, { align: "right" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 66, 80);
  const metaLines = [
    `Invoice No: ${invoice.invoice_number}`,
    invoice.ref_no ? `Reference: #${invoice.ref_no}` : "",
    `Issue Date: ${invoice.issue_date || "—"}`,
    `Due Date: ${invoice.due_date || "—"}`,
    invoice.po_number ? `PO No: ${invoice.po_number}` : "",
    `Status: ${(invoice.status || "unpaid").toUpperCase()}`,
  ].filter(Boolean);
  doc.text(metaLines, pageWidth - margin, 68, { align: "right" });

  let y = 128;
  doc.setDrawColor(226, 230, 238);
  doc.line(margin, y - 14, pageWidth - margin, y - 14);

  const colWidth = (pageWidth - margin * 2) / 2 - 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(16, 38, 74);
  doc.text("BILL TO", margin, y);
  doc.text("SHIP TO", margin + colWidth + 20, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 66, 80);
  const billTo = [
    invoice.bill_to_company || "",
    invoice.bill_to_name || "",
    invoice.bill_to_email || "",
    invoice.bill_to_address || "",
    invoice.bill_to_tax_id ? `Tax ID: ${invoice.bill_to_tax_id}` : "",
  ].filter(Boolean);
  doc.text(doc.splitTextToSize(billTo.join("\n") || "—", colWidth), margin, y + 14);
  doc.text(
    doc.splitTextToSize(invoice.ship_to_address || invoice.bill_to_address || "—", colWidth),
    margin + colWidth + 20,
    y + 14
  );

  y += 14 + Math.max(billTo.length, 3) * 12 + 18;

  // Items table
  const cols = [
    { label: "DESCRIPTION", x: margin, w: 210, align: "left" as const },
    { label: "HS CODE", x: margin + 216, w: 70, align: "left" as const },
    { label: "QTY", x: margin + 300, w: 50, align: "right" as const },
    { label: "UNIT PRICE", x: margin + 400, w: 60, align: "right" as const },
    { label: "AMOUNT", x: pageWidth - margin, w: 70, align: "right" as const },
  ];
  doc.setFillColor(16, 38, 74);
  doc.rect(margin - 6, y - 12, pageWidth - margin * 2 + 12, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  cols.forEach((c) => doc.text(c.label, c.x, y + 3, { align: c.align }));
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 44, 56);
  doc.setFontSize(9);
  items.forEach((item, index) => {
    if (y > 660) {
      doc.addPage();
      y = 80;
    }
    if (index % 2 === 1) {
      doc.setFillColor(246, 248, 252);
      doc.rect(margin - 6, y - 11, pageWidth - margin * 2 + 12, 20, "F");
    }
    const desc = doc.splitTextToSize(item.description || "—", 205);
    doc.text(desc, cols[0].x, y + 2);
    doc.text(item.hs_code || "—", cols[1].x, y + 2);
    doc.text(String(item.quantity) + " " + item.unit, cols[2].x, y + 2, { align: "right" });
    doc.text(money(item.unit_price), cols[3].x, y + 2, { align: "right" });
    doc.text(money(item.quantity * item.unit_price), cols[4].x, y + 2, { align: "right" });
    y += Math.max(20, desc.length * 12);
  });
  if (!items.length) {
    doc.text("No line items recorded.", margin, y + 2);
    y += 20;
  }

  // Totals
  const totals = computeTotals(items, Number(invoice.discount) || 0, Number(invoice.tax_rate) || 0, Number(invoice.shipping_cost) || 0);
  const subtotal = Number(invoice.subtotal) || totals.subtotal;
  const taxAmount = Number(invoice.tax_amount) || totals.taxAmount;
  const total = Number(invoice.amount) || totals.total;

  y += 12;
  doc.setDrawColor(226, 230, 238);
  doc.line(pageWidth / 2, y - 8, pageWidth - margin, y - 8);
  const rows: [string, string][] = [
    ["Subtotal", money(subtotal)],
    ...(Number(invoice.discount) ? ([["Discount", `- ${money(Number(invoice.discount))}`]] as [string, string][]) : []),
    [`${invoice.tax_label || "Tax"} (${Number(invoice.tax_rate) || 0}%)`, money(taxAmount)],
    ...(Number(invoice.shipping_cost) ? ([["Freight / Shipping", money(Number(invoice.shipping_cost))]] as [string, string][]) : []),
  ];
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 66, 80);
    doc.text(label, pageWidth / 2, y + 4);
    doc.text(value, pageWidth - margin, y + 4, { align: "right" });
    y += 16;
  });
  doc.setFillColor(16, 38, 74);
  doc.rect(pageWidth / 2 - 8, y - 8, pageWidth - margin - pageWidth / 2 + 14, 24, "F");
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text("TOTAL DUE", pageWidth / 2, y + 8);
  doc.text(money(total), pageWidth - margin, y + 8, { align: "right" });
  y += 44;

  // Compliance block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(16, 38, 74);
  doc.text("COMPLIANCE & SHIPPING", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(70, 76, 90);
  const compliance = [
    `Incoterms: ${invoice.incoterms || "—"}`,
    `Country of Origin: ${invoice.country_of_origin || "—"}`,
    `HS Code (consignment): ${invoice.hs_code || "—"}`,
    `Payment Terms: ${invoice.payment_terms || "—"}`,
    invoice.bank_details || COMPANY.bank,
  ];
  doc.text(doc.splitTextToSize(compliance.join("\n"), pageWidth - margin * 2), margin, y + 14);
  y += 14 + compliance.length * 12 + 12;

  if (invoice.notes) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 38, 74);
    doc.text("NOTES", margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 76, 90);
    const notes = doc.splitTextToSize(invoice.notes, pageWidth - margin * 2);
    doc.text(notes, margin, y + 12);
    y += 12 + notes.length * 11 + 10;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 126, 140);
  const terms =
    invoice.terms ||
    "Goods remain the property of Step Garments until paid in full. Claims must be raised within 14 days of delivery. This invoice is issued in accordance with applicable commercial and tax regulations and is valid without signature.";
  doc.text(doc.splitTextToSize(terms, pageWidth - margin * 2), margin, Math.min(y + 6, 782));
  doc.text(
    `${COMPANY.name} • ${COMPANY.taxId} • ${COMPANY.regNo}`,
    pageWidth / 2,
    812,
    { align: "center" }
  );

  doc.save(`${invoice.invoice_number || "invoice"}.pdf`);
};
