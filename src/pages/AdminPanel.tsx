import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LayoutDashboard, FileText, Package, MessageSquare, Users, Receipt, Settings, LogOut, Menu, X, Mail, Paintbrush, Factory, Megaphone } from "lucide-react";

const adminNav = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Clients", path: "/admin/clients", icon: Users },
  { label: "Quotes", path: "/admin/quotes", icon: FileText },
  { label: "Orders", path: "/admin/orders", icon: Package },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Invoices", path: "/admin/invoices", icon: Receipt },
  { label: "Contact Forms", path: "/admin/contacts", icon: Mail },
  { label: "Design Studio", path: "/admin/design", icon: Paintbrush },
  { label: "Factory", path: "/admin/factory", icon: Factory },
  { label: "Ticker Messages", path: "/admin/ticker", icon: Megaphone },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminPanel = () => {
  const { user, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/auth");
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p>Loading...</p></div>;
  if (!user || !isAdmin) return null;

  const currentPage = adminNav.find((n) => n.path === location.pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-secondary flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy text-primary-foreground transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-primary-foreground/10">
          <Link to="/" className="font-heading text-lg font-bold">
            STEP <span className="text-accent">ADMIN</span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-4 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm text-red-300 hover:bg-red-500/10 w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
            <h1 className="font-heading text-lg font-bold text-foreground">{currentPage}</h1>
          </div>
          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-semibold">ADMIN</span>
        </header>
        <main className="p-6">
          <AdminContent page={location.pathname} userId={user.id} />
        </main>
      </div>
    </div>
  );
};

const DesignStudioLazy = React.lazy(() => import("@/components/design-studio/DesignStudio"));
const FactoryShowcaseLazy = React.lazy(() => import("@/components/FactoryShowcase"));

const AdminContent = ({ page, userId }: { page: string; userId: string }) => {
  switch (page) {
    case "/admin/clients": return <AdminClients />;
    case "/admin/quotes": return <AdminQuotes />;
    case "/admin/orders": return <AdminOrders userId={userId} />;
    case "/admin/messages": return <AdminMessages userId={userId} />;
    case "/admin/invoices": return <AdminInvoices />;
    case "/admin/contacts": return <AdminContacts />;
    case "/admin/design": return <React.Suspense fallback={<p className="text-muted-foreground">Loading Design Studio...</p>}><DesignStudioLazy /></React.Suspense>;
    case "/admin/factory": return <React.Suspense fallback={<p className="text-muted-foreground">Loading...</p>}><FactoryShowcaseLazy /></React.Suspense>;
    case "/admin/ticker": return <AdminTickerMessages />;
    case "/admin/settings": return <AdminSettings userId={userId} />;
    default: return <AdminDashboardOverview />;
  }
};

// Dashboard Overview
const AdminDashboardOverview = () => {
  const [stats, setStats] = useState({ clients: 0, orders: 0, pendingQuotes: 0, revenue: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [c, o, q, r] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("orders").select("total_amount"),
      ]);
      const revenue = (r.data || []).reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);
      setStats({ clients: c.count || 0, orders: o.count || 0, pendingQuotes: q.count || 0, revenue });
    };
    fetch();
  }, []);

  const cards = [
    { label: "Total Clients", value: stats.clients, color: "text-accent" },
    { label: "Total Orders", value: stats.orders, color: "text-green-600" },
    { label: "Pending Quotes", value: stats.pendingQuotes, color: "text-orange-600" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "text-purple-600" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Design Studio & Factory Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/design" className="group bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-6 hover:border-accent/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Paintbrush className="w-5 h-5 text-accent" />
            </div>
            <h4 className="font-heading font-bold text-foreground">Design Studio</h4>
          </div>
          <p className="text-sm text-muted-foreground">Create and preview garment designs for clients.</p>
          <span className="inline-block mt-3 text-accent text-sm font-semibold group-hover:underline">Open Studio →</span>
        </Link>
        <Link to="/admin/factory" className="group bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-lg p-6 hover:border-blue-500/50 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Factory className="w-5 h-5 text-blue-500" />
            </div>
            <h4 className="font-heading font-bold text-foreground">Factory Showcase</h4>
          </div>
          <p className="text-sm text-muted-foreground">View factory gallery, 3D previews, and production process.</p>
          <span className="inline-block mt-3 text-blue-500 text-sm font-semibold group-hover:underline">View Factory →</span>
        </Link>
      </div>
    </div>
  );
};

