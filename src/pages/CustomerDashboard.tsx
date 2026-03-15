import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LayoutDashboard, FileText, Package, MessageSquare, Upload, Receipt, User, LogOut, Menu, X, Paintbrush, Factory } from "lucide-react";

const customerNav = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Quotes", path: "/dashboard/quotes", icon: FileText },
  { label: "My Orders", path: "/dashboard/orders", icon: Package },
  { label: "Messages", path: "/dashboard/messages", icon: MessageSquare },
  { label: "Files", path: "/dashboard/files", icon: Upload },
  { label: "Design Studio", path: "/dashboard/design", icon: Paintbrush },
  { label: "Factory Tour", path: "/dashboard/factory", icon: Factory },
  { label: "Invoices", path: "/dashboard/invoices", icon: Receipt },
  { label: "Profile", path: "/dashboard/profile", icon: User },
];

const CustomerDashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!user) return null;

  const currentPage = customerNav.find((n) => n.path === location.pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link to="/" className="font-heading text-lg font-bold text-foreground">
            STEP <span className="text-accent">GARMENTS</span>
          </Link>
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1">
          {customerNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
            <h1 className="font-heading text-lg font-bold text-foreground">{currentPage}</h1>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">Welcome, {profile?.full_name || user.email}</p>
        </header>

        <main className="p-6">
          <DashboardContent page={location.pathname} userId={user.id} />
        </main>
      </div>
    </div>
  );
};

const DashboardContent = ({ page, userId }: { page: string; userId: string }) => {
  switch (page) {
    case "/dashboard/quotes": return <QuotesPage userId={userId} />;
    case "/dashboard/orders": return <OrdersPage userId={userId} />;
    case "/dashboard/messages": return <MessagesPage userId={userId} />;
    case "/dashboard/files": return <FilesPage userId={userId} />;
    case "/dashboard/invoices": return <InvoicesPage userId={userId} />;
    case "/dashboard/profile": return <ProfilePage userId={userId} />;
    default: return <DashboardOverview userId={userId} />;
  }
};

