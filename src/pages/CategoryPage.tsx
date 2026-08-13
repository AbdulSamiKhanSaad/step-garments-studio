import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";
import ProductGallery from "@/components/ProductGallery";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  CATEGORIES,
  CATEGORY_META,
  CatalogItem,
  SEED,
  categoryName,
  mapDbProduct,
} from "@/data/catalog";

const CategoryPage = () => {
  const { slug = "" } = useParams();
  const category = CATEGORIES.find((c) => c.slug === slug);
  const meta = CATEGORY_META[slug];
  const [dbItems, setDbItems] = useState<CatalogItem[]>([]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [detail, setDetail] = useState<CatalogItem | null>(null);

  useEffect(() => {
    if (!category) return;
    supabase
      .from("products")
      .select("*")
      .eq("category_slug", slug)
      .eq("is_published", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .then(({ data }) => setDbItems((data || []).map(mapDbProduct)));
  }, [slug, category]);

  const items = useMemo(
    () => [...dbItems, ...SEED.filter((s) => s.category_slug === slug)],
    [dbItems, slug]
  );

  const title = category ? `${categoryName(slug)} Manufacturer | Xteric Sports Wear` : "Category not found";
  const description = meta?.blurb || `Custom ${categoryName(slug)} manufacturing for global brands.`;

  useEffect(() => {
    document.title = title;
    const setTag = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLElement | null;
      if (!el) {
        el = document.createElement(selector.startsWith("link") ? "link" : "meta");
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
    };
    setTag('meta[name="description"]', { name: "description", content: description });
    setTag('link[rel="canonical"]', { rel: "canonical", href: `${window.location.origin}/products/${slug}` });
  }, [title, description, slug]);

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container-max section-padding text-center">
          <h1 className="heading-lg text-foreground">Category not found</h1>
          <Link to="/products" className="btn-primary mt-6 inline-block text-sm">Browse all products</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const heroImage = items[0]?.image;

  return (
    <div className="min-h-screen">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${categoryName(slug)} Manufacturing`,
            description,
            url: `${window.location.origin}/products/${slug}`,
          }),
        }}
      />

      {/* Hero */}
      <header className="relative h-[280px] sm:h-[360px] overflow-hidden">
        {heroImage && <img src={heroImage} alt={`${categoryName(slug)} manufacturing`} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="gradient-overlay" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1 text-xs text-primary-foreground/70 mb-3">
              <Link to="/products" className="hover:text-accent">Products</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-accent font-semibold uppercase tracking-widest">{categoryName(slug)}</span>
            </nav>
            <h1 className="heading-xl text-primary-foreground">{meta?.heading || `${categoryName(slug)} Manufacturing`}</h1>
            <p className="mt-4 text-primary-foreground/80 text-base sm:text-lg">{description}</p>
          </div>
        </div>
      </header>

      {/* Grid */}
      <section className="section-padding bg-secondary/40">
        <div className="container-max">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6">
            {categoryName(slug)} Styles <span className="text-muted-foreground font-normal text-sm">({items.length})</span>
          </h2>

          {items.length === 0 ? (
            <p className="text-muted-foreground">No products published in this category yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {items.map((p) => (
                <article key={p.id} className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <button onClick={() => setDetail(p)} className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img src={p.image} alt={`${p.name} — ${categoryName(slug)}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {p.featured && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wide rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                    )}
                  </button>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-heading text-sm sm:text-base font-bold text-foreground line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 flex-1">{p.description || "Custom manufactured to your specifications."}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">MOQ: <span className="text-foreground font-semibold">{p.moq}</span></span>
                      <span className="text-xs font-bold text-accent">Contact for Price</span>
                    </div>
                    <button onClick={() => { setSelectedProduct(p.name); setQuoteOpen(true); }} className="btn-primary w-full mt-3 text-xs py-2.5">Request Quote</button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Other categories */}
          <div className="mt-14">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Explore other categories</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c.slug !== slug).map((c) => (
                <Link key={c.slug} to={`/products/${c.slug}`} className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-border bg-card text-foreground hover:border-accent hover:text-accent transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} productName={selectedProduct} />

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">{detail.name}</DialogTitle>
                <p className="text-xs text-accent font-semibold uppercase tracking-widest">{categoryName(detail.category_slug)}</p>
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
                    <button onClick={() => { setDetail(null); setSelectedProduct(detail.name); setQuoteOpen(true); }} className="btn-primary w-full text-sm">Request Quote</button>
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

export default CategoryPage;
