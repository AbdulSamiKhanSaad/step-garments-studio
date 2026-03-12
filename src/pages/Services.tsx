import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import { Scissors, Ruler, Package, Search, Truck, Layers, Box } from "lucide-react";
import heroFactory from "@/assets/hero-factory.jpg";
import serviceFabric from "@/assets/service-fabric.jpg";
import serviceShipping from "@/assets/service-shipping.jpg";
import heroQuality from "@/assets/hero-quality.jpg";
import heroLabels from "@/assets/hero-labels.jpg";
import heroFashion from "@/assets/hero-fashion.jpg";

const services = [
  { icon: Layers, title: "Fabric Sourcing", desc: "We source premium fabrics from trusted global suppliers. From organic cotton to performance synthetics, we provide the right materials for your brand.", image: serviceFabric },
  { icon: Ruler, title: "Pattern Making & Design", desc: "Our expert pattern makers create precise technical designs from your concepts. We handle tech packs, grading, and fit optimization.", image: heroFashion },
  { icon: Box, title: "Sampling & Prototyping", desc: "Before bulk production, we create detailed samples for your approval. Iterate until perfection with our rapid sampling process.", image: heroLabels },
  { icon: Scissors, title: "Bulk Production", desc: "Scalable manufacturing with state-of-the-art machinery and skilled workforce. Consistent quality across thousands of units.", image: heroFactory },
  { icon: Search, title: "Quality Control", desc: "Multi-point inspection system ensuring every garment meets international quality standards. AQL-based inspection protocols.", image: heroQuality },
  { icon: Package, title: "Packaging & Labeling", desc: "Custom branded packaging, woven labels, hang tags, and care labels. Your brand identity, perfectly applied.", image: heroLabels },
  { icon: Truck, title: "Global Shipping", desc: "Reliable worldwide delivery via air, sea, or express courier. Full logistics support with real-time tracking.", image: serviceShipping },
];

const Services = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="relative h-[400px] sm:h-[500px] overflow-hidden">
      <img src={heroFactory} alt="Services" className="absolute inset-0 w-full h-full object-cover" />
      <div className="gradient-overlay" />
      <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
        <div>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Our Services</p>
          <h1 className="heading-xl text-primary-foreground">Full-Service Garment Manufacturing</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            End-to-end apparel production services from concept to worldwide delivery.
          </p>
        </div>
      </div>
    </section>

    {services.map((s, i) => (
      <section key={s.title} className={`section-padding ${i % 2 === 0 ? "bg-background" : "bg-secondary"}`}>
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={i % 2 !== 0 ? "lg:order-2" : ""}>
              <img src={s.image} alt={s.title} className="w-full rounded-lg shadow-xl aspect-video object-cover" loading="lazy" />
            </div>
            <div className={i % 2 !== 0 ? "lg:order-1" : ""}>
              <s.icon className="w-12 h-12 text-accent mb-4" />
              <h2 className="heading-md text-foreground">{s.title}</h2>
              <p className="text-body text-muted-foreground mt-4">{s.desc}</p>
            </div>
          </div>
        </div>
      </section>
    ))}

    <PromoBanner headline="Trusted by International Clients" image={serviceShipping} cta="Partner With Us" />
    <Footer />
  </div>
);

export default Services;
