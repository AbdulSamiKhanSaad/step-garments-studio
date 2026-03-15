import { Link } from "react-router-dom";
import { Paintbrush, Palette, Type, Upload, RotateCw, Download } from "lucide-react";
import mockupTshirt from "@/assets/mockup-tshirt.png";
import mockupHoodie from "@/assets/mockup-hoodie.png";
import mockupJacket from "@/assets/mockup-jacket.png";

const features = [
  { icon: Upload, label: "Upload Logo" },
  { icon: Type, label: "Add Text" },
  { icon: Palette, label: "Change Colors" },
  { icon: RotateCw, label: "Rotate & Resize" },
  { icon: Download, label: "Export PNG/PDF" },
];

const DesignStudioCTA = () => (
  <section className="py-20 bg-navy relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
    </div>

    <div className="container-max px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left - Text */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Paintbrush className="w-6 h-6 text-accent" />
            <span className="text-accent font-heading font-bold text-sm uppercase tracking-wider">Design Studio</span>
          </div>
          <h2 className="heading-lg text-primary-foreground mb-4">
            Design Your Garments <span className="text-accent">Online</span>
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-6 max-w-lg">
            Use our interactive Design Studio to create custom garment designs. Upload your logo, add text, 
            choose colors, and see your design rendered on real product mockups in real time.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-primary-foreground/80">
                <f.icon className="w-4 h-4 text-accent flex-shrink-0" />
                <span className="text-sm">{f.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard/design" className="btn-primary text-base py-3 px-8">
              Open Design Studio
            </Link>
            <Link to="/dashboard/factory" className="btn-white text-base py-3 px-8">
              Factory Tour
            </Link>
          </div>
        </div>

        {/* Right - Mockup preview */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-4">
            {[
              { src: mockupTshirt, label: "T-Shirt" },
              { src: mockupHoodie, label: "Hoodie" },
              { src: mockupJacket, label: "Jacket" },
            ].map((item, i) => (
              <Link
                key={item.label}
                to="/dashboard/design"
                className="group relative bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl p-4 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="aspect-square flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <p className="text-center text-primary-foreground/80 text-sm font-medium mt-3 group-hover:text-accent transition-colors">
                  {item.label}
                </p>
              </Link>
            ))}
          </div>
          <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-heading font-bold text-sm shadow-lg">
            Free to Use ✨
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default DesignStudioCTA;
