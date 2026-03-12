const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "50+", label: "Countries Served" },
  { value: "500+", label: "Brands Partnered" },
  { value: "10M+", label: "Garments Produced" },
];

const StatsSection = () => (
  <section className="bg-navy text-primary-foreground section-padding">
    <div className="container-max grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
      {stats.map((s) => (
        <div key={s.label}>
          <div className="heading-xl text-accent">{s.value}</div>
          <div className="mt-2 text-sm sm:text-base text-primary-foreground/70 font-medium">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsSection;
