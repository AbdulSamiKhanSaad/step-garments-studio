import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import QuoteModal from "@/components/QuoteModal";
import ProductGallery from "@/components/ProductGallery";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import productTshirts from "@/assets/product-tshirts.jpg";
import productHoodies from "@/assets/product-hoodies.jpg";
import productSportswear from "@/assets/product-sportswear.jpg";
import productDenim from "@/assets/product-denim.jpg";
import productJackets from "@/assets/product-jackets.jpg";
import productPolo from "@/assets/product-polo.jpg";
import productTracksuits from "@/assets/product-tracksuits.jpg";
import productStreetwear from "@/assets/product-streetwear.jpg";
import productTrousers from "@/assets/product-trousers.jpg";
import productShorts from "@/assets/product-shorts.jpg";
import productTanktops from "@/assets/product-tanktops.jpg";
import productJoggers from "@/assets/product-joggers.jpg";
import productDressshirts from "@/assets/product-dressshirts.jpg";
import productPuffer from "@/assets/product-puffer.jpg";
import productCargopants from "@/assets/product-cargopants.jpg";
import productSwimwear from "@/assets/product-swimwear.jpg";
import productLeggings from "@/assets/product-leggings.jpg";
import productCaps from "@/assets/product-caps.jpg";
import serviceFabric from "@/assets/service-fabric.jpg";
import heroFactory from "@/assets/hero-factory.jpg";

import galleryTshirts2 from "@/assets/gallery-tshirts-2.jpg";
import galleryTshirts3 from "@/assets/gallery-tshirts-3.jpg";
import galleryHoodies2 from "@/assets/gallery-hoodies-2.jpg";
import galleryHoodies3 from "@/assets/gallery-hoodies-3.jpg";
import gallerySportswear2 from "@/assets/gallery-sportswear-2.jpg";
import gallerySportswear3 from "@/assets/gallery-sportswear-3.jpg";
import galleryDenim2 from "@/assets/gallery-denim-2.jpg";
import galleryDenim3 from "@/assets/gallery-denim-3.jpg";
import galleryJackets2 from "@/assets/gallery-jackets-2.jpg";
import galleryJackets3 from "@/assets/gallery-jackets-3.jpg";
import galleryPolo2 from "@/assets/gallery-polo-2.jpg";
import galleryPolo3 from "@/assets/gallery-polo-3.jpg";
import galleryTracksuits2 from "@/assets/gallery-tracksuits-2.jpg";
import galleryUniforms2 from "@/assets/gallery-uniforms-2.jpg";
import galleryKidswear2 from "@/assets/gallery-kidswear-2.jpg";
import galleryTrousers2 from "@/assets/gallery-trousers-2.jpg";
import galleryTrousers3 from "@/assets/gallery-trousers-3.jpg";
import galleryShorts2 from "@/assets/gallery-shorts-2.jpg";
import galleryShorts3 from "@/assets/gallery-shorts-3.jpg";
import galleryTanktops2 from "@/assets/gallery-tanktops-2.jpg";
import galleryTanktops3 from "@/assets/gallery-tanktops-3.jpg";
import galleryJoggers2 from "@/assets/gallery-joggers-2.jpg";
import galleryJoggers3 from "@/assets/gallery-joggers-3.jpg";
import galleryDressshirts2 from "@/assets/gallery-dressshirts-2.jpg";
import galleryDressshirts3 from "@/assets/gallery-dressshirts-3.jpg";
import galleryPuffer2 from "@/assets/gallery-puffer-2.jpg";
import galleryPuffer3 from "@/assets/gallery-puffer-3.jpg";
import galleryCargopants2 from "@/assets/gallery-cargopants-2.jpg";
import galleryCargopants3 from "@/assets/gallery-cargopants-3.jpg";
import gallerySwimwear2 from "@/assets/gallery-swimwear-2.jpg";
import gallerySwimwear3 from "@/assets/gallery-swimwear-3.jpg";
import galleryLeggings2 from "@/assets/gallery-leggings-2.jpg";
import galleryLeggings3 from "@/assets/gallery-leggings-3.jpg";
import galleryCaps2 from "@/assets/gallery-caps-2.jpg";
import galleryCaps3 from "@/assets/gallery-caps-3.jpg";

type CatalogItem = {
  id: string;
  category_slug: string;
  name: string;
  description: string;
  image: string;
  gallery: string[];
  fabrics: string[];
  moq: string;
  featured?: boolean;
  source: "seed" | "admin";
};

