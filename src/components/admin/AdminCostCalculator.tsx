import { useEffect, useMemo, useState } from "react";
import { Calculator, RotateCcw, Copy, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Trim {
  name: string;
  qty: number;
  rate: number;
}

interface CostInputs {
  productName: string;
  currency: string;
  orderQty: number;
  // fabric
  fabricConsumption: number; // kg or m per piece
  fabricUnit: "kg" | "m";
  fabricRate: number; // price per unit
  fabricWastage: number; // %
  // knitting/dyeing/processing
  processingCost: number; // per piece
  // making
  cmtCost: number; // cut, make, trim labour per piece
  printCost: number;
  embroideryCost: number;
  washCost: number;
  // trims & packaging
  trims: Trim[];
  packagingCost: number;
  labelTagCost: number;
  // quality & overhead
  rejectionRate: number; // %
  testingCost: number; // per piece
  overheadRate: number; // % of production cost
  // commercial
  freightCost: number; // per piece
  dutyRate: number; // % of FOB
  commissionRate: number; // %
  marginRate: number; // %
  fxRate: number; // multiply for secondary currency
  fxLabel: string;
}

const DEFAULTS: CostInputs = {
  productName: "Oversized Boxy Tee",
  currency: "USD",
  orderQty: 500,
  fabricConsumption: 0.32,
  fabricUnit: "kg",
  fabricRate: 6.5,
  fabricWastage: 8,
  processingCost: 0.45,
  cmtCost: 1.6,
  printCost: 0.5,
  embroideryCost: 0,
  washCost: 0,
  trims: [
    { name: "Neck label", qty: 1, rate: 0.06 },
    { name: "Care label", qty: 1, rate: 0.05 },
    { name: "Hangtag + string", qty: 1, rate: 0.12 },
  ],
  packagingCost: 0.18,
  labelTagCost: 0,
  rejectionRate: 3,
  testingCost: 0.08,
  overheadRate: 10,
  freightCost: 0.35,
  dutyRate: 0,
  commissionRate: 2,
  marginRate: 18,
  fxRate: 278,
  fxLabel: "PKR",
};

const STORAGE_KEY = "admin-cost-presets";
const money = (v: number, c: string) => `${c} ${v.toFixed(2)}`;

const AdminCostCalculator = () => {
  const [f, setF] = useState<CostInputs>(DEFAULTS);
  const [presets, setPresets] = useState<Record<string, CostInputs>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPresets(JSON.parse(raw));
    } catch {
      /* ignore corrupt presets */
    }
  }, []);

  const set = <K extends keyof CostInputs>(key: K, value: CostInputs[K]) => setF((prev) => ({ ...prev, [key]: value }));
  const num = (v: string) => (v === "" ? 0 : Number.parseFloat(v) || 0);

  const r = useMemo(() => {
    const consumption = f.fabricConsumption * (1 + f.fabricWastage / 100);
    const fabric = consumption * f.fabricRate;
    const trims = f.trims.reduce((sum, t) => sum + t.qty * t.rate, 0);
    const embellishment = f.printCost + f.embroideryCost + f.washCost;
    const packaging = f.packagingCost + f.labelTagCost;
    const directCost = fabric + f.processingCost + f.cmtCost + embellishment + trims + packaging + f.testingCost;
    const rejection = directCost * (f.rejectionRate / 100);
    const productionCost = directCost + rejection;
    const overhead = productionCost * (f.overheadRate / 100);
    const totalCost = productionCost + overhead;
    const margin = totalCost * (f.marginRate / 100);
    const exWorks = totalCost + margin;
    const commission = exWorks * (f.commissionRate / 100);
    const fob = exWorks + commission;
    const duty = fob * (f.dutyRate / 100);
    const landed = fob + f.freightCost + duty;
    return {
      consumption,
      fabric,
      trims,
      embellishment,
      packaging,
      directCost,
      rejection,
      productionCost,
      overhead,
      totalCost,
      margin,
      exWorks,
      commission,
      fob,
      duty,
      landed,
      orderValue: fob * f.orderQty,
      orderCost: totalCost * f.orderQty,
      orderProfit: (fob - totalCost) * f.orderQty,
      marginPct: fob > 0 ? ((fob - totalCost) / fob) * 100 : 0,
      converted: fob * f.fxRate,
    };
  }, [f]);

  const savePreset = () => {
    const name = f.productName.trim();
    if (!name) {
      toast({ title: "Add a product name first", variant: "destructive" });
      return;
    }
    const next = { ...presets, [name]: f };
    setPresets(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    toast({ title: "Costing saved", description: `Preset "${name}" stored on this device.` });
  };

  const deletePreset = (name: string) => {
    const next = { ...presets };
    delete next[name];
    setPresets(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const copyBreakdown = async () => {
    const lines = [
      `${f.productName} — cost sheet (per piece, ${f.currency})`,
      `Order qty: ${f.orderQty}`,
      `Fabric (${r.consumption.toFixed(3)} ${f.fabricUnit} incl. ${f.fabricWastage}% wastage): ${r.fabric.toFixed(2)}`,
      `Processing: ${f.processingCost.toFixed(2)}`,
      `CMT: ${f.cmtCost.toFixed(2)}`,
      `Print/Embroidery/Wash: ${r.embellishment.toFixed(2)}`,
      `Trims: ${r.trims.toFixed(2)}`,
      `Packaging: ${r.packaging.toFixed(2)}`,
      `Testing/QA: ${f.testingCost.toFixed(2)}`,
      `Rejection (${f.rejectionRate}%): ${r.rejection.toFixed(2)}`,
      `Overhead (${f.overheadRate}%): ${r.overhead.toFixed(2)}`,
      `Total cost: ${r.totalCost.toFixed(2)}`,
      `Margin (${f.marginRate}%): ${r.margin.toFixed(2)}`,
      `Commission (${f.commissionRate}%): ${r.commission.toFixed(2)}`,
      `FOB price/piece: ${r.fob.toFixed(2)}`,
      `Landed (freight + duty): ${r.landed.toFixed(2)}`,
      `Order value: ${r.orderValue.toFixed(2)}`,
    ].join("\n");
    await navigator.clipboard.writeText(lines);
    toast({ title: "Cost sheet copied" });
  };

  const numField = (label: string, key: keyof CostInputs, step = "0.01", suffix?: string) => (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}{suffix ? ` (${suffix})` : ""}</Label>
      <Input
        type="number"
        step={step}
        value={String(f[key] as number)}
        onChange={(e) => set(key, num(e.target.value) as never)}
      />
    </div>
  );

  const Row = ({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) => (
    <div className={`flex items-center justify-between py-2 border-b border-border last:border-0 ${strong ? "font-semibold" : ""}`}>
      <span className={`text-sm ${accent ? "text-accent" : "text-muted-foreground"}`}>{label}</span>
      <span className={`text-sm ${accent ? "text-accent font-bold" : "text-foreground"}`}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="w-5 h-5 text-accent" /> Per-Piece Price Calculator
          </h2>
          <p className="text-sm text-muted-foreground">Enter real costing factors — fabric, CMT, trims, overheads, margin — and get the FOB price per piece.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={savePreset} className="btn-primary text-sm flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
          <button type="button" onClick={copyBreakdown} className="text-sm px-4 py-2 rounded-md border border-border hover:bg-secondary flex items-center gap-2"><Copy className="w-4 h-4" /> Copy</button>
          <button type="button" onClick={() => setF(DEFAULTS)} className="text-sm px-4 py-2 rounded-md border border-border hover:bg-secondary flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <section className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Product & Order</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs">Product / Style</Label>
                <Input value={f.productName} onChange={(e) => set("productName", e.target.value)} placeholder="Style name" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Currency</Label>
                <Input value={f.currency} onChange={(e) => set("currency", e.target.value.toUpperCase().slice(0, 4))} />
              </div>
              {numField("Order quantity", "orderQty", "1", "pcs")}
              <div className="space-y-1.5">
                <Label className="text-xs">Fabric unit</Label>
                <select value={f.fabricUnit} onChange={(e) => set("fabricUnit", e.target.value as "kg" | "m")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="kg">Per kg (knits)</option>
                  <option value="m">Per meter (wovens)</option>
                </select>
              </div>
              {numField(`Consumption per piece`, "fabricConsumption", "0.001", f.fabricUnit)}
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Materials & Manufacturing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {numField(`Fabric rate per ${f.fabricUnit}`, "fabricRate", "0.01", f.currency)}
              {numField("Fabric wastage", "fabricWastage", "0.1", "%")}
              {numField("Knitting / dyeing / finishing", "processingCost", "0.01", f.currency)}
              {numField("CMT (cut-make-trim) labour", "cmtCost", "0.01", f.currency)}
              {numField("Printing", "printCost", "0.01", f.currency)}
              {numField("Embroidery", "embroideryCost", "0.01", f.currency)}
              {numField("Garment wash / dye", "washCost", "0.01", f.currency)}
              {numField("Packaging (polybag, carton)", "packagingCost", "0.01", f.currency)}
              {numField("Extra labels / tags", "labelTagCost", "0.01", f.currency)}
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Trims & Accessories</h3>
              <button type="button" onClick={() => set("trims", [...f.trims, { name: "", qty: 1, rate: 0 }])} className="text-xs font-semibold text-accent hover:underline">+ Add trim</button>
            </div>
            <div className="space-y-2">
              {f.trims.length === 0 && <p className="text-sm text-muted-foreground">No trims added.</p>}
              {f.trims.map((t, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Input
                    className="col-span-6"
                    placeholder="Trim name (zipper, drawcord...)"
                    value={t.name}
                    onChange={(e) => set("trims", f.trims.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  />
                  <Input
                    className="col-span-2"
                    type="number"
                    step="1"
                    value={String(t.qty)}
                    onChange={(e) => set("trims", f.trims.map((x, j) => (j === i ? { ...x, qty: num(e.target.value) } : x)))}
                  />
                  <Input
                    className="col-span-3"
                    type="number"
                    step="0.01"
                    value={String(t.rate)}
                    onChange={(e) => set("trims", f.trims.map((x, j) => (j === i ? { ...x, rate: num(e.target.value) } : x)))}
                  />
                  <button type="button" onClick={() => set("trims", f.trims.filter((_, j) => j !== i))} className="col-span-1 text-red-600 flex justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <p className="text-[11px] text-muted-foreground">Columns: name · qty per piece · rate per unit ({f.currency})</p>
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Quality, Overhead & Commercial</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {numField("Rejection / seconds", "rejectionRate", "0.1", "%")}
              {numField("Lab testing / QA", "testingCost", "0.01", f.currency)}
              {numField("Factory overhead", "overheadRate", "0.1", "% of production")}
              {numField("Profit margin", "marginRate", "0.1", "%")}
              {numField("Buying agent commission", "commissionRate", "0.1", "%")}
              {numField("Freight per piece", "freightCost", "0.01", f.currency)}
              {numField("Import duty", "dutyRate", "0.1", "% of FOB")}
              <div className="space-y-1.5">
                <Label className="text-xs">Convert to</Label>
                <Input value={f.fxLabel} onChange={(e) => set("fxLabel", e.target.value.toUpperCase().slice(0, 4))} />
              </div>
              {numField("Exchange rate", "fxRate", "0.01", `1 ${f.currency} =`)}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="bg-navy text-primary-foreground rounded-lg p-6 sticky top-6">
            <p className="text-xs uppercase tracking-widest text-primary-foreground/60">FOB price per piece</p>
            <p className="font-heading text-4xl font-bold text-accent mt-1">{money(r.fob, f.currency)}</p>
            <p className="text-sm text-primary-foreground/70 mt-1">≈ {f.fxLabel} {r.converted.toFixed(0)} · landed {money(r.landed, f.currency)}</p>
            <div className="mt-4 pt-4 border-t border-primary-foreground/15 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-primary-foreground/70">Total cost / pc</span><span>{money(r.totalCost, f.currency)}</span></div>
              <div className="flex justify-between"><span className="text-primary-foreground/70">Gross margin</span><span>{r.marginPct.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span className="text-primary-foreground/70">Order value ({f.orderQty} pcs)</span><span>{money(r.orderValue, f.currency)}</span></div>
              <div className="flex justify-between"><span className="text-primary-foreground/70">Order profit</span><span>{money(r.orderProfit, f.currency)}</span></div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-2">Cost Breakdown / piece</h3>
            <Row label={`Fabric (${r.consumption.toFixed(3)} ${f.fabricUnit})`} value={money(r.fabric, f.currency)} />
            <Row label="Processing" value={money(f.processingCost, f.currency)} />
            <Row label="CMT labour" value={money(f.cmtCost, f.currency)} />
            <Row label="Print / embroidery / wash" value={money(r.embellishment, f.currency)} />
            <Row label="Trims" value={money(r.trims, f.currency)} />
            <Row label="Packaging" value={money(r.packaging, f.currency)} />
            <Row label="Testing / QA" value={money(f.testingCost, f.currency)} />
            <Row label="Direct cost" value={money(r.directCost, f.currency)} strong />
            <Row label={`Rejection ${f.rejectionRate}%`} value={money(r.rejection, f.currency)} />
            <Row label={`Overhead ${f.overheadRate}%`} value={money(r.overhead, f.currency)} />
            <Row label="Total cost" value={money(r.totalCost, f.currency)} strong />
            <Row label={`Margin ${f.marginRate}%`} value={money(r.margin, f.currency)} />
            <Row label="Ex-works" value={money(r.exWorks, f.currency)} />
            <Row label={`Commission ${f.commissionRate}%`} value={money(r.commission, f.currency)} />
            <Row label="FOB price" value={money(r.fob, f.currency)} accent />
            <Row label="Freight" value={money(f.freightCost, f.currency)} />
            <Row label={`Duty ${f.dutyRate}%`} value={money(r.duty, f.currency)} />
            <Row label="Landed cost" value={money(r.landed, f.currency)} strong />
          </div>

          {Object.keys(presets).length > 0 && (
            <div className="bg-card border border-border rounded-lg p-5">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-2">Saved costings</h3>
              <div className="space-y-2">
                {Object.keys(presets).map((name) => (
                  <div key={name} className="flex items-center justify-between gap-2">
                    <button type="button" onClick={() => setF(presets[name])} className="text-sm text-foreground hover:text-accent text-left flex-1 truncate">{name}</button>
                    <button type="button" onClick={() => deletePreset(name)} className="text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default AdminCostCalculator;
