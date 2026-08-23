import jsPDF from "jspdf";
import logoUrl from "@/assets/brand-logo.png";
import { COMPANY } from "@/lib/invoicePdf";

export interface CostSheetSection {
  title: string;
  rows: Array<{ label: string; value: string; strong?: boolean }>;
}

export interface CostSheetData {
  productName: string;
  currency: string;
  orderQty: number;
  fobPerPiece: string;
  landedPerPiece: string;
  converted: string;
  marginPct: string;
  breakdown: Array<{ label: string; value: string; strong?: boolean; accent?: boolean }>;
  inputs: CostSheetSection[];
  totals: Array<{ label: string; value: string }>;
  assumptions: string[];
}

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

export const generateCostSheetPdf = async (data: CostSheetData) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const contentWidth = pageWidth - margin * 2;

  const logo = await loadLogo();
  if (logo) doc.addImage(logo, "PNG", margin, 32, 60, 60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(16, 38, 74);
  doc.text(COMPANY.name.toUpperCase(), margin + 72, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 96, 110);
  doc.text(
    [COMPANY.tagline, COMPANY.address, `${COMPANY.email}  •  ${COMPANY.phone}`, `${COMPANY.website}  •  ${COMPANY.taxId}`],
    margin + 72,
    64
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(16, 38, 74);
  doc.text("COST SHEET", pageWidth - margin, 50, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 66, 80);
  doc.text(
    [
      `Style: ${data.productName || "—"}`,
      `Order qty: ${data.orderQty} pcs`,
      `Currency: ${data.currency}`,
      `Date: ${new Date().toLocaleDateString()}`,
    ],
    pageWidth - margin,
    66,
    { align: "right" }
  );

  let y = 126;
  doc.setDrawColor(226, 230, 238);
  doc.line(margin, y - 16, pageWidth - margin, y - 16);

  // Headline summary band
  doc.setFillColor(16, 38, 74);
  doc.rect(margin, y - 8, contentWidth, 58, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const bandCols = [
    { label: "FOB PRICE / PIECE", value: data.fobPerPiece },
    { label: "LANDED / PIECE", value: data.landedPerPiece },
    { label: "GROSS MARGIN", value: data.marginPct },
    { label: "CONVERTED", value: data.converted },
  ];
  bandCols.forEach((col, i) => {
    const x = margin + 14 + (contentWidth / 4) * i;
    doc.setFontSize(7.5);
    doc.setTextColor(190, 200, 220);
    doc.text(col.label, x, y + 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(col.value, x, y + 30);
    doc.setFont("helvetica", "normal");
  });
  y += 72;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 60) {
      doc.addPage();
      y = 60;
    }
  };

  const sectionTitle = (title: string) => {
    ensureSpace(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(16, 38, 74);
    doc.text(title.toUpperCase(), margin, y);
    doc.setDrawColor(226, 230, 238);
    doc.line(margin, y + 5, pageWidth - margin, y + 5);
    y += 20;
  };

  const rowLine = (label: string, value: string, strong = false, width = contentWidth, x = margin) => {
    ensureSpace(18);
    doc.setFont("helvetica", strong ? "bold" : "normal");
    doc.setFontSize(9);
    doc.setTextColor(strong ? 16 : 80, strong ? 38 : 86, strong ? 74 : 100);
    doc.text(label, x, y);
    doc.setTextColor(strong ? 16 : 40, strong ? 38 : 46, strong ? 74 : 60);
    doc.text(value, x + width, y, { align: "right" });
    doc.setDrawColor(238, 241, 246);
    doc.line(x, y + 4, x + width, y + 4);
    y += 16;
  };

  // Inputs (two-column sections)
  data.inputs.forEach((section) => {
    sectionTitle(section.title);
    section.rows.forEach((r) => rowLine(r.label, r.value, r.strong));
    y += 8;
  });

  sectionTitle("Cost breakdown per piece");
  data.breakdown.forEach((r) => rowLine(r.label, r.value, r.strong || r.accent));
  y += 8;

  sectionTitle(`Order totals (${data.orderQty} pcs)`);
  data.totals.forEach((r) => rowLine(r.label, r.value, true));
  y += 8;

  if (data.assumptions.length) {
    sectionTitle("Assumptions & notes");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(90, 96, 110);
    data.assumptions.forEach((note) => {
      const lines = doc.splitTextToSize(`• ${note}`, contentWidth);
      ensureSpace(lines.length * 12 + 6);
      doc.text(lines, margin, y);
      y += lines.length * 12 + 2;
    });
  }

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 146, 160);
    doc.text(
      `${COMPANY.name} • ${COMPANY.website} • Indicative costing, subject to final fabric and trim confirmation.`,
      margin,
      pageHeight - 30
    );
    doc.text(`Page ${p} / ${pages}`, pageWidth - margin, pageHeight - 30, { align: "right" });
  }

  const safeName = (data.productName || "cost-sheet").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  doc.save(`cost-sheet-${safeName}.pdf`);
};
