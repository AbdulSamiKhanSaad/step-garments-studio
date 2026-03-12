import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroFactory from "@/assets/hero-factory.jpg";
import heroFashion from "@/assets/hero-fashion.jpg";
import heroLabels from "@/assets/hero-labels.jpg";
import heroQuality from "@/assets/hero-quality.jpg";

const slides = [
  {
    image: heroFactory,
    headline: "Your Global Garment Manufacturing Partner",
    sub: "End-to-end apparel production services for brands worldwide. From design to delivery.",
    cta: "Explore Services",
    link: "/services",
  },
  {
    image: heroFashion,
    headline: "Start Your Clothing Brand With Confidence",
    sub: "We bring your fashion vision to life with expert development, sampling, and bulk production.",
    cta: "View Products",
    link: "/products",
  },
  {
    image: heroLabels,
    headline: "Private Label Manufacturing Experts",
    sub: "Custom branding, labeling, and packaging solutions tailored to your brand identity.",
    cta: "Get a Quote",
    link: "/contact",
  },
  {
    image: heroQuality,
    headline: "Bulk Production. Premium Quality.",
    sub: "Rigorous quality control at every stage ensures your products meet international standards.",
    cta: "Our Process",
    link: "/process",
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img src={s.image} alt={s.headline} className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          <div className="gradient-overlay" />
        </div>
      ))}

      <div className="relative z-10 flex items-center h-full">
        <div className="container-max px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 key={current} className="heading-xl text-primary-foreground animate-slide-up">
              {slides[current].headline}
            </h1>
            <p key={`sub-${current}`} className="mt-6 text-lg sm:text-xl text-primary-foreground/80 animate-fade-in-delay max-w-xl">
              {slides[current].sub}
            </p>
            <div className="mt-8 flex gap-4 animate-fade-in-delay">
              <Link to={slides[current].link} className="btn-primary">
                {slides[current].cta}
              </Link>
              <Link to="/products" className="btn-white">
                Our Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-background/20 backdrop-blur-sm rounded-full text-primary-foreground hover:bg-background/40 transition-colors">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-background/20 backdrop-blur-sm rounded-full text-primary-foreground hover:bg-background/40 transition-colors">
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-10 bg-accent" : "w-2 bg-primary-foreground/40"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
