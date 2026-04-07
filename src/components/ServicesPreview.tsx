import { Link } from "react-router-dom";
import { Scissors, Package, Globe, Search, Ruler, Truck } from "lucide-react";

const services = [
  { icon: Scissors, title: "Fabric Sourcing", desc: "Premium fabrics from trusted global suppliers" },
  { icon: Ruler, title: "Pattern Making", desc: "Expert design development and tech packs" },
  { icon: Package, title: "Sampling", desc: "Precision prototypes before bulk production" },
  { icon: Scissors, title: "Bulk Production", desc: "Scalable manufacturing with consistent quality" },
  { icon: Search, title: "Quality Control", desc: "Rigorous inspection at every stage" },
  { icon: Truck, title: "Global Shipping", desc: "Worldwide delivery with full logistics support" },
];

const ServicesPreview = () => (
  <section className="section-padding bg-secondary">
    <div className="container-max">
      <div className="text-center mb-16">
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">What We Do</p>
        <h2 className="heading-lg text-foreground">End-to-End Manufacturing Services</h2>
        <p className="text-body text-muted-foreground mt-4 max-w-2xl mx-auto">
          From concept to delivery, we handle every step of the garment production process.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="bg-card p-8 rounded-lg border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
              <s.icon className="w-7 h-7 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">{s.title}</h3>
            <p className="text-muted-foreground text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link to="/services" className="btn-outline">View All Services</Link>
      </div>
    </div>
  </section>
);

export default ServicesPreview;