const CATEGORIES = [
  { slug: "tshirts", name: "T-Shirts" },
  { slug: "hoodies", name: "Hoodies" },
  { slug: "tracksuits", name: "Tracksuits" },
  { slug: "jackets", name: "Jackets" },
  { slug: "sportswear", name: "Sportswear" },
  { slug: "streetwear", name: "Streetwear" },
  { slug: "denim", name: "Denim" },
  { slug: "polo", name: "Polo Shirts" },
  { slug: "uniforms", name: "Uniforms" },
  { slug: "kidswear", name: "Kids Wear" },
  { slug: "trousers", name: "Trousers" },
  { slug: "shorts", name: "Shorts" },
  { slug: "tanktops", name: "Tank Tops" },
  { slug: "joggers", name: "Joggers" },
  { slug: "dressshirts", name: "Dress Shirts" },
  { slug: "puffer", name: "Puffer" },
  { slug: "cargopants", name: "Cargo Pants" },
  { slug: "swimwear", name: "Swimwear" },
  { slug: "leggings", name: "Leggings" },
  { slug: "caps", name: "Caps & Hats" },
];

const SEED: CatalogItem[] = [
  { id: "seed-tshirts", category_slug: "tshirts", name: "Premium T-Shirts", image: productTshirts, gallery: [productTshirts, galleryTshirts2, galleryTshirts3], description: "Custom t-shirts crafted from the finest cotton and blended fabrics. Perfect for streetwear, fashion brands, and promotional wear.", fabrics: ["100% Cotton", "Cotton/Poly Blend", "Organic Cotton", "Tri-Blend"], moq: "200 pcs", source: "seed" },
  { id: "seed-hoodies", category_slug: "hoodies", name: "Hoodies & Sweatshirts", image: productHoodies, gallery: [productHoodies, galleryHoodies2, galleryHoodies3], description: "High-quality hoodies with premium fleece lining. Ideal for streetwear brands, athleisure lines, and corporate merchandise.", fabrics: ["French Terry", "Fleece", "Cotton/Polyester", "Organic Cotton Fleece"], moq: "150 pcs", source: "seed" },
  { id: "seed-tracksuits", category_slug: "tracksuits", name: "Tracksuits", image: productTracksuits, gallery: [productTracksuits, galleryTracksuits2, gallerySportswear2], description: "Complete tracksuit sets with matching jackets and pants. Perfect for athletic brands, streetwear, and corporate teams.", fabrics: ["French Terry", "Tricot", "Velour", "Performance Blend"], moq: "150 sets", source: "seed" },
  { id: "seed-jackets", category_slug: "jackets", name: "Jackets & Outerwear", image: productJackets, gallery: [productJackets, galleryJackets2, galleryJackets3], description: "From bomber jackets to windbreakers, premium outerwear with expert construction and finishing.", fabrics: ["Nylon", "Polyester Shell", "Cotton Canvas", "Faux Leather"], moq: "100 pcs", source: "seed" },
  { id: "seed-sportswear", category_slug: "sportswear", name: "Sportswear & Activewear", image: productSportswear, gallery: [productSportswear, gallerySportswear2, gallerySportswear3], description: "Performance-driven sportswear engineered for comfort and durability. Moisture-wicking, breathable, and stylish.", fabrics: ["Dri-Fit Polyester", "Spandex Blend", "Nylon Mesh", "Compression Fabric"], moq: "200 pcs", source: "seed" },
  { id: "seed-streetwear", category_slug: "streetwear", name: "Streetwear Collection", image: productStreetwear, gallery: [productStreetwear, galleryHoodies2, galleryTshirts2], description: "Bold, trend-forward streetwear for urban fashion brands. Oversized fits, premium fabrics, and statement designs.", fabrics: ["Heavy Cotton", "French Terry", "Distressed Denim", "Washed Fleece"], moq: "200 pcs", source: "seed" },
  { id: "seed-denim", category_slug: "denim", name: "Premium Denim", image: productDenim, gallery: [productDenim, galleryDenim2, galleryDenim3], description: "Premium denim jeans and jackets with expert washes, distressing, and finishing.", fabrics: ["Raw Denim", "Stretch Denim", "Selvedge", "Organic Denim"], moq: "300 pcs", source: "seed" },
  { id: "seed-polo", category_slug: "polo", name: "Polo Shirts", image: productPolo, gallery: [productPolo, galleryPolo2, galleryPolo3], description: "Classic and modern polo shirts for corporate wear, golf brands, and fashion labels.", fabrics: ["Piqué Cotton", "Performance Polyester", "Cotton/Lycra", "CoolMax"], moq: "200 pcs", source: "seed" },
  { id: "seed-uniforms", category_slug: "uniforms", name: "Corporate Uniforms", image: productPolo, gallery: [productPolo, galleryUniforms2, galleryPolo2], description: "Professional uniforms for hospitality, healthcare, corporate, and industrial sectors.", fabrics: ["Poly/Cotton Twill", "Performance Polyester", "Stretch Poplin", "Antimicrobial"], moq: "100 pcs", source: "seed" },
  { id: "seed-kidswear", category_slug: "kidswear", name: "Kids Wear", image: productTshirts, gallery: [productTshirts, galleryKidswear2, galleryTshirts2], description: "Safe, comfortable, and stylish children's clothing. All fabrics meet international safety standards.", fabrics: ["100% Organic Cotton", "BCI Cotton", "Bamboo Blend", "Soft Jersey"], moq: "300 pcs", source: "seed" },
  { id: "seed-trousers", category_slug: "trousers", name: "Trousers & Chinos", image: productTrousers, gallery: [productTrousers, galleryTrousers2, galleryTrousers3], description: "Premium cargo pants, chinos, and casual trousers. Crafted for durability with modern fits.", fabrics: ["Cotton Twill", "Stretch Cotton", "Canvas", "Ripstop"], moq: "200 pcs", source: "seed" },
  { id: "seed-shorts", category_slug: "shorts", name: "Shorts & Board Shorts", image: productShorts, gallery: [productShorts, galleryShorts2, galleryShorts3], description: "Athletic shorts, swim trunks, and casual board shorts. Performance fabrics with quick-dry technology.", fabrics: ["Polyester Mesh", "Nylon Taslan", "Stretch Woven", "Quick-Dry Blend"], moq: "200 pcs", source: "seed" },
  { id: "seed-tanktops", category_slug: "tanktops", name: "Tank Tops & Vests", image: productTanktops, gallery: [productTanktops, galleryTanktops2, galleryTanktops3], description: "Gym tanks, fashion vests, and performance sleeveless tops. Breathable and lightweight.", fabrics: ["Cotton Jersey", "Performance Mesh", "Bamboo Blend", "Dri-Fit"], moq: "200 pcs", source: "seed" },
  { id: "seed-joggers", category_slug: "joggers", name: "Joggers & Sweatpants", image: productJoggers, gallery: [productJoggers, galleryJoggers2, galleryJoggers3], description: "Premium joggers and sweatpants with fleece lining. Perfect for athleisure and streetwear.", fabrics: ["French Terry", "Fleece", "Tech Fleece", "Cotton/Polyester"], moq: "150 pcs", source: "seed" },
  { id: "seed-dressshirts", category_slug: "dressshirts", name: "Dress Shirts & Formal", image: productDressshirts, gallery: [productDressshirts, galleryDressshirts2, galleryDressshirts3], description: "Premium formal and business dress shirts. Expert tailoring with luxury fabrics and finishing.", fabrics: ["Egyptian Cotton", "Poplin", "Oxford Cloth", "Twill Weave"], moq: "150 pcs", source: "seed" },
  { id: "seed-puffer", category_slug: "puffer", name: "Puffer & Down Jackets", image: productPuffer, gallery: [productPuffer, galleryPuffer2, galleryPuffer3], description: "Insulated puffer jackets with premium fill. Perfect for winter collections and outdoor brands.", fabrics: ["Ripstop Nylon", "Recycled Polyester", "Down Fill", "Synthetic Insulation"], moq: "100 pcs", source: "seed" },
  { id: "seed-cargopants", category_slug: "cargopants", name: "Cargo Pants", image: productCargopants, gallery: [productCargopants, galleryCargopants2, galleryCargopants3], description: "Military-inspired cargo pants with functional pockets. Durable construction for workwear and fashion.", fabrics: ["Cotton Canvas", "Ripstop", "Stretch Twill", "Nylon Blend"], moq: "200 pcs", source: "seed" },
  { id: "seed-swimwear", category_slug: "swimwear", name: "Swimwear & Beachwear", image: productSwimwear, gallery: [productSwimwear, gallerySwimwear2, gallerySwimwear3], description: "Board shorts, swim trunks, and resort wear. Quick-dry fabrics with vibrant sublimation prints.", fabrics: ["Quick-Dry Polyester", "Recycled Nylon", "Spandex Blend", "Board Short Fabric"], moq: "200 pcs", source: "seed" },
  { id: "seed-leggings", category_slug: "leggings", name: "Leggings & Tights", image: productLeggings, gallery: [productLeggings, galleryLeggings2, galleryLeggings3], description: "High-performance compression leggings and yoga tights for fitness and athleisure brands.", fabrics: ["Spandex/Polyester", "Nylon Blend", "Compression Fabric", "Moisture-Wicking"], moq: "200 pcs", source: "seed" },
  { id: "seed-caps", category_slug: "caps", name: "Caps & Headwear", image: productCaps, gallery: [productCaps, galleryCaps2, galleryCaps3], description: "Snapbacks, dad hats, beanies, and bucket hats. Custom embroidery, patches, and branding.", fabrics: ["Cotton Twill", "Polyester Mesh", "Acrylic Knit", "Corduroy"], moq: "200 pcs", source: "seed" },
];

const CATEGORY_FALLBACK: Record<string, string> = {
  tshirts: productTshirts, hoodies: productHoodies, tracksuits: productTracksuits, jackets: productJackets,
  sportswear: productSportswear, streetwear: productStreetwear, denim: productDenim, polo: productPolo,
  uniforms: productPolo, kidswear: productTshirts, trousers: productTrousers, shorts: productShorts,
  tanktops: productTanktops, joggers: productJoggers, dressshirts: productDressshirts, puffer: productPuffer,
  cargopants: productCargopants, swimwear: productSwimwear, leggings: productLeggings, caps: productCaps,
};

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
