import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Wrench, AlertTriangle } from "lucide-react";

type Row = {
  id: string;
  scope: string;
  is_enabled: boolean;
  message: string | null;
};

const SCOPE_LABEL: Record<string, string> = {
  site: "Whole Website",
  home: "Home Page",
  products: "Products Page",
  services: "Services Page",
  process: "Process Page",
  contact: "Contact Page",
  faq: "FAQ Page",
  lookbook: "Lookbook Page",
};

const SCOPE_ORDER = ["site", "home", "products", "services", "process", "lookbook", "faq", "contact"];

const MaintenanceManager = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    const { data } = await supabase.from("maintenance_settings").select("*");
    const sorted = [...(data || [])].sort(
      (a: any, b: any) => SCOPE_ORDER.indexOf(a.scope) - SCOPE_ORDER.indexOf(b.scope)
    );
    setRows(sorted as Row[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const toggle = async (row: Row, value: boolean) => {
    const { error } = await supabase
      .from("maintenance_settings")
      .update({ is_enabled: value })
      .eq("id", row.id);
    if (error) {
      toast({ title: "Failed to update", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: value ? "Maintenance enabled" : "Maintenance disabled",
      description: SCOPE_LABEL[row.scope] || row.scope,
    });
    fetchRows();
  };

  const updateMessage = async (row: Row, message: string) => {
    if (message === (row.message || "")) return;
    const { error } = await supabase
      .from("maintenance_settings")
      .update({ message })
      .eq("id", row.id);
    if (error) {
      toast({ title: "Failed to save message", variant: "destructive" });
      return;
    }
    toast({ title: "Message saved" });
    fetchRows();
  };

  if (loading) return <p className="text-muted-foreground text-sm">Loading…</p>;

  const site = rows.find((r) => r.scope === "site");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-accent" /> Maintenance Mode
        </h2>
        <p className="text-sm text-muted-foreground">
          Toggle maintenance for the whole website or individual pages. Admins always bypass these
          screens.
        </p>
      </div>

      {site?.is_enabled && (
        <div className="flex items-start gap-3 p-4 rounded-lg border border-destructive/40 bg-destructive/10 text-foreground">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-destructive" />
          <p className="text-sm">
            <strong>Whole-site maintenance is ON.</strong> Visitors see the maintenance screen on
            every public page. Per-page toggles are ignored while this is active.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className={`bg-card border rounded-lg p-4 ${
              row.is_enabled ? "border-accent/50 ring-1 ring-accent/20" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <p className="font-semibold text-foreground">
                  {SCOPE_LABEL[row.scope] || row.scope}
                </p>
                <p className="text-xs text-muted-foreground">
                  {row.scope === "site"
                    ? "Affects every public page"
                    : `Route scope: ${row.scope}`}
                </p>
              </div>
              <label className="inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={row.is_enabled}
                  onChange={(e) => toggle(row, e.target.checked)}
                />
                <div className="relative w-11 h-6 bg-muted rounded-full peer-checked:bg-accent transition-colors">
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      row.is_enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>
            </div>
            <textarea
              defaultValue={row.message || ""}
              onBlur={(e) => updateMessage(row, e.target.value)}
              placeholder="Message shown to visitors…"
              rows={2}
              className="w-full text-sm rounded-md border border-input bg-background px-3 py-2 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceManager;
