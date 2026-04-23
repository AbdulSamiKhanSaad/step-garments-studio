import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type MaintenanceRow = {
  id: string;
  scope: string;
  is_enabled: boolean;
  message: string | null;
};

const ROUTE_TO_SCOPE: Record<string, string> = {
  "/": "home",
  "/products": "products",
  "/services": "services",
  "/process": "process",
  "/contact": "contact",
  "/faq": "faq",
  "/lookbook": "lookbook",
};

export const pathToScope = (pathname: string): string | null => {
  return ROUTE_TO_SCOPE[pathname] ?? null;
};

export const useMaintenance = () => {
  const [settings, setSettings] = useState<Record<string, MaintenanceRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      const { data } = await supabase.from("maintenance_settings").select("*");
      if (!mounted) return;
      const map: Record<string, MaintenanceRow> = {};
      (data || []).forEach((row: any) => {
        map[row.scope] = row;
      });
      setSettings(map);
      setLoading(false);
    };

    fetchAll();

    const channel = supabase
      .channel("maintenance-settings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "maintenance_settings" },
        () => fetchAll()
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
};
