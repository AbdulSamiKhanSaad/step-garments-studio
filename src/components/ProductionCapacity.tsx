import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Layers, Ruler, Package } from "lucide-react";

import productTshirts from "@/assets/product-tshirts.jpg";
import productHoodies from "@/assets/product-hoodies.jpg";
import productPolos from "@/assets/product-polos.jpg";
import productJackets from "@/assets/product-jackets.jpg";
import productActivewear from "@/assets/product-activewear.jpg";
import productDenim from "@/assets/product-denim.jpg";
import productDressshirts from "@/assets/product-dressshirts.jpg";
import productPuffer from "@/assets/product-puffer.jpg";
import productCargopants from "@/assets/product-cargopants.jpg";
import productSwimwear from "@/assets/product-swimwear.jpg";
import productLeggings from "@/assets/product-leggings.jpg";
import productCaps from "@/assets/product-caps.jpg";

gsap.registerPlugin(ScrollTrigger);

type Garment = {
  id: string;
  name: string;
  image: string;
  moq: string;
  leadTime: string;
  fabric: string;
  sizes: string;
};

const GARMENTS: Garment[] = [
  { id: "tshirts", name: "T-Shirts", image: productTshirts, moq: "100 pcs", leadTime: "21 days", fabric: "180–240 GSM Cotton", sizes: "XS – 4XL" },
  { id: "hoodies", name: "Hoodies", image: productHoodies, moq: "100 pcs", leadTime: "28 days", fabric: "320–450 GSM Fleece", sizes: "XS – 4XL" },
  { id: "polos", name: "Polo Shirts", image: productPolos, moq: "100 pcs", leadTime: "25 days", fabric: "200–260 GSM Piqué", sizes: "XS – 3XL" },
  { id: "jackets", name: "Jackets", image: productJackets, moq: "150 pcs", leadTime: "35 days", fabric: "Twill / Nylon Shell", sizes: "S – 3XL" },
  { id: "activewear", name: "Activewear", image: productActivewear, moq: "150 pcs", leadTime: "30 days", fabric: "Polyester / Spandex", sizes: "XS – 2XL" },
  { id: "denim", name: "Denim", image: productDenim, moq: "200 pcs", leadTime: "40 days", fabric: "12–14 oz Selvedge", sizes: "26 – 40" },
  { id: "dressshirts", name: "Dress Shirts", image: productDressshirts, moq: "100 pcs", leadTime: "28 days", fabric: "100s Cotton Poplin", sizes: "S – 3XL" },
  { id: "puffer", name: "Puffer Jackets", image: productPuffer, moq: "150 pcs", leadTime: "45 days", fabric: "Nylon + Down Fill", sizes: "S – 3XL" },
  { id: "cargopants", name: "Cargo Pants", image: productCargopants, moq: "150 pcs", leadTime: "32 days", fabric: "Ripstop Cotton", sizes: "28 – 42" },
  { id: "swimwear", name: "Swimwear", image: productSwimwear, moq: "100 pcs", leadTime: "25 days", fabric: "Recycled Polyamide", sizes: "XS – 2XL" },
  { id: "leggings", name: "Leggings", image: productLeggings, moq: "150 pcs", leadTime: "26 days", fabric: "Nylon / Spandex", sizes: "XS – 2XL" },
  { id: "caps", name: "Caps & Hats", image: productCaps, moq: "200 pcs", leadTime: "22 days", fabric: "Brushed Cotton Twill", sizes: "One Size" },
];

const ProductionCapacity = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      // Compute scroll distance based on track width
      const getDistance = () => track.scrollWidth - window.innerWidth + 80;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      return () => {
        tween.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background"
      aria-label="Our Production Capacity"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="absolute left-0 right-0 top-0 z-20 px-6 pt-12 md:px-12 md:pt-16"
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.4em] text-primary">
              — Capabilities
            </p>
            <h2 className="font-serif text-3xl leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Our Production
              <br />
              <span className="italic text-primary">Capacity</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-xs leading-relaxed text-muted-foreground md:block md:text-sm">
            Hover any garment to view live manufacturing specs. Scroll to explore our full production range.
          </p>
        </div>
      </div>

      {/* Marquee track */}
      <div className="absolute inset-0 flex items-center">
        <div
          ref={trackRef}
          className="flex gap-6 pl-6 pr-20 will-change-transform md:gap-8 md:pl-12"
          style={{ width: "max-content" }}
        >
          {GARMENTS.map((g) => {
            const isActive = hovered === g.id;
            return (
              <article
                key={g.id}
                onMouseEnter={() => setHovered(g.id)}
                onMouseLeave={() => setHovered(null)}
                className={`group relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border/40 bg-card transition-all duration-500 ease-out ${
                  isActive
                    ? "-translate-y-3 shadow-2xl shadow-primary/20"
                    : "translate-y-0 shadow-md"
                }`}
                style={{
                  width: "clamp(240px, 26vw, 360px)",
                  height: "clamp(320px, 36vw, 480px)",
                }}
              >
                <img
                  src={g.image}
                  alt={`${g.name} manufacturing sample`}
                  loading="lazy"
                  className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                    isActive ? "scale-110" : "scale-100"
                  }`}
                />

                {/* Bottom label (default) */}
                <div
                  className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent p-5 transition-opacity duration-300 ${
                    isActive ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary">
                    Category
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-foreground">
                    {g.name}
                  </h3>
                </div>

                {/* Quick View overlay */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/90 to-background/30 p-6 transition-all duration-500 ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-4 opacity-0"
                  }`}
                >
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary">
                    Quick View
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-foreground md:text-3xl">
                    {g.name}
                  </h3>
                  <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
                    <Spec icon={<Package className="h-3.5 w-3.5" />} label="MOQ" value={g.moq} />
                    <Spec icon={<Clock className="h-3.5 w-3.5" />} label="Lead Time" value={g.leadTime} />
                    <Spec icon={<Layers className="h-3.5 w-3.5" />} label="Fabric" value={g.fabric} />
                    <Spec icon={<Ruler className="h-3.5 w-3.5" />} label="Sizes" value={g.sizes} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:bottom-8">
        <span className="h-px w-8 bg-muted-foreground/40" />
        Scroll to explore
        <span className="h-px w-8 bg-muted-foreground/40" />
      </div>
    </section>
  );
};

const Spec = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center justify-between text-xs">
    <span className="flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
      {icon}
      {label}
    </span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default ProductionCapacity;
