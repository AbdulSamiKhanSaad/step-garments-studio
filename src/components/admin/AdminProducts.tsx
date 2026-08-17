import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Star, Eye, EyeOff, Upload } from "lucide-react";

const CATEGORIES = [
  { slug: "tshirts", name: "T-Shirts" },
  { slug: "hoodies", name: "Hoodies" },
  { slug: "tracksuits", name: "Tracksuits" },
  { slug: "jackets", name: "Jackets" },
  { slug: "sportswear", name: "Sportswear" },
  { slug: "streetwear", name: "Streetwear" },
  { slug: "denim", name: "Denim" },
  { slug: "polo", name: "Polo Shirts" },
  { slug: "uniforms", name: "Corporate Uniforms" },
  { slug: "kidswear", name: "Kids Wear" },
  { slug: "trousers", name: "Trousers" },
  { slug: "shorts", name: "Shorts" },
  { slug: "tanktops", name: "Tank Tops" },
  { slug: "joggers", name: "Joggers" },
  { slug: "dressshirts", name: "Dress Shirts" },
  { slug: "puffer", name: "Puffer Jackets" },
  { slug: "cargopants", name: "Cargo Pants" },
  { slug: "swimwear", name: "Swimwear" },
  { slug: "leggings", name: "Leggings" },
  { slug: "caps", name: "Caps & Hats" },
];

interface Product {
  id: string;
  category_slug: string;
  name: string;
  description: string;
  image_url: string | null;
  moq: string | null;
  fabrics: string[];
  featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at: string;
}

