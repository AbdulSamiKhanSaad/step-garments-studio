import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import fabricMacro from "@/assets/fabric-macro.jpg";

gsap.registerPlugin(ScrollTrigger);

const SPECS = [
  { label: "GSM", value: "320", unit: "g/m²", detail: "Heavyweight density" },
  { label: "Composition", value: "85/15", unit: "Cotton / Linen", detail: "Premium long-staple blend" },
  { label: "Weave", value: "Twill", unit: "3/1 Diagonal", detail: "Compact & durable structure" },
  { label: "Finish", value: "Enzyme Washed", unit: "Soft Hand", detail: "Pre-shrunk & color-locked" },
];

const FabricExcellence = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heavy, smooth scrub for luxury feel
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=160%",
          scrub: 1.4,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Image scales 100% -> 115%
      tl.fromTo(
        imageRef.current,
        { scale: 1, filter: "brightness(0.85) contrast(1.05)" },
        { scale: 1.15, filter: "brightness(1) contrast(1.1)", ease: "power2.out" },
        0
      );

      // Subtle overlay darkening shift
      tl.fromTo(
        overlayRef.current,
        { opacity: 0.55 },
        { opacity: 0.35, ease: "none" },
        0
      );

      // Title rises and fades in early
      tl.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, ease: "power3.out", duration: 0.4 },
        0.05
      );

      // Specs fade in one by one as image expands
      const specEls = specsRef.current?.querySelectorAll(".spec-item") ?? [];
      specEls.forEach((el, i) => {
        tl.fromTo(
          el,
          { y: 40, opacity: 0, filter: "blur(8px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.35 },
          0.25 + i * 0.18
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background"
      aria-label="Fabric Excellence"
    >
      {/* Macro fabric image */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <img
          src={fabricMacro}
          alt="Macro view of premium woven fabric showcasing weave detail"
          loading="lazy"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Vignette / readability overlay */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background/80"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-16 md:px-10 md:py-20">
        <div ref={titleRef} className="max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-primary">
            — Material Study 01
          </p>
          <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Fabric
            <br />
            <span className="italic text-primary">Excellence</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
            Engineered yarn by yarn. Every meter is woven for weight, drape, and longevity —
            certified by our in-house textile lab.
          </p>
        </div>

        {/* Spec grid */}
        <div
          ref={specsRef}
          className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-10"
        >
          {SPECS.map((spec) => (
            <div
              key={spec.label}
              className="spec-item border-l border-foreground/20 pl-4 md:pl-6"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground md:text-xs">
                {spec.label}
              </p>
              <p className="mt-2 font-serif text-3xl text-foreground md:text-5xl">
                {spec.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-foreground/80 md:text-sm">
                {spec.unit}
              </p>
              <p className="mt-2 text-[11px] leading-snug text-muted-foreground md:text-xs">
                {spec.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FabricExcellence;
