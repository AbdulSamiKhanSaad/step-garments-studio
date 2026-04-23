import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, AtSign, Music2 } from "lucide-react";

const SOCIALS = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/stepgarments",
  },
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/stepgarments",
  },
  {
    name: "Threads",
    icon: AtSign,
    href: "https://www.threads.net/@stepgarments",
  },
  {
    name: "TikTok",
    icon: Music2,
    href: "https://www.tiktok.com/@stepgarments",
  },
];

const Footer = () => (
  <footer className="bg-navy text-primary-foreground">
    <div className="container-max section-padding">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <h3 className="font-heading text-2xl font-bold mb-4">
            STEP <span className="text-accent">GARMENTS</span>
          </h3>
          <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
            Full-scale apparel manufacturing company providing end-to-end garment production services worldwide.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ name, icon: Icon, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow Step Garments on ${name}`}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-accent hover:scale-110 active:scale-95 flex items-center justify-center transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[{ l: "Home", p: "/" }, { l: "Products", p: "/products" }, { l: "Services", p: "/services" }, { l: "Process", p: "/process" }, { l: "Contact", p: "/contact" }].map((item) => (
              <Link key={item.p} to={item.p} className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">{item.l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4">Products</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            {["T-Shirts", "Hoodies", "Sportswear", "Denim", "Jackets", "Polo Shirts"].map((p) => (
              <Link key={p} to="/products" className="hover:text-accent transition-colors">{p}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold text-lg mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <div className="flex items-center gap-2"><Mail size={16} className="text-accent" /> stepgarments@gmail.com</div>
            <div className="flex items-center gap-2"><Phone size={16} className="text-accent" /> +92 (332) 855-6537</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-accent" /> Sialkot, Punjab, PK 51310</div>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} Step Garments. All rights reserved. | Premium Apparel Manufacturing Worldwide
      </div>
    </div>
  </footer>
);

export default Footer;
