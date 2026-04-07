import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 50, suffix: "+", label: "Countries Served" },
  { value: 500, suffix: "+", label: "Brands Partnered" },
  { value: 10, suffix: "M+", label: "Garments Produced" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [started, target]);

  return <div ref={ref} className="heading-xl text-accent">{count}{suffix}</div>;
};

const StatsSection = () => (
  <section className="bg-navy text-primary-foreground section-padding">
    <div className="container-max grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="animate-fade-in"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          <Counter target={s.value} suffix={s.suffix} />
          <div className="mt-2 text-sm sm:text-base text-primary-foreground/70 font-medium">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
