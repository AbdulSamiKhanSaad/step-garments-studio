import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const TickerBanner = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("ticker_messages")
        .select("message")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (data && data.length > 0) {
        setMessages(data.map((d) => d.message));
      }
    };
    fetch();
  }, []);

  if (messages.length === 0) return null;

  // Duplicate messages for seamless loop
  const tickerText = messages.join("   •   ");

  return (
    <div className="bg-accent text-accent-foreground overflow-hidden h-8 flex items-center relative">
      <div className="ticker-track whitespace-nowrap">
        <span className="ticker-content inline-block px-4 text-xs sm:text-sm font-medium tracking-wide">
          {tickerText}   •   {tickerText}   •   {tickerText}
        </span>
      </div>
    </div>
  );
};

export default TickerBanner;
