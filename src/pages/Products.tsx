import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import QuoteModal from "@/components/QuoteModal";
import ProductGallery from "@/components/ProductGallery";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { Link } from "react-router-dom";
import serviceFabric from "@/assets/service-fabric.jpg";
import heroFactory from "@/assets/hero-factory.jpg";
import { CATEGORIES, SEED, CATEGORY_FALLBACK, CatalogItem, mapDbProduct } from "@/data/catalog";

const Products = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dbItems, setDbItems] = useState<CatalogItem[]>([]);
  const [detail, setDetail] = useState<CatalogItem | null>(null);

  useEffect(() => {
    supabase.from("products").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }).then(({ data }) => {
      if (!data) return;
      const mapped: CatalogItem[] = data.map((p: any) => ({
        id: p.id,
        category_slug: p.category_slug,
        name: p.name,
        description: p.description || "",
        image: p.image_url || CATEGORY_FALLBACK[p.category_slug] || productTshirts,
        gallery: p.image_url ? [p.image_url] : [CATEGORY_FALLBACK[p.category_slug] || productTshirts],
        fabrics: p.fabrics || [],
        moq: p.moq || "—",
        featured: p.featured,
        source: "admin",
      }));
      setDbItems(mapped);
    });
  }, []);

  const catalog = useMemo(() => {
    // admin items first, then seed
    return [...dbItems, ...SEED];
  }, [dbItems]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.filter((p) => {
      if (activeCategory !== "all" && p.category_slug !== activeCategory) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabrics.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [catalog, activeCategory, search]);

  const openQuote = (name: string) => {
    setSelectedProduct(name);
    setQuoteOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[300px] sm:h-[380px] overflow-hidden">
        <img src={heroFactory} alt="Step Garments Products" className="absolute inset-0 w-full h-full object-cover" />
        <div className="gradient-overlay" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Shop the Collection</p>
            <h1 className="heading-xl text-primary-foreground">Premium Apparel Catalog</h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Browse every category — request a custom quote for any product.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky category & search bar */}
      <section className="bg-background border-b border-border sticky top-16 sm:top-20 z-40">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, fabrics..."
              className="w-full h-11 pl-10 pr-4 rounded-full border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1" style={{ scrollbarWidth: "none" }}>
            {[{ slug: "all", name: "All Products" }, ...CATEGORIES].map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCategory(c.slug)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wide border transition-all ${
                  activeCategory === c.slug
                    ? "bg-accent text-accent-foreground border-accent shadow-md"
                    : "bg-card text-foreground border-border hover:border-accent hover:text-accent"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="section-padding bg-secondary/40">
        <div className="container-max">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> product{filtered.length !== 1 && "s"}
              {activeCategory !== "all" && <> in <span className="font-semibold text-foreground">{CATEGORIES.find(c => c.slug === activeCategory)?.name}</span></>}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found.</p>
              <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="btn-primary mt-4 text-sm">Reset</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((p) => {
                const catName = CATEGORIES.find((c) => c.slug === p.category_slug)?.name || p.category_slug;
                return (
                  <div key={p.id} className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <button onClick={() => setDetail(p)} className="relative aspect-[4/5] overflow-hidden bg-muted">
                      <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {p.featured && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wide rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Featured
                        </span>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-semibold uppercase tracking-wide rounded-full">
                        {catName}
                      </span>
                    </button>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-heading text-sm sm:text-base font-bold text-foreground line-clamp-1">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{p.description || "Custom manufactured to your specifications."}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">MOQ: <span className="text-foreground font-semibold">{p.moq}</span></span>
                        <span className="text-xs font-bold text-accent">Contact for Price</span>
                      </div>
                      <button onClick={() => openQuote(p.name)} className="btn-primary w-full mt-3 text-xs py-2.5">Request Quote</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PromoBanner headline="Scalable Production for High-Volume Orders" image={serviceFabric} cta="Contact Us" />
      <Footer />

      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} productName={selectedProduct} />

      {/* Product detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">{detail.name}</DialogTitle>
                <p className="text-xs text-accent font-semibold uppercase tracking-widest">
                  {CATEGORIES.find((c) => c.slug === detail.category_slug)?.name}
                </p>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6 mt-2">
                <div>
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={detail.image} alt={detail.name} className="w-full h-full object-cover" />
                  </div>
                  {detail.gallery.length > 1 && <ProductGallery images={detail.gallery} name={detail.name} />}
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{detail.description || "Custom manufactured to your brand specifications."}</p>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-foreground mb-2">Minimum Order</p>
                    <p className="text-sm text-muted-foreground">{detail.moq}</p>
                  </div>
                  {detail.fabrics.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground mb-2">Available Fabrics</p>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.fabrics.map((f) => (
                          <span key={f} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">{f}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm font-bold text-accent mb-3">Contact for Price</p>
                    <button onClick={() => { setDetail(null); openQuote(detail.name); }} className="btn-primary w-full text-sm">Request Quote</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