// Clients
const AdminClients = () => {
  const [clients, setClients] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => setClients(data || []));
  }, []);

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">All Clients</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-3 font-medium text-muted-foreground">Name</th><th className="text-left p-3 font-medium text-muted-foreground">Email</th><th className="text-left p-3 font-medium text-muted-foreground">Company</th><th className="text-left p-3 font-medium text-muted-foreground">Joined</th></tr></thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 text-foreground">{c.full_name || "—"}</td>
                <td className="p-3 text-muted-foreground">{c.email}</td>
                <td className="p-3 text-muted-foreground">{c.company || "—"}</td>
                <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Quotes
const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<any[]>([]);

  const fetchQuotes = async () => {
    const { data } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    setQuotes(data || []);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const updateQuote = async (id: string, status: string, admin_notes?: string) => {
    await supabase.from("quotes").update({ status, ...(admin_notes !== undefined ? { admin_notes } : {}) }).eq("id", id);
    toast({ title: `Quote ${status}` });
    fetchQuotes();
  };

  const statusColor: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", reviewed: "bg-blue-100 text-blue-700", approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700" };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">All Quotes</h2>
      <div className="space-y-4">
        {quotes.map((q) => (
          <div key={q.id} className="bg-card border border-border rounded-lg p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-foreground">{q.product_type}</p>
                <p className="text-sm text-muted-foreground">
                  {q.guest_name || "Logged-in user"} • {q.guest_email || q.user_id?.slice(0, 8)} • Qty: {q.quantity || "N/A"}
                </p>
                {q.message && <p className="text-sm text-foreground mt-1">{q.message}</p>}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[q.status] || ""}`}>{q.status}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => updateQuote(q.id, "approved")} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-md hover:bg-green-700">Approve</button>
              <button onClick={() => updateQuote(q.id, "rejected")} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-md hover:bg-red-700">Reject</button>
              <button onClick={() => updateQuote(q.id, "reviewed")} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">Mark Reviewed</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Orders
const AdminOrders = ({ userId }: { userId: string }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ user_id: "", product_type: "", quantity: "", total_amount: "" });

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
  };

  useEffect(() => { fetchOrders(); }, []);

  const createOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("orders").insert({
      user_id: form.user_id,
      product_type: form.product_type,
      quantity: form.quantity,
      total_amount: parseFloat(form.total_amount) || 0,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Order created!" });
    setShowForm(false);
    fetchOrders();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    toast({ title: `Status updated to ${status}` });
    fetchOrders();
  };

  const statuses = ["pending", "sampling", "production", "quality_check", "shipped", "delivered"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-bold text-foreground">All Orders</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-2">{showForm ? "Cancel" : "Create Order"}</button>
      </div>
      {showForm && (
        <form onSubmit={createOrder} className="bg-card border border-border rounded-lg p-6 mb-6 grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium">Customer User ID</label><input value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" /></div>
          <div><label className="text-sm font-medium">Product Type</label><input value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} required className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" /></div>
          <div><label className="text-sm font-medium">Quantity</label><input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" /></div>
          <div><label className="text-sm font-medium">Total Amount</label><input value={form.total_amount} onChange={(e) => setForm({ ...form, total_amount: e.target.value })} type="number" className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 text-sm" /></div>
          <div className="col-span-2"><button type="submit" className="btn-primary text-sm py-2">Create</button></div>
        </form>
      )}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-lg p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-foreground">{o.order_number}</p>
                <p className="text-sm text-muted-foreground">{o.product_type} • {o.quantity} • ${o.total_amount}</p>
              </div>
              <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium">
                {statuses.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
            <div className="mt-2">
              <input placeholder="Tracking number" defaultValue={o.tracking_number || ""} onBlur={async (e) => {
                if (e.target.value !== (o.tracking_number || "")) {
                  await supabase.from("orders").update({ tracking_number: e.target.value }).eq("id", o.id);
                  toast({ title: "Tracking updated" });
                }
              }} className="h-8 rounded-md border border-input bg-background px-2 text-xs w-full max-w-xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Messages
const AdminMessages = ({ userId }: { userId: string }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    // Get unique users who have messaged
    supabase.from("messages").select("sender_id, receiver_id").then(({ data }) => {
      const userIds = new Set<string>();
      (data || []).forEach((m) => { if (m.sender_id !== userId) userIds.add(m.sender_id); if (m.receiver_id !== userId) userIds.add(m.receiver_id); });
      const ids = Array.from(userIds);
      if (ids.length > 0) {
        supabase.from("profiles").select("user_id, full_name, email").in("user_id", ids).then(({ data: profiles }) => setConversations(profiles || []));
      }
    });
  }, [userId]);

  useEffect(() => {
    if (!selectedUser) return;
    supabase.from("messages").select("*").or(`and(sender_id.eq.${userId},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${userId})`).order("created_at", { ascending: true }).then(({ data }) => setMessages(data || []));
  }, [selectedUser, userId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedUser) return;
    await supabase.from("messages").insert({ sender_id: userId, receiver_id: selectedUser, content: newMsg });
    setNewMsg("");
    const { data } = await supabase.from("messages").select("*").or(`and(sender_id.eq.${userId},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${userId})`).order("created_at", { ascending: true });
    setMessages(data || []);
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Messages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-3 border-b border-border bg-muted"><p className="text-sm font-semibold text-foreground">Conversations</p></div>
          <div className="max-h-[500px] overflow-y-auto">
            {conversations.length === 0 && <p className="p-4 text-sm text-muted-foreground">No conversations.</p>}
            {conversations.map((c) => (
              <button key={c.user_id} onClick={() => setSelectedUser(c.user_id)} className={`w-full text-left p-3 border-b border-border text-sm hover:bg-muted transition-colors ${selectedUser === c.user_id ? "bg-accent/10" : ""}`}>
                <p className="font-medium text-foreground">{c.full_name || c.email}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px]">
            {!selectedUser && <p className="text-muted-foreground text-sm text-center">Select a conversation</p>}
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${m.sender_id === userId ? "ml-auto bg-accent text-accent-foreground" : "bg-muted text-foreground"}`}>
                {m.content}
                <p className={`text-[10px] mt-1 ${m.sender_id === userId ? "text-accent-foreground/70" : "text-muted-foreground"}`}>{new Date(m.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
          {selectedUser && (
            <form onSubmit={sendMessage} className="border-t border-border p-3 flex gap-2">
              <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message..." className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm" />
              <button type="submit" className="btn-primary text-sm py-2">Send</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Invoices
const AdminInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("invoices").select("*").order("created_at", { ascending: false }).then(({ data }) => setInvoices(data || []));
  }, []);

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">All Invoices</h2>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-3">Invoice #</th><th className="text-left p-3">Amount</th><th className="text-left p-3">Status</th><th className="text-left p-3">Due Date</th></tr></thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t border-border">
                <td className="p-3 font-medium">{inv.invoice_number}</td>
                <td className="p-3">${inv.amount}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${inv.status === "paid" ? "bg-green-100 text-green-700" : inv.status === "overdue" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{inv.status}</span></td>
                <td className="p-3">{inv.due_date || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Contact Form Submissions
const AdminContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => setContacts(data || []));
  }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    setContacts(contacts.map((c) => c.id === id ? { ...c, is_read: true } : c));
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Contact Form Submissions</h2>
      <div className="space-y-4">
        {contacts.length === 0 && <p className="text-muted-foreground text-sm">No submissions yet.</p>}
        {contacts.map((c) => (
          <div key={c.id} className={`bg-card border rounded-lg p-5 ${c.is_read ? "border-border" : "border-accent"}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-foreground">{c.name} {!c.is_read && <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">New</span>}</p>
                <p className="text-sm text-muted-foreground">{c.email} • {c.phone || "N/A"}</p>
                {c.subject && <p className="text-sm font-medium text-foreground mt-1">{c.subject}</p>}
                <p className="text-sm text-foreground mt-1">{c.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              {!c.is_read && <button onClick={() => markRead(c.id)} className="text-xs text-accent hover:underline">Mark Read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Settings (Admin invite)
const AdminSettings = ({ userId }: { userId: string }) => {
  const [email, setEmail] = useState("");

  const inviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Look up user by email in profiles
    const { data: profile } = await supabase.from("profiles").select("user_id").eq("email", email).maybeSingle();
    if (!profile) { toast({ title: "User not found", description: "They must sign up first.", variant: "destructive" }); return; }
    const { error } = await supabase.from("user_roles").insert({ user_id: profile.user_id, role: "admin" });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Admin role granted!", description: `${email} is now an admin.` });
    setEmail("");
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-6">Admin Settings</h2>
      <div className="bg-card border border-border rounded-lg p-6 max-w-lg">
        <h3 className="font-heading font-bold text-foreground mb-4">Invite Admin</h3>
        <p className="text-sm text-muted-foreground mb-4">Grant admin access to an existing user by their email address.</p>
        <form onSubmit={inviteAdmin} className="flex gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="user@email.com" className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm" />
          <button type="submit" className="btn-primary text-sm py-2">Grant Admin</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
