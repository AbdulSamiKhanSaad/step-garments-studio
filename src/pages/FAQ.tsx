import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Clock, Truck, CreditCard, Ruler, Shield, Globe } from "lucide-react";

const faqCategories = [
  {
    title: "Ordering & MOQ",
    icon: Ruler,
    items: [
      { q: "What is the Minimum Order Quantity (MOQ)?", a: "Our MOQ varies by product category. T-shirts and polo shirts start at 200 pieces, hoodies and tracksuits at 150 pieces, jackets at 100 pieces, and denim at 300 pieces. Contact us for custom quantities." },
      { q: "Can I order samples before placing a bulk order?", a: "Absolutely! We offer a pre-production sample service. You can request samples through your dashboard under 'Samples'. Sample costs are typically deducted from your bulk order." },
      { q: "How do I submit a tech pack?", a: "You can upload your tech packs (PDF, AI, or ZIP files) directly through your customer dashboard under the 'Files' section, or share them with your account manager." },
      { q: "Can I mix sizes and colors within one order?", a: "Yes, you can mix sizes and colors within the same order. We provide a size/color breakdown form during the ordering process to specify your exact requirements." },
    ],
  },
  {
    title: "Lead Times & Production",
    icon: Clock,
    items: [
      { q: "What are the typical lead times?", a: "Standard production lead time is 4–6 weeks after sample approval. This includes fabric sourcing, cutting, sewing, finishing, and quality checks. Rush orders (2–3 weeks) are available at an additional charge." },
      { q: "Can I track my order during production?", a: "Yes! Our customer dashboard provides real-time production tracking. You'll see updates at every stage: sampling, production, quality check, and shipping." },
      { q: "What happens if there's a delay?", a: "We proactively communicate any delays. Our team will notify you immediately with revised timelines and work to minimize impact on your schedule." },
      { q: "Do you offer rush production?", a: "Yes, rush production is available for most product categories. Lead times can be reduced to 2–3 weeks depending on complexity and current capacity. Additional fees apply." },
    ],
  },
  {
    title: "Shipping & Delivery",
    icon: Truck,
    items: [
      { q: "Which shipping methods do you offer?", a: "We offer sea freight (most economical, 20–35 days), air freight (fastest, 5–7 days), and courier services (DHL/FedEx/UPS for smaller orders). We handle all export documentation." },
      { q: "Do you ship internationally?", a: "Yes, we ship worldwide. We have experience exporting to the USA, UK, Europe, Australia, Middle East, and Africa. All customs and compliance documentation is handled by our logistics team." },
      { q: "Who pays for shipping?", a: "Shipping costs are typically borne by the buyer. We provide FOB, CIF, and DDP pricing options. Our logistics team will provide competitive shipping quotes before you place your order." },
      { q: "How is packaging handled?", a: "Standard packaging includes individual polybag packaging with size stickers, packed in export-quality cartons. Custom packaging (hang tags, tissue paper, branded boxes) is available on request." },
    ],
  },
  {
    title: "Payment Terms",
    icon: CreditCard,
    items: [
      { q: "What payment methods do you accept?", a: "We accept bank wire transfers (T/T), PayPal for smaller orders, and Letters of Credit (L/C) for large orders. We can also discuss flexible payment arrangements for long-term partners." },
      { q: "What are your standard payment terms?", a: "Standard terms are 50% deposit upon order confirmation and 50% balance before shipping. For established clients, we offer 30/70 or NET 30 terms on a case-by-case basis." },
      { q: "Do you provide invoices?", a: "Yes, professional invoices are generated for every order and accessible through your customer dashboard. We provide proforma invoices, commercial invoices, and packing lists." },
      { q: "Is there a deposit required for samples?", a: "Yes, sample costs range from $30–$100 depending on complexity. This is fully refundable or deducted from your first bulk order." },
    ],
  },
  {
    title: "Quality & Compliance",
    icon: Shield,
    items: [
      { q: "What quality standards do you follow?", a: "We follow ISO 9001 quality management standards. All garments undergo AQL 2.5 inspection. We also comply with OEKO-TEX, GOTS (for organic), and BSCI social compliance standards." },
      { q: "Do you offer quality inspection reports?", a: "Yes, every order includes a detailed QC report with photos. We conduct inline inspections, pre-final inspections, and final random inspections before shipping." },
      { q: "What if I receive defective products?", a: "We stand behind our quality. If defects are found upon delivery, we will replace the defective units or provide a credit for your next order. Claims must be filed within 14 days of receipt." },
      { q: "Are your fabrics tested for safety?", a: "Yes, all fabrics are tested for colorfastness, shrinkage, pilling, and tensile strength. For children's wear, we ensure full compliance with CPSIA and EN 14682 safety regulations." },
    ],
  },
  {
    title: "Customization & Design",
    icon: Globe,
    items: [
      { q: "What customization options are available?", a: "We offer screen printing, DTG printing, embroidery, sublimation, puff print, patches, custom labels, hang tags, custom zippers, and more. Our design team can help with artwork preparation." },
      { q: "Can you help design from scratch?", a: "Yes! Our in-house design team can work from your concept sketches, mood boards, or references. We also offer a free online Design Studio tool in the customer dashboard." },
      { q: "Do you offer private labeling?", a: "Absolutely. We provide full private label services including woven labels, printed labels, hang tags, custom packaging, and all branding elements to make the garments truly yours." },
      { q: "Can I see a mockup before production?", a: "Yes, we create digital mockups and tech packs for your approval before any production begins. You can also use our Design Studio to visualize your designs on product mockups." },
    ],
  },
];

const FAQ = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="relative pt-32 sm:pt-40 pb-16 bg-gradient-to-b from-navy to-navy-light overflow-hidden">
      <div className="container-max text-center px-4">
        <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </div>
        <h1 className="heading-xl text-primary-foreground">How Can We Help?</h1>
        <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
          Find answers to common questions about our manufacturing process, lead times, shipping, and payment terms.
        </p>
      </div>
    </section>

    {/* FAQ Grid */}
    <section className="section-padding bg-background">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {faqCategories.map((cat) => (
            <div key={cat.title} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-accent" />
                </div>
                <h2 className="font-heading text-lg font-bold text-foreground">{cat.title}</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {cat.items.map((item, i) => (
                  <AccordionItem key={i} value={`${cat.title}-${i}`}>
                    <AccordionTrigger className="text-sm text-left font-medium text-foreground hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8">
          <h3 className="font-heading text-xl font-bold text-foreground mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">Our team is here to help. Reach out and we'll get back to you within 24 hours.</p>
          <a href="/contact" className="btn-primary text-sm py-3">Contact Us</a>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default FAQ;
