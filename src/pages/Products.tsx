import { useRef, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import ProductGallery from "@/components/ProductGallery";
import ProductFilters from "@/components/ProductFilters";
import QuoteModal from "@/components/QuoteModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

const categoryNav = [
  { name: "T-Shirts", image: productTshirts, id: "tshirts" },
  { name: "Hoodies", image: productHoodies, id: "hoodies" },
  { name: "Tracksuits", image: productTracksuits, id: "tracksuits" },
  { name: "Jackets", image: productJackets, id: "jackets" },
  { name: "Sportswear", image: productSportswear, id: "sportswear" },
  { name: "Streetwear", image: productStreetwear, id: "streetwear" },
  { name: "Denim", image: productDenim, id: "denim" },
  { name: "Polo Shirts", image: productPolo, id: "polo" },
  { name: "Trousers", image: productTrousers, id: "trousers" },
  { name: "Shorts", image: productShorts, id: "shorts" },
  { name: "Tank Tops", image: productTanktops, id: "tanktops" },
  { name: "Joggers", image: productJoggers, id: "joggers" },
];

const products = [
  { id: "tshirts", name: "Premium T-Shirts", image: productTshirts, gallery: [productTshirts, galleryTshirts2, galleryTshirts3], desc: "Custom t-shirts crafted from the finest cotton and blended fabrics. Perfect for streetwear, fashion brands, and promotional wear.", fabrics: ["100% Cotton", "Cotton/Polyester Blend", "Organic Cotton", "Tri-Blend"], customization: ["Screen Printing", "DTG Printing", "Embroidery", "Custom Labels"], moq: "200 pcs" },
  { id: "hoodies", name: "Hoodies & Sweatshirts", image: productHoodies, gallery: [productHoodies, galleryHoodies2, galleryHoodies3], desc: "High-quality hoodies with premium fleece lining. Ideal for streetwear brands, athleisure lines, and corporate merchandise.", fabrics: ["French Terry", "Fleece", "Cotton/Polyester", "Organic Cotton Fleece"], customization: ["Embroidery", "Screen Print", "Puff Print", "Custom Zipper Pulls"], moq: "150 pcs" },
  { id: "tracksuits", name: "Tracksuits", image: productTracksuits, gallery: [productTracksuits, galleryTracksuits2, gallerySportswear2], desc: "Complete tracksuit sets with matching jackets and pants. Perfect for athletic brands, streetwear, and corporate teams.", fabrics: ["French Terry", "Tricot", "Velour", "Performance Blend"], customization: ["Embroidery", "Screen Print", "Custom Piping", "Side Stripe Options"], moq: "150 sets" },
  { id: "jackets", name: "Jackets & Outerwear", image: productJackets, gallery: [productJackets, galleryJackets2, galleryJackets3], desc: "From bomber jackets to windbreakers, premium outerwear with expert construction and finishing.", fabrics: ["Nylon", "Polyester Shell", "Cotton Canvas", "Faux Leather"], customization: ["Embroidery", "Patches", "Custom Lining", "Custom Zippers"], moq: "100 pcs" },
  { id: "sportswear", name: "Sportswear & Activewear", image: productSportswear, gallery: [productSportswear, gallerySportswear2, gallerySportswear3], desc: "Performance-driven sportswear engineered for comfort and durability. Moisture-wicking, breathable, and stylish.", fabrics: ["Dri-Fit Polyester", "Spandex Blend", "Nylon Mesh", "Compression Fabric"], customization: ["Sublimation Print", "Heat Transfer", "Reflective Details", "Performance Labels"], moq: "200 pcs" },
  { id: "streetwear", name: "Streetwear Collection", image: productStreetwear, gallery: [productStreetwear, galleryHoodies2, galleryTshirts2], desc: "Bold, trend-forward streetwear for urban fashion brands. Oversized fits, premium fabrics, and statement designs.", fabrics: ["Heavy Cotton", "French Terry", "Distressed Denim", "Washed Fleece"], customization: ["Screen Print", "Puff Print", "Embroidery", "Vintage Wash"], moq: "200 pcs" },
  { id: "denim", name: "Premium Denim", image: productDenim, gallery: [productDenim, galleryDenim2, galleryDenim3], desc: "Premium denim jeans and jackets with expert washes, distressing, and finishing. From raw selvedge to stretch denim.", fabrics: ["Raw Denim", "Stretch Denim", "Selvedge", "Organic Denim"], customization: ["Custom Washes", "Distressing", "Embroidery", "Leather Patches"], moq: "300 pcs" },
  { id: "polo", name: "Polo Shirts", image: productPolo, gallery: [productPolo, galleryPolo2, galleryPolo3], desc: "Classic and modern polo shirts for corporate wear, golf brands, and fashion labels. Premium piqué and performance fabrics.", fabrics: ["Piqué Cotton", "Performance Polyester", "Cotton/Lycra", "CoolMax"], customization: ["Embroidery", "Tipping Customization", "Custom Buttons", "Woven Labels"], moq: "200 pcs" },
  { id: "uniforms", name: "Corporate Uniforms", image: productPolo, gallery: [productPolo, galleryUniforms2, galleryPolo2], desc: "Professional uniforms for hospitality, healthcare, corporate, and industrial sectors. Durable and brand-aligned.", fabrics: ["Poly/Cotton Twill", "Performance Polyester", "Stretch Poplin", "Antimicrobial"], customization: ["Logo Embroidery", "Name Tags", "Custom Pockets", "Reflective Strips"], moq: "100 pcs" },
  { id: "kidswear", name: "Kids Wear", image: productTshirts, gallery: [productTshirts, galleryKidswear2, galleryTshirts2], desc: "Safe, comfortable, and stylish children's clothing. All fabrics meet international safety standards.", fabrics: ["100% Organic Cotton", "BCI Cotton", "Bamboo Blend", "Soft Jersey"], customization: ["Screen Print", "Appliqué", "Embroidery", "Snap Buttons"], moq: "300 pcs" },
  { id: "trousers", name: "Trousers & Chinos", image: productTrousers, gallery: [productTrousers, galleryTrousers2, galleryTrousers3], desc: "Premium cargo pants, chinos, and casual trousers. Crafted for durability with modern fits and versatile styling.", fabrics: ["Cotton Twill", "Stretch Cotton", "Canvas", "Ripstop"], customization: ["Custom Washes", "Embroidery", "Cargo Pockets", "Custom Hardware"], moq: "200 pcs" },
  { id: "shorts", name: "Shorts & Board Shorts", image: productShorts, gallery: [productShorts, galleryShorts2, galleryShorts3], desc: "Athletic shorts, swim trunks, and casual board shorts. Performance fabrics with quick-dry technology.", fabrics: ["Polyester Mesh", "Nylon Taslan", "Stretch Woven", "Quick-Dry Blend"], customization: ["Sublimation Print", "Embroidery", "Custom Drawstrings", "Zip Pockets"], moq: "200 pcs" },
  { id: "tanktops", name: "Tank Tops & Vests", image: productTanktops, gallery: [productTanktops, galleryTanktops2, galleryTanktops3], desc: "Gym tanks, fashion vests, and performance sleeveless tops for men and women. Breathable and lightweight.", fabrics: ["Cotton Jersey", "Performance Mesh", "Bamboo Blend", "Dri-Fit"], customization: ["Screen Print", "DTG Print", "Embroidery", "Custom Labels"], moq: "200 pcs" },
  { id: "joggers", name: "Joggers & Sweatpants", image: productJoggers, gallery: [productJoggers, galleryJoggers2, galleryJoggers3], desc: "Premium joggers and sweatpants with fleece lining. Perfect for athleisure brands and streetwear collections.", fabrics: ["French Terry", "Fleece", "Tech Fleece", "Cotton/Polyester"], customization: ["Embroidery", "Screen Print", "Custom Waistband", "Tapered Fit"], moq: "150 pcs" },
];

const Products = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [fabricFilter, setFabricFilter] = useState("All Fabrics");
  const [moqFilter, setMoqFilter] = useState("Any MOQ");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const searchLower = search.toLowerCase();
      const matchesSearch = !search || p.name.toLowerCase().includes(searchLower) || p.desc.toLowerCase().includes(searchLower) || p.fabrics.some(f => f.toLowerCase().includes(searchLower));
      const matchesCategory = categoryFilter === "All" || p.name.toLowerCase().includes(categoryFilter.toLowerCase()) || p.id.toLowerCase().includes(categoryFilter.toLowerCase().replace(/\s/g, ""));
      const matchesFabric = fabricFilter === "All Fabrics" || p.fabrics.some(f => f.toLowerCase().includes(fabricFilter.toLowerCase()));
      const moqNum = parseInt(p.moq);
      const matchesMoq = moqFilter === "Any MOQ" || moqNum >= parseInt(moqFilter);
      return matchesSearch && matchesCategory && matchesFabric && matchesMoq;
    });
  }, [search, categoryFilter, fabricFilter, moqFilter]);

  const scrollCarousel = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  const scrollToCategory = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openQuote = (productName: string) => {
    setSelectedProduct(productName);
    setQuoteOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative h-[340px] sm:h-[420px] overflow-hidden">
        <img src={heroFactory} alt="Step Garments Products" className="absolute inset-0 w-full h-full object-cover" />
        <div className="gradient-overlay" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Our Products</p>
            <h1 className="heading-xl text-primary-foreground">Premium Apparel Collection</h1>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Manufacturing excellence across every garment category — from concept to delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary border-b border-border sticky top-16 sm:top-20 z-40">
        <div className="container-max relative py-5 px-4 sm:px-6 lg:px-8">
          <button onClick={() => scrollCarousel(-1)} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background shadow-md flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-6" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {categoryNav.map((cat) => (
              <button key={cat.id} onClick={() => scrollToCategory(cat.id)} className="flex-shrink-0 group text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-accent transition-colors mx-auto shadow-md">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="block mt-2 text-xs sm:text-sm font-semibold text-foreground group-hover:text-accent transition-colors whitespace-nowrap">{cat.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => scrollCarousel(1)} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background shadow-md flex items-center justify-center text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="mb-8">
            <ProductFilters search={search} onSearchChange={setSearch} category={categoryFilter} onCategoryChange={setCategoryFilter} fabric={fabricFilter} onFabricChange={setFabricFilter} moq={moqFilter} onMoqChange={setMoqFilter} />
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products match your filters.</p>
              <button onClick={() => { setSearch(""); setCategoryFilter("All"); setFabricFilter("All Fabrics"); setMoqFilter("Any MOQ"); }} className="btn-primary mt-4 text-sm">Clear Filters</button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} id={product.id} className="group bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 scroll-mt-48">
                <div className="relative aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-semibold rounded-full uppercase tracking-wide">MOQ: {product.moq}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-foreground">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1.5 line-clamp-2">{product.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {product.fabrics.slice(0, 3).map((f) => (
                      <span key={f} className="px-2 py-0.5 bg-muted text-muted-foreground text-[11px] rounded-full">{f}</span>
                    ))}
                    {product.fabrics.length > 3 && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[11px] rounded-full">+{product.fabrics.length - 3}</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-semibold text-accent">Contact for Price</p>
                  <ProductGallery images={product.gallery} name={product.name} />
                  <button onClick={() => openQuote(product.name)} className="btn-primary w-full mt-4 text-sm py-3">Request Quote</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PromoBanner headline="Scalable Production for High-Volume Orders" image={serviceFabric} cta="Contact Us" />
      <Footer />
      <QuoteModal open={quoteOpen} onOpenChange={setQuoteOpen} productName={selectedProduct} />
    </div>
  );
};

export default Products;
