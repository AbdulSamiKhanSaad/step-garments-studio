import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import heroFactory from "@/assets/hero-factory.jpg";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative h-[350px] sm:h-[400px] overflow-hidden">
        <img src={heroFactory} alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="gradient-overlay" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <div>
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</p>
            <h1 className="heading-xl text-primary-foreground">Contact Us</h1>
            <p className="mt-4 text-primary-foreground/80 text-lg">Let's discuss your next garment production project.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="heading-md text-foreground mb-6">Get a Free Quote</h3>
                <p className="text-body text-muted-foreground">
                  Ready to start manufacturing? Contact us today for a free quote and consultation.
                </p>
              </div>
              {[
                { icon: Mail, label: "Email", value: "info@stepgarments.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Location", value: "Global Operations Center" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">{label}</p>
                    <p className="text-muted-foreground text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-accent/10 mb-4">
                    <Send className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="heading-md text-foreground">Thank You!</h3>
                  <p className="text-muted-foreground mt-2">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                      <input type="text" required className="w-full px-4 py-3 bg-background border border-input rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                      <input type="email" required className="w-full px-4 py-3 bg-background border border-input rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                      <input type="text" className="w-full px-4 py-3 bg-background border border-input rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Product Interest</label>
                      <select className="w-full px-4 py-3 bg-background border border-input rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent">
                        <option>T-Shirts</option>
                        <option>Hoodies</option>
                        <option>Sportswear</option>
                        <option>Denim</option>
                        <option>Jackets</option>
                        <option>Polo Shirts</option>
                        <option>Corporate Uniforms</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Estimated Quantity</label>
                    <input type="text" placeholder="e.g., 500 pieces" className="w-full px-4 py-3 bg-background border border-input rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <textarea required rows={5} className="w-full px-4 py-3 bg-background border border-input rounded-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full sm:w-auto">Send Inquiry</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
