const clients = [
  "Fashion Brands", "Streetwear Labels", "E-Commerce Brands",
  "Retailers", "Private Label", "Corporate Buyers", "Fashion Startups",
];

const ClientsSection = () => (
  <section className="section-padding bg-cream">
    <div className="container-max text-center">
      <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Who We Serve</p>
      <h2 className="heading-lg text-foreground">Trusted by Brands Worldwide</h2>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {clients.map((c) => (
          <div key={c} className="px-8 py-4 bg-card rounded-lg border border-border text-sm font-medium text-muted-foreground font-heading">
            {c}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientsSection;