// Overview
const DashboardOverview = ({ userId }: { userId: string }) => {
  const [stats, setStats] = useState({ quotes: 0, orders: 0, messages: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [q, o, m] = await Promise.all([
        supabase.from("quotes").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("receiver_id", userId).eq("is_read", false),
      ]);
      setStats({ quotes: q.count || 0, orders: o.count || 0, messages: m.count || 0 });
    };
    fetchStats();
  }, [userId]);

  const cards = [
    { label: "Quote Requests", value: stats.quotes, color: "bg-accent/10 text-accent" },
    { label: "Active Orders", value: stats.orders, color: "bg-green-100 text-green-700" },
    { label: "Unread Messages", value: stats.messages, color: "bg-orange-100 text-orange-700" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color.split(" ")[1]}`}>{c.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading font-bold text-foreground mb-2">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/quotes" className="btn-primary text-sm py-2">Submit Quote Request</Link>
          <Link to="/dashboard/orders" className="btn-outline text-sm py-2">View Orders</Link>
          <Link to="/dashboard/messages" className="btn-outline text-sm py-2">Send Message</Link>
        </div>
      </div>
    </div>
  );
};

// Quotes
const QuotesPage = ({ userId }: { userId: string }) => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product_type: "", quantity: "", message: "" });

  useEffect(() => {
    supabase.from("quotes").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setQuotes(data || []));
  }, [userId]);

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("quotes").insert({ ...form, user_id: userId });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Quote submitted!" });
    setShowForm(false);
    setForm({ product_type: "", quantity: "", message: "" });
    const { data } = await supabase.from("quotes").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setQuotes(data || []);
  };

  const statusColor: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", reviewed: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">My Quotes</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2">{showForm ? "Cancel" : "New Quote"}</button>
      </div>
      {showForm && (
        <form onSubmit={submitQuote} className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Product Type *</label>
            <input value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} required className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. T-Shirts, Hoodies" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Quantity</label>
            <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" placeholder="e.g. 500 pcs" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Details</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full mt-1 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Fabric preferences, customization..." />
          </div>
          <button type="submit" className="btn-primary text-sm py-2">Submit Quote</button>
        </form>
      )}
      <div className="space-y-3">
        {quotes.length === 0 ? <p className="text-muted-foreground text-sm">No quotes yet.</p> : quotes.map((q) => (
          <div key={q.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-start">
            <div>
              <p className="font-medium text-foreground">{q.product_type}</p>
              <p className="text-sm text-muted-foreground">Qty: {q.quantity || "N/A"} • {new Date(q.created_at).toLocaleDateString()}</p>
              {q.admin_notes && <p className="text-sm text-accent mt-1">Admin: {q.admin_notes}</p>}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[q.status] || ""}`}>{q.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Orders
const OrdersPage = ({ userId }: { userId: string }) => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []));
  }, [userId]);

  const statusSteps = ["pending", "sampling", "production", "quality_check", "shipped", "delivered"];
  const statusColor: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", sampling: "bg-blue-100 text-blue-700", production: "bg-purple-100 text-purple-700", quality_check: "bg-orange-100 text-orange-700", shipped: "bg-cyan-100 text-cyan-700", delivered: "bg-green-100 text-green-700" };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">My Orders</h2>
      {orders.length === 0 ? <p className="text-muted-foreground text-sm">No orders yet.</p> : orders.map((o) => (
        <div key={o.id} className="bg-card border border-border rounded-lg p-5 mb-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-bold text-foreground">{o.order_number}</p>
              <p className="text-sm text-muted-foreground">{o.product_type} • {o.quantity}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[o.status] || ""}`}>{o.status.replace("_", " ")}</span>
          </div>
          {o.tracking_number && <p className="text-sm text-accent">Tracking: {o.tracking_number}</p>}
          {/* Progress bar */}
          <div className="flex mt-4 gap-1">
            {statusSteps.map((s, i) => (
              <div key={s} className={`h-2 flex-1 rounded-full ${statusSteps.indexOf(o.status) >= i ? "bg-accent" : "bg-muted"}`} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {statusSteps.map((s) => <span key={s} className="text-[10px] text-muted-foreground capitalize">{s.replace("_", " ")}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
};

// Messages
const MessagesPage = ({ userId }: { userId: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    supabase.from("messages").select("*").or(`sender_id.eq.${userId},receiver_id.eq.${userId}`).order("created_at", { ascending: true }).then(({ data }) => setMessages(data || []));
  }, [userId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    // Get an admin user to send to
    const { data: admins } = await supabase.from("user_roles").select("user_id").eq("role", "admin").limit(1);
    const adminId = admins?.[0]?.user_id;
    if (!adminId) { toast({ title: "No admin available", variant: "destructive" }); return; }
    await supabase.from("messages").insert({ sender_id: userId, receiver_id: adminId, content: newMsg });
    setNewMsg("");
    const { data } = await supabase.from("messages").select("*").or(`sender_id.eq.${userId},receiver_id.eq.${userId}`).order("created_at", { ascending: true });
    setMessages(data || []);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Messages</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="h-[400px] overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && <p className="text-muted-foreground text-sm text-center">No messages yet.</p>}
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${m.sender_id === userId ? "ml-auto bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>
              {m.content}
              <p className={`text-[10px] mt-1 ${m.sender_id === userId ? "text-accent-foreground/70" : "text-muted-foreground"}`}>{new Date(m.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="border-t border-border p-3 flex gap-2">
          <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message..." className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm" />
          <button type="submit" className="btn-primary text-sm py-2">Send</button>
        </form>
      </div>
    </div>
  );
};

// Files
const FilesPage = ({ userId }: { userId: string }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.from("uploaded_files").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setFiles(data || []));
  }, [userId]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const filePath = `${userId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("techpacks").upload(filePath, file);
    if (uploadError) { toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("techpacks").getPublicUrl(filePath);
    await supabase.from("uploaded_files").insert({ user_id: userId, file_name: file.name, file_url: urlData.publicUrl, file_type: file.type, file_size: file.size });
    toast({ title: "File uploaded!" });
    setUploading(false);
    const { data } = await supabase.from("uploaded_files").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setFiles(data || []);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">My Files</h2>
        <label className="btn-primary text-sm py-2 cursor-pointer">
          {uploading ? "Uploading..." : "Upload File"}
          <input type="file" className="hidden" onChange={uploadFile} accept=".pdf,.zip,.png,.jpg,.jpeg" disabled={uploading} />
        </label>
      </div>
      <div className="space-y-3">
        {files.length === 0 ? <p className="text-muted-foreground text-sm">No files uploaded.</p> : files.map((f) => (
          <div key={f.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-foreground text-sm">{f.file_name}</p>
              <p className="text-xs text-muted-foreground">{(f.file_size / 1024).toFixed(1)} KB • {new Date(f.created_at).toLocaleDateString()}</p>
            </div>
            <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="text-accent text-sm font-medium hover:underline">Download</a>
          </div>
        ))}
      </div>
    </div>
  );
};

// Invoices
const InvoicesPage = ({ userId }: { userId: string }) => {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("invoices").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setInvoices(data || []));
  }, [userId]);

  const statusColor: Record<string, string> = { unpaid: "bg-red-100 text-red-700", paid: "bg-green-100 text-green-700", overdue: "bg-orange-100 text-orange-700" };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Invoices</h2>
      <div className="space-y-3">
        {invoices.length === 0 ? <p className="text-muted-foreground text-sm">No invoices yet.</p> : invoices.map((inv) => (
          <div key={inv.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-bold text-foreground">{inv.invoice_number}</p>
              <p className="text-sm text-muted-foreground">${inv.amount.toFixed(2)} • Due: {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : "N/A"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[inv.status] || ""}`}>{inv.status}</span>
              {inv.file_url && <a href={inv.file_url} target="_blank" rel="noopener noreferrer" className="text-accent text-sm font-medium hover:underline">Download</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Profile
const ProfilePage = ({ userId }: { userId: string }) => {
  const { profile } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", company: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name, phone: profile.phone, company: profile.company });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("user_id", userId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated!" });
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Profile Settings</h2>
      <form onSubmit={save} className="bg-card border border-border rounded-lg p-6 max-w-lg space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Email</label>
          <input value={profile?.email || ""} disabled className="w-full mt-1 h-10 rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Company</label>
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary text-sm py-2">{saving ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
};

export default CustomerDashboard;