const AdminProducts = () => {
  const catalogInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [form, setForm] = useState({
    category_slug: "tshirts",
    name: "",
    description: "",
    image_url: "",
    moq: "",
    fabrics: "",
    featured: false,
  });

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Failed to load products", description: error.message, variant: "destructive" });
      return;
    }
    setItems((data as Product[]) || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const parseCsvRow = (line: string) => {
    const values: string[] = [];
    let current = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      if (character === '"' && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (character === "," && !quoted) {
        values.push(current.trim());
        current = "";
      } else {
        current += character;
      }
    }
    values.push(current.trim());
    return values;
  };

  const importCatalog = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const rows = text.split(/\r?\n/).filter((line) => line.trim());
      if (rows.length < 2) throw new Error("The catalog file has no product rows.");
      const headers = parseCsvRow(rows[0]).map((header) => header.toLowerCase());
      const required = ["category_slug", "name"];
      if (required.some((header) => !headers.includes(header))) {
        throw new Error("CSV must include category_slug and name columns.");
      }
      const products = rows.slice(1).map((line) => {
        const values = parseCsvRow(line);
        const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
        return {
          category_slug: row.category_slug,
          name: row.name,
          description: row.description || "",
          image_url: row.image_url || null,
          moq: row.moq || null,
          fabrics: row.fabrics ? row.fabrics.split("|").map((fabric) => fabric.trim()).filter(Boolean) : [],
          featured: ["true", "yes", "1"].includes(row.featured?.toLowerCase()),
          is_published: !["false", "no", "0"].includes(row.is_published?.toLowerCase()),
          sort_order: Number.parseInt(row.sort_order || "0", 10) || 0,
        };
      }).filter((product) => product.category_slug && product.name);
      if (!products.length) throw new Error("No valid products were found in the catalog.");
      const { error } = await supabase.from("products").insert(products);
      if (error) throw error;
      toast({ title: "Catalog imported", description: `${products.length} products added.` });
      await fetchProducts();
    } catch (error) {
      const message = error instanceof Error ? error.message : "The catalog could not be imported.";
      toast({ title: "Catalog import failed", description: message, variant: "destructive" });
    } finally {
      setImporting(false);
      if (catalogInputRef.current) catalogInputRef.current.value = "";
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("production-images").upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("production-images").getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
      toast({ title: "Image uploaded" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const fabrics = form.fabrics.split(",").map((s) => s.trim()).filter(Boolean);
    const { error } = await supabase.from("products").insert({
      category_slug: form.category_slug,
      name: form.name.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      moq: form.moq.trim() || null,
      fabrics,
      featured: form.featured,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Failed to add product", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product added" });
    setForm({ category_slug: form.category_slug, name: "", description: "", image_url: "", moq: "", fabrics: "", featured: false });
    fetchProducts();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    fetchProducts();
  };

  const toggleFeatured = async (p: Product) => {
    const { error } = await supabase.from("products").update({ featured: !p.featured }).eq("id", p.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    fetchProducts();
  };

  const togglePublished = async (p: Product) => {
    const { error } = await supabase.from("products").update({ is_published: !p.is_published }).eq("id", p.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: p.is_published ? "Product unpublished" : "Product published" });
    fetchProducts();
  };

  const visible = items.filter((p) => {
    if (filterCat !== "all" && p.category_slug !== filterCat) return false;
    if (filterStatus === "published" && !p.is_published) return false;
    if (filterStatus === "draft" && p.is_published) return false;
    if (filterStatus === "featured" && !p.featured) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">Products & Catalog</h2>
          <p className="text-sm text-muted-foreground">Add products individually or import a CSV catalog.</p>
        </div>
        <div>
          <input
            ref={catalogInputRef}
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importCatalog(file);
            }}
          />
          <button type="button" onClick={() => catalogInputRef.current?.click()} disabled={importing} className="btn-primary text-sm disabled:opacity-50 flex items-center gap-2">
            <Upload className="w-4 h-4" /> {importing ? "Importing…" : "Import CSV Catalog"}
          </button>
          <p className="text-xs text-muted-foreground mt-2 sm:text-right">Required columns: category_slug, name</p>
        </div>
      </div>

      <form onSubmit={addProduct} className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Plus className="w-4 h-4" /> Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <select value={form.category_slug} onChange={(e) => setForm({ ...form, category_slug: e.target.value })} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Product Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Oversized Boxy Tee" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Heavy-weight 240gsm cotton with dropped shoulders..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>MOQ</Label>
            <Input value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} placeholder="200 pcs" />
          </div>
          <div className="space-y-1.5">
            <Label>Fabrics (comma-separated)</Label>
            <Input value={form.fabrics} onChange={(e) => setForm({ ...form, fabrics: e.target.value })} placeholder="100% Cotton, Cotton/Poly Blend" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Product Image</Label>
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} className="text-sm" />
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="or paste image URL" className="flex-1" />
          </div>
          {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
          {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-md border border-border" />}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
          Mark as featured
        </label>
        <button type="submit" disabled={loading || uploading} className="btn-primary text-sm disabled:opacity-50">
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="font-semibold text-foreground">All Products ({visible.length})</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Unpublished</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.length === 0 && <p className="text-sm text-muted-foreground">No database products yet. Add one above or import a CSV catalog.</p>}
          {visible.map((p) => {
            const catName = CATEGORIES.find((c) => c.slug === p.category_slug)?.name || p.category_slug;
            return (
              <div key={p.id} className={`bg-card border border-border rounded-lg overflow-hidden ${!p.is_published ? "opacity-70" : ""}`}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full aspect-square object-cover" />
                ) : (
                  <div className="w-full aspect-square bg-muted flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-accent font-semibold uppercase tracking-wide">{catName}</p>
                      <h4 className="font-semibold text-foreground">{p.name}</h4>
                    </div>
                    <button onClick={() => toggleFeatured(p)} title={p.featured ? "Remove from featured" : "Feature in this category"}>
                      <Star className={`w-4 h-4 ${p.featured ? "fill-accent text-accent" : "text-muted-foreground"}`} />
                    </button>
                  </div>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.is_published ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {p.is_published ? "Published" : "Unpublished"}
                  </span>
                  {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
                  {p.moq && <p className="text-xs text-muted-foreground mt-1">MOQ: {p.moq}</p>}
                  <div className="mt-3 flex items-center gap-3">
                    <button onClick={() => togglePublished(p)} className="flex items-center gap-1 text-xs font-semibold text-foreground hover:text-accent">
                      {p.is_published ? <><EyeOff className="w-3 h-3" /> Unpublish</> : <><Eye className="w-3 h-3" /> Publish</>}
                    </button>
                    <button onClick={() => remove(p.id)} className="flex items-center gap-1 text-xs text-red-600 hover:underline">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
