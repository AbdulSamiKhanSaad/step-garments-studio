import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import TickerBanner from "@/components/TickerBanner";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin } = useAuth();
  const { lang, setLang, t, langs } = useLanguage();

  const links = [
    { label: t("home"), path: "/" },
    { label: t("products"), path: "/products" },
    { label: t("services"), path: "/services" },
    { label: "Lookbook", path: "/lookbook" },
    { label: t("process"), path: "/process" },
    { label: t("faq"), path: "/faq" },
    { label: t("contact"), path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <TickerBanner />
      <div className="bg-navy/95 backdrop-blur-md border-b border-border/10">
        <div className="container-max flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-primary-foreground">
            STEP <span className="text-accent">GARMENTS</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.path} to={l.path} className={`text-sm font-medium tracking-wide uppercase transition-colors ${pathname === l.path ? "text-accent" : "text-primary-foreground/80 hover:text-accent"}`}>
                {l.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-semibold">{langs.find(l => l.code === lang)?.name}</span>
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-md shadow-lg py-1 min-w-[100px] z-50">
                  {langs.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }} className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${lang === l.code ? "text-accent font-semibold" : "text-foreground"}`}>
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors">
                <User className="w-4 h-4" />
                {isAdmin ? t("admin") : t("dashboard")}
              </Link>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors">
                <User className="w-4 h-4" />
                {t("login")}
              </Link>
            )}
            <Link to="/contact" className="btn-primary text-sm py-2.5 px-6">{t("getQuote")}</Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-navy border-t border-border/10 px-4 pb-6">
            {links.map((l) => (
              <Link key={l.path} to={l.path} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium uppercase text-primary-foreground/80 hover:text-accent transition-colors">
                {l.label}
              </Link>
            ))}
            {/* Mobile Language */}
            <div className="flex gap-2 py-3 flex-wrap">
              {langs.map((l) => (
                <button key={l.code} onClick={() => { setLang(l.code); }} className={`px-3 py-1 text-xs rounded-full border ${lang === l.code ? "bg-accent text-accent-foreground border-accent" : "border-primary-foreground/20 text-primary-foreground/80"}`}>
                  {l.name}
                </button>
              ))}
            </div>
            <Link to={user ? (isAdmin ? "/admin" : "/dashboard") : "/auth"} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium uppercase text-primary-foreground/80 hover:text-accent transition-colors">
              {user ? (isAdmin ? "Admin Panel" : t("dashboard")) : t("login")}
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary text-sm py-2.5 px-6 mt-3 w-full text-center">
              {t("getQuote")}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
