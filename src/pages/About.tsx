import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import heroFactory from "@/assets/hero-factory.jpg";
import serviceFabric from "@/assets/service-fabric.jpg";
import { Award, Globe2, Factory, Users, Leaf, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Years of Craft", value: "20+" },
  { label: "Countries Served", value: "35+" },
  { label: "Monthly Capacity", value: "500K+" },
  { label: "Skilled Artisans", value: "400+" },
];

const values = [
  { icon: Award, title: "Uncompromising Quality", desc: "Every stitch inspected. Every fabric tested. Delivered to global standards." },
  { icon: Globe2, title: "Worldwide Reach", desc: "Trusted by emerging brands and established houses across 35+ countries." },
  { icon: Factory, title: "Vertically Integrated", desc: "From yarn sourcing to final packing — one roof, one accountable partner." },
  { icon: Users, title: "Partner Mindset", desc: "We build long-term relationships, not one-off transactions." },
  { icon: Leaf, title: "Responsible Manufacturing", desc: "OEKO-TEX certified fabrics, ethical labor, and reduced-impact processes." },
  { icon: ShieldCheck, title: "Compliance First", desc: "SEDEX, BSCI and WRAP audited facilities — verified end to end." },
];

const About = () => (
  <div className="min-h-screen">
    <Navbar />

    <section className="relative h-[380px] sm:h-[460px] overflow-hidden">
      <img src={heroFactory} alt="Step Garments manufacturing facility" className="absolute inset-0 w-full h-full object-cover" />
      <div className="gradient-overlay" />
      <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
        <div>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">About Us</p>
          <h1 className="heading-xl text-primary-foreground">Crafting Apparel. Building Brands.</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            A global end-to-end apparel manufacturing partner for the world's most ambitious labels.
          </p>
        </div>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="container-max grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Our Story</p>
          <h2 className="heading-lg text-foreground mb-6">Two Decades of Textile Excellence</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Step Garments was founded on a simple belief — that world-class apparel manufacturing should be accessible to any brand with a vision, whether a first-season startup or an established global label.
            </p>
            <p>
              Headquartered in Sialkot, Pakistan's textile heartland, our vertically integrated facility handles every step in-house: fabric sourcing, pattern making, cutting, stitching, finishing, and export. That control is why our clients trust us with launches that can't miss.
            </p>
            <p>
              Today we manufacture across 20+ garment categories for 35+ countries — from streetwear drops to corporate uniforms, technical sportswear to premium denim. One partner. Full accountability.
            </p>
          </div>
        </div>
        <div className="relative">
          <img src={serviceFabric} alt="Premium fabric being crafted" className="rounded-lg shadow-xl w-full h-auto object-cover" />
          <div className="absolute -bottom-6 -left-6 bg-navy text-primary-foreground p-6 rounded-lg shadow-2xl hidden sm:block">
            <p className="text-accent text-xs font-semibold uppercase tracking-widest">Est.</p>
            <p className="font-heading text-3xl font-bold">2005</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-navy text-primary-foreground py-16">
      <div className="container-max grid grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-heading text-4xl sm:text-5xl font-bold text-accent">{s.value}</p>
            <p className="mt-2 text-sm text-primary-foreground/70 uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="section-padding bg-secondary">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">What We Stand For</p>
          <h2 className="heading-lg text-foreground">The Values Behind Every Stitch</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="container-max grid lg:grid-cols-2 gap-12">
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Our Mission</h3>
          <p className="text-muted-foreground leading-relaxed">
            To be the manufacturing backbone brands can build on — delivering premium apparel at scale, with the reliability, transparency, and craftsmanship every modern label deserves.
          </p>
        </div>
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-3">Our Vision</h3>
          <p className="text-muted-foreground leading-relaxed">
            To redefine global garment manufacturing — proving that quality, ethics, and speed are not trade-offs, but standards.
          </p>
        </div>
      </div>
    </section>

    <PromoBanner headline="Let's Build Your Next Collection" image={serviceFabric} cta="Start a Conversation" />
    <Footer />
  </div>
);

export default About;
