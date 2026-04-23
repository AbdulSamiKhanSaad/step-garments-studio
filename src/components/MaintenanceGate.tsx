import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Wrench, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMaintenance, pathToScope } from "@/hooks/useMaintenance";

const MaintenanceScreen = ({ message }: { message: string }) => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-16 animate-fade-in">
      <div className="max-w-xl w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
          <Wrench className="w-7 h-7 text-accent" />
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-accent mb-3">
          Maintenance Mode
        </p>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
          We'll be right back
        </h1>
        <p className="text-muted-foreground leading-relaxed mb-8">{message}</p>
        {!user || !isAdmin ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">If you are an admin,</p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-6 py-3 rounded-md font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4" /> Login Now
            </Link>
          </div>
        ) : (
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
          >
            Manage maintenance settings →
          </Link>
        )}
      </div>
    </div>
  );
};

const MaintenanceGate = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { settings, loading } = useMaintenance();

  // Never block admin/auth/dashboard routes — admins must always be able to log in & manage
  const ALWAYS_OPEN = ["/auth", "/admin", "/dashboard"];
  const isAlwaysOpen = ALWAYS_OPEN.some((p) => location.pathname.startsWith(p));

  if (loading || authLoading) return <>{children}</>;
  if (isAlwaysOpen) return <>{children}</>;

  // Admins bypass maintenance
  if (user && isAdmin) return <>{children}</>;

  // Site-wide takes priority
  const site = settings["site"];
  if (site?.is_enabled) {
    return (
      <MaintenanceScreen
        message={
          site.message ||
          "Our site is currently undergoing scheduled maintenance. We'll be back shortly."
        }
      />
    );
  }

  // Per-page
  const scope = pathToScope(location.pathname);
  if (scope) {
    const page = settings[scope];
    if (page?.is_enabled) {
      return <MaintenanceScreen message={page.message || "This page is under maintenance."} />;
    }
  }

  return <>{children}</>;
};

export default MaintenanceGate;
