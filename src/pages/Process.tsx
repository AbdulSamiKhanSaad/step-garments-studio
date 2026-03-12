import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import { MessageSquare, PenTool, Layers, Factory, Search, Package, Globe } from "lucide-react";
import heroFactory from "@/assets/hero-factory.jpg";
import serviceShipping from "@/assets/service-shipping.jpg";

const steps = [
  { icon: MessageSquare, title: "Consultation", desc: "We discuss your brand vision, product requirements, target market, and timeline. Our team provides expert guidance from day one." },
  { icon: PenTool, title: "Design & Sampling", desc: "Our design team develops patterns and creates initial samples. Iterate until the fit, fabric, and finish are perfect." },
  { icon: Layers, title: "Fabric Selection", desc: "Choose from our extensive fabric library or source custom materials. We ensure quality, consistency, and compliance." },
  { icon: Factory, title: "Production", desc: "State-of-the-art manufacturing with skilled workers. Real-time production updates and transparent communication." },
  { icon: Search, title: "Quality Control", desc: "Multi-stage inspection process. Every garment is checked for stitching, measurements, color consistency, and finishing." },
  { icon: Package, title: "Packaging", desc: "Custom branded packaging including polybags, hang tags, care labels, tissue paper, and carton packing." },
  { icon: Globe, title: "Worldwide Delivery", desc: "Global shipping via air, sea, or express. Full documentation, customs support, and delivery tracking." },
];

const Process = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="relative h-[400px] sm:h-[500px] overflow-hidden">
      <img src={heroFactory} alt="Process" className="absolute inset-0 w-full h-full object-cover" />
      <div className="gradient-overlay" />
      <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
        <div>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">How We Work</p>
          <h1 className="heading-xl text-primary-foreground">Our Manufacturing Process</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            A streamlined 7-step process designed for quality, efficiency, and transparency.
          </p>
        </div>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="container-max">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />
          <div className="space-y-16">
            {steps.map((step, i) => (
              <div key={step.title} className="relative flex items-start gap-8">
                {/* Step number circle */}
                <div className="hidden lg:flex w-16 h-16 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-heading font-bold text-lg z-10">
                  {i + 1}
                </div>
                <div className="flex-1 bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-accent text-accent-foreground font-heading font-bold text-sm">
                      {i + 1}
                    </div>
                    <step.icon className="w-8 h-8 text-accent" />
                    <h3 className="heading-md text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-body text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <PromoBanner headline="From Idea to Global Delivery" image={serviceShipping} cta="Get Started" />
    <Footer />
  </div>
);

export default Process;
