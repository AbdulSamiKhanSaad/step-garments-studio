import { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Factory, Scissors, CheckCircle, Truck, Eye } from "lucide-react";

import factoryFloor from "@/assets/factory-floor.jpg";
import factoryQuality from "@/assets/factory-quality.jpg";
import factoryShipping from "@/assets/factory-shipping.jpg";
import factoryCutting from "@/assets/factory-cutting.jpg";

const factoryImages = [
  { src: factoryFloor, title: "Production Floor", desc: "State-of-the-art sewing lines with 500+ machines", icon: Factory },
  { src: factoryCutting, title: "Precision Cutting", desc: "Computer-controlled laser cutting for accuracy", icon: Scissors },
  { src: factoryQuality, title: "Quality Control", desc: "Multi-point inspection at every stage", icon: CheckCircle },
  { src: factoryShipping, title: "Logistics Hub", desc: "Global shipping from our warehousing facility", icon: Truck },
];

const processSteps = [
  { step: "01", title: "Design & Sampling", desc: "We create detailed tech packs and produce initial samples for your approval." },
  { step: "02", title: "Fabric Sourcing", desc: "Premium fabrics sourced from certified mills worldwide." },
  { step: "03", title: "Cutting & Sewing", desc: "Precision cutting and expert sewing on our advanced production lines." },
  { step: "04", title: "Quality Check", desc: "Every garment passes rigorous multi-point quality inspection." },
  { step: "05", title: "Packing & Shipping", desc: "Professional packing with custom labeling, shipped globally." },
];

const FactoryShowcase = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoPlay) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % factoryImages.length);
      }, 4000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isAutoPlay]);

  const goTo = (i: number) => {
    setCurrentSlide(i);
    setIsAutoPlay(false);
  };

  return (
    <div className="space-y-12">
      {/* 3D Garment Animation Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-heading text-xl font-bold text-foreground">3D Garment Preview</h3>
          <p className="text-sm text-muted-foreground mt-1">Interactive 3D view of our garment capabilities</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "T-Shirt", color: "from-accent to-blue-600" },
              { name: "Hoodie", color: "from-purple-500 to-pink-500" },
              { name: "Jacket", color: "from-green-500 to-teal-500" },
            ].map((item, i) => (
              <div key={item.name} className="relative group">
                <div className="aspect-square bg-gradient-to-br from-muted to-background rounded-xl flex items-center justify-center overflow-hidden">
                  <div
                    className="w-48 h-48 relative"
                    style={{
                      perspective: "800px",
                    }}
                  >
                    <div
                      className="w-full h-full rounded-2xl flex items-center justify-center text-4xl font-bold"
                      style={{
                        background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                        animation: `spin3d ${6 + i}s ease-in-out infinite`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                        style={{ animation: `spin3d ${6 + i}s ease-in-out infinite`, transformStyle: "preserve-3d" }}>
                        <div className="text-center text-white">
                          <div className="text-5xl mb-2">
                            {item.name === "T-Shirt" ? "👕" : item.name === "Hoodie" ? "🧥" : "🧥"}
                          </div>
                          <p className="text-sm font-semibold">{item.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="font-heading font-bold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">360° Interactive View</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Factory Photo Gallery */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">Our Factory</h3>
            <p className="text-sm text-muted-foreground mt-1">Tour our modern production facility</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => goTo((currentSlide - 1 + factoryImages.length) % factoryImages.length)} className="p-2 rounded-md border border-border hover:bg-muted">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setIsAutoPlay(!isAutoPlay)} className="p-2 rounded-md border border-border hover:bg-muted">
              {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={() => goTo((currentSlide + 1) % factoryImages.length)} className="p-2 rounded-md border border-border hover:bg-muted">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="relative h-[400px] overflow-hidden">
            {factoryImages.map((img, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ${
                  i === currentSlide ? "opacity-100 translate-x-0" : i < currentSlide ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full"
                }`}
              >
                <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <img.icon className="w-5 h-5" />
                    <h4 className="font-heading text-lg font-bold">{img.title}</h4>
                  </div>
                  <p className="text-sm text-white/80">{img.desc}</p>
                </div>
                <button
                  onClick={() => setLightboxImage(img.src)}
                  className="absolute top-4 right-4 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {factoryImages.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentSlide ? "bg-white w-6" : "bg-white/40"}`}
              />
            ))}
          </div>
        </div>
        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-1 p-1">
          {factoryImages.map((img, i) => (
            <button key={i} onClick={() => goTo(i)} className={`relative h-20 overflow-hidden rounded ${i === currentSlide ? "ring-2 ring-accent" : "opacity-60 hover:opacity-100"}`}>
              <img src={img.src} alt={img.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Production Process */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading text-xl font-bold text-foreground mb-6">Production Process</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
          <div className="space-y-6">
            {processSteps.map((step, i) => (
              <div key={step.step} className="flex items-start gap-4 md:gap-6 group">
                <div className="relative z-10 w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <span className="font-heading font-bold text-accent group-hover:text-accent-foreground">{step.step}</span>
                </div>
                <div className="flex-1 bg-muted rounded-lg p-4 group-hover:bg-accent/5 transition-colors">
                  <h4 className="font-heading font-bold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Factory" className="max-w-full max-h-full object-contain rounded-lg" />
          <button className="absolute top-4 right-4 text-white text-2xl hover:opacity-70">&times;</button>
        </div>
      )}

      <style>{`
        @keyframes spin3d {
          0%, 100% { transform: rotateY(0deg) rotateX(5deg); }
          25% { transform: rotateY(90deg) rotateX(-5deg); }
          50% { transform: rotateY(180deg) rotateX(5deg); }
          75% { transform: rotateY(270deg) rotateX(-5deg); }
        }
      `}</style>
    </div>
  );
};

export default FactoryShowcase;
