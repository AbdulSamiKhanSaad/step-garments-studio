import { Link } from "react-router-dom";
import productTshirts from "@/assets/product-tshirts.jpg";
import productHoodies from "@/assets/product-hoodies.jpg";
import productSportswear from "@/assets/product-sportswear.jpg";
import productDenim from "@/assets/product-denim.jpg";
import productJackets from "@/assets/product-jackets.jpg";
import productPolo from "@/assets/product-polo.jpg";
import productTrousers from "@/assets/product-trousers.jpg";
import productShorts from "@/assets/product-shorts.jpg";
import productCaps from "@/assets/product-caps.jpg";
import productPuffer from "@/assets/product-puffer.jpg";
import productLeggings from "@/assets/product-leggings.jpg";
import productSwimwear from "@/assets/product-swimwear.jpg";

const products = [
  { name: "T-Shirts", image: productTshirts },
  { name: "Hoodies", image: productHoodies },
  { name: "Sportswear", image: productSportswear },
  { name: "Denim", image: productDenim },
  { name: "Jackets", image: productJackets },
  { name: "Polo Shirts", image: productPolo },
  { name: "Trousers", image: productTrousers },
  { name: "Shorts", image: productShorts },
  { name: "Caps & Hats", image: productCaps },
  { name: "Puffer Jackets", image: productPuffer },
  { name: "Leggings", image: productLeggings },
  { name: "Swimwear", image: productSwimwear },
];

const ProductsPreview = () => (
  <section className="section-padding">
    <div className="container-max">
      <div className="text-center mb-16">
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Our Products</p>
        <h2 className="heading-lg text-foreground">Premium Apparel Categories</h2>
        <p className="text-body text-muted-foreground mt-4 max-w-2xl mx-auto">
          We manufacture a wide range of garments for every market segment.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((p, i) => (
          <Link
            to="/products"
            key={p.name}
            className="group relative overflow-hidden rounded-xl aspect-square animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent group-hover:from-foreground/90 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform group-hover:translate-y-[-4px] transition-transform duration-300">
              <h3 className="font-heading text-lg font-bold text-primary-foreground">{p.name}</h3>
              <span className="text-sm text-accent mt-1 inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300">View Collection →</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link to="/products" className="btn-primary">View All Products</Link>
      </div>
    </div>
  </section>
);

export default ProductsPreview;
