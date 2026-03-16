import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import TickerBanner from "@/components/TickerBanner";

const links = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "Services", path: "/services" },
  { label: "Process", path: "/process" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-md border-b border-border/10">
      <div className="container-max flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-primary-foreground">
          STEP <span className="text-accent">GARMENTS</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                pathname === l.path ? "text-accent" : "text-primary-foreground/80 hover:text-accent"
              }`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors">
              <User className="w-4 h-4" />
              {isAdmin ? "Admin" : "Dashboard"}
            </Link>
          ) : (
            <Link to="/auth" className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-accent transition-colors">
              <User className="w-4 h-4" />
              Login
            </Link>
          )}
          <Link to="/contact" className="btn-primary text-sm py-2.5 px-6">
            Get a Quote
          </Link>
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
            <Link
              key={l.path}
              to={l.path}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium uppercase text-primary-foreground/80 hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to={user ? (isAdmin ? "/admin" : "/dashboard") : "/auth"}
            onClick={() => setOpen(false)}
            className="block py-3 text-sm font-medium uppercase text-primary-foreground/80 hover:text-accent transition-colors"
          >
            {user ? (isAdmin ? "Admin Panel" : "Dashboard") : "Login / Sign Up"}
          </Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary text-sm py-2.5 px-6 mt-3 w-full text-center">
            Get a Quote
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
