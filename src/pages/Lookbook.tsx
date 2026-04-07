import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight, Camera, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";
import lookbook4 from "@/assets/lookbook-4.jpg";
import lookbook5 from "@/assets/lookbook-5.jpg";
import lookbook6 from "@/assets/lookbook-6.jpg";
import lookbook7 from "@/assets/lookbook-7.jpg";
import lookbook8 from "@/assets/lookbook-8.jpg";

const collections = [
  { id: "all", label: "All" },
  { id: "essentials", label: "Essentials" },
  { id: "streetwear", label: "Streetwear" },
  { id: "outerwear", label: "Outerwear" },
  { id: "activewear", label: "Activewear" },
  { id: "denim", label: "Denim" },
];

const looks = [
  { src: lookbook1, title: "Classic White Tee", collection: "essentials", desc: "Premium 200 GSM organic cotton" },
  { src: lookbook2, title: "Urban Hoodie", collection: "streetwear", desc: "Oversized fit, French terry fleece" },
  { src: lookbook3, title: "Bomber Jacket", collection: "outerwear", desc: "Sherpa-lined collar, nylon shell" },
  { src: lookbook4, title: "Performance Tracksuit", collection: "activewear", desc: "Moisture-wicking fabric, slim fit" },
  { src: lookbook5, title: "Denim Collection", collection: "denim", desc: "Premium selvedge denim" },
  { src: lookbook6, title: "Navy Polo", collection: "essentials", desc: "Piqué cotton, embroidered detail" },
  { src: lookbook7, title: "Athleisure Set", collection: "activewear", desc: "Four-way stretch, taped seams" },
  { src: lookbook8, title: "Oversized Sweatshirt", collection: "streetwear", desc: "Heavyweight 320 GSM brushed fleece" },
];

const Lookbook = () => {
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "all" ? looks : looks.filter(l => l.collection === filter);

  const openLightbox = (i: number) => setLightbox(i);
  const closeLightbox = () => setLightbox(null);
  const prevImg = () => setLightbox(i => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
  const nextImg = () => setLightbox(i => i !== null ? (i + 1) % filtered.length : null);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={lookbook3} alt="Lookbook" className="absolute inset-0 w-full h-full object-cover" />
        <div className="gradient-overlay" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div className="animate-slide-up">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-accent" />
              <span className="text-accent font-heading font-bold text-sm uppercase tracking-wider">Editorial</span>
            </div>
            <h1 className="heading-xl text-primary-foreground">Lookbook</h1>
            <p className="text-primary-foreground/70 text-lg mt-4 max-w-xl mx-auto">
              Explore our latest collections through high-fashion editorial photography
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="section-padding">
        <div className="container-max">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {collections.map(c => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-heading font-semibold transition-all duration-300 ${
                  filter === c.id
                    ? "bg-accent text-accent-foreground shadow-lg scale-105"
                    : "bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Masonry-style Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map((look, i) => (
              <div
                key={`${look.title}-${filter}`}
                className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => openLightbox(i)}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="animate-fade-in">
                  <img
                    src={look.src}
                    alt={look.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-xs text-accent font-semibold uppercase tracking-wider">{look.collection}</span>
                    <h3 className="font-heading text-xl font-bold text-primary-foreground mt-1">{look.title}</h3>
                    <p className="text-primary-foreground/70 text-sm mt-1">{look.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-accent font-heading font-semibold text-sm uppercase tracking-wider">Create Your Own</span>
            </div>
            <h2 className="heading-md text-foreground mb-4">Love What You See?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Design your own custom garments using our interactive Design Studio
            </p>
            <Link to="/dashboard/design" className="btn-primary">Open Design Studio</Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center animate-fade-in" onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-6 right-6 text-primary-foreground/80 hover:text-primary-foreground z-50">
            <X className="w-8 h-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevImg(); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-background/20 backdrop-blur rounded-full text-primary-foreground hover:bg-background/40 transition-colors z-50">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextImg(); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-background/20 backdrop-blur rounded-full text-primary-foreground hover:bg-background/40 transition-colors z-50">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] px-4" onClick={e => e.stopPropagation()}>
            <img src={filtered[lightbox].src} alt={filtered[lightbox].title} className="max-h-[75vh] mx-auto object-contain rounded-lg" />
            <div className="text-center mt-4">
              <h3 className="text-primary-foreground font-heading text-xl font-bold">{filtered[lightbox].title}</h3>
              <p className="text-primary-foreground/60 text-sm mt-1">{filtered[lightbox].desc}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Lookbook;
