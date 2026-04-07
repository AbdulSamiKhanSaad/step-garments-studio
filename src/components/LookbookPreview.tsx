import { Link } from "react-router-dom";
import { Camera, ArrowRight } from "lucide-react";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";
import lookbook6 from "@/assets/lookbook-6.jpg";
import lookbook7 from "@/assets/lookbook-7.jpg";

const previews = [
  { src: lookbook1, title: "Classic Essentials" },
  { src: lookbook3, title: "Outerwear" },
  { src: lookbook6, title: "Smart Casual" },
  { src: lookbook7, title: "Athleisure" },
];

const LookbookPreview = () => (
  <section className="section-padding bg-secondary overflow-hidden">
    <div className="container-max">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-5 h-5 text-accent" />
            <span className="text-accent font-heading font-bold text-sm uppercase tracking-wider">Editorial</span>
          </div>
          <h2 className="heading-lg text-foreground">Lookbook</h2>
          <p className="text-muted-foreground mt-2 max-w-lg">
            See our garments styled by professional photographers and fashion editors
          </p>
        </div>
        <Link to="/lookbook" className="btn-outline text-sm flex items-center gap-2 shrink-0">
          View Full Lookbook <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {previews.map((p, i) => (
          <Link
            key={p.title}
            to="/lookbook"
            className="group relative overflow-hidden rounded-xl aspect-[3/4]"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <img
              src={p.src}
              alt={p.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-heading text-base font-bold text-primary-foreground group-hover:text-accent transition-colors">
                {p.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default LookbookPreview;
