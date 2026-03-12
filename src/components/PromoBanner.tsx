import { Link } from "react-router-dom";

interface PromoBannerProps {
  headline: string;
  image: string;
  cta?: string;
  link?: string;
}

const PromoBanner = ({ headline, image, cta = "Get Started", link = "/contact" }: PromoBannerProps) => (
  <section className="relative h-[400px] sm:h-[450px] overflow-hidden">
    <img src={image} alt={headline} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    <div className="gradient-overlay" />
    <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
      <div>
        <h2 className="heading-lg text-primary-foreground max-w-3xl mx-auto">{headline}</h2>
        <Link to={link} className="btn-primary mt-8 inline-flex">{cta}</Link>
      </div>
    </div>
  </section>
);

export default PromoBanner;
