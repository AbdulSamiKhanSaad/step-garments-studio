import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import ProductGallery from "@/components/ProductGallery";
import { Link } from "react-router-dom";
import productTshirts from "@/assets/product-tshirts.jpg";
import productHoodies from "@/assets/product-hoodies.jpg";
import productSportswear from "@/assets/product-sportswear.jpg";
import productDenim from "@/assets/product-denim.jpg";
import productJackets from "@/assets/product-jackets.jpg";
import productPolo from "@/assets/product-polo.jpg";
import serviceFabric from "@/assets/service-fabric.jpg";
import heroFactory from "@/assets/hero-factory.jpg";

// Gallery images
import galleryTshirts2 from "@/assets/gallery-tshirts-2.jpg";
import galleryTshirts3 from "@/assets/gallery-tshirts-3.jpg";
import galleryHoodies2 from "@/assets/gallery-hoodies-2.jpg";
import galleryHoodies3 from "@/assets/gallery-hoodies-3.jpg";
import gallerySportswear2 from "@/assets/gallery-sportswear-2.jpg";
import gallerySportswear3 from "@/assets/gallery-sportswear-3.jpg";
import galleryDenim2 from "@/assets/gallery-denim-2.jpg";
import galleryDenim3 from "@/assets/gallery-denim-3.jpg";
import galleryJackets2 from "@/assets/gallery-jackets-2.jpg";
import galleryJackets3 from "@/assets/gallery-jackets-3.jpg";
import galleryPolo2 from "@/assets/gallery-polo-2.jpg";
import galleryPolo3 from "@/assets/gallery-polo-3.jpg";
import galleryTracksuits2 from "@/assets/gallery-tracksuits-2.jpg";
import galleryUniforms2 from "@/assets/gallery-uniforms-2.jpg";
import galleryKidswear2 from "@/assets/gallery-kidswear-2.jpg";

const categories = [
  {
    name: "T-Shirts",
    image: productTshirts,
    gallery: [productTshirts, galleryTshirts2, galleryTshirts3],
    desc: "Premium custom t-shirts crafted from the finest cotton and blended fabrics. Perfect for streetwear, fashion brands, and promotional wear.",
    fabrics: ["100% Cotton", "Cotton/Polyester Blend", "Organic Cotton", "Tri-Blend", "Ring-Spun Cotton"],
    customization: ["Screen Printing", "DTG Printing", "Embroidery", "Custom Labels", "Custom Packaging"],
    moq: "200 pieces per style/color",
  },
  {
    name: "Hoodies & Sweatshirts",
    image: productHoodies,
    gallery: [productHoodies, galleryHoodies2, galleryHoodies3],
    desc: "High-quality hoodies and sweatshirts with premium fleece lining. Ideal for streetwear brands, athleisure lines, and corporate merchandise.",
    fabrics: ["French Terry", "Fleece", "Cotton/Polyester", "Organic Cotton Fleece", "Performance Blend"],
    customization: ["Embroidery", "Screen Print", "Puff Print", "Custom Zipper Pulls", "Woven Labels"],
    moq: "150 pieces per style/color",
  },
  {
    name: "Sportswear & Activewear",
    image: productSportswear,
    gallery: [productSportswear, gallerySportswear2, gallerySportswear3],
    desc: "Performance-driven sportswear and activewear engineered for comfort and durability. Moisture-wicking, breathable, and stylish.",
    fabrics: ["Dri-Fit Polyester", "Spandex Blend", "Nylon Mesh", "Compression Fabric", "Bamboo Blend"],
    customization: ["Sublimation Print", "Heat Transfer", "Reflective Details", "Custom Elastic Bands", "Performance Labels"],
    moq: "200 pieces per style/color",
  },
  {
    name: "Denim",
    image: productDenim,
    gallery: [productDenim, galleryDenim2, galleryDenim3],
    desc: "Premium denim jeans and jackets with expert washes, distressing, and finishing. From raw selvedge to stretch denim.",
    fabrics: ["Raw Denim", "Stretch Denim", "Selvedge", "Organic Denim", "Recycled Denim"],
    customization: ["Custom Washes", "Distressing", "Embroidery", "Leather Patches", "Custom Rivets"],
    moq: "300 pieces per style/color",
  },
  {
    name: "Jackets & Outerwear",
    image: productJackets,
    gallery: [productJackets, galleryJackets2, galleryJackets3],
    desc: "From bomber jackets to windbreakers, we manufacture premium outerwear with expert construction and finishing.",
    fabrics: ["Nylon", "Polyester Shell", "Cotton Canvas", "Faux Leather", "Waterproof Membrane"],
    customization: ["Embroidery", "Patches", "Custom Lining", "Custom Zippers", "Branded Snaps"],
    moq: "100 pieces per style/color",
  },
  {
    name: "Polo Shirts",
    image: productPolo,
    gallery: [productPolo, galleryPolo2, galleryPolo3],
    desc: "Classic and modern polo shirts for corporate wear, golf brands, and fashion labels. Premium piqué and performance fabrics.",
    fabrics: ["Piqué Cotton", "Performance Polyester", "Cotton/Lycra", "Organic Cotton", "CoolMax"],
    customization: ["Embroidery", "Tipping Customization", "Custom Buttons", "Woven Labels", "Tone-on-Tone Print"],
    moq: "200 pieces per style/color",
  },
  {
    name: "Tracksuits",
    image: productSportswear,
    gallery: [productSportswear, galleryTracksuits2, gallerySportswear2],
    desc: "Complete tracksuit sets with matching jackets and pants. Perfect for athletic brands, streetwear, and corporate teams.",
    fabrics: ["French Terry", "Tricot", "Velour", "Performance Blend", "Cotton Fleece"],
    customization: ["Embroidery", "Screen Print", "Custom Piping", "Custom Zipper Pulls", "Side Stripe Options"],
    moq: "150 sets per style/color",
  },
  {
    name: "Corporate Uniforms",
    image: productPolo,
    gallery: [productPolo, galleryUniforms2, galleryPolo2],
    desc: "Professional uniforms for hospitality, healthcare, corporate, and industrial sectors. Durable, comfortable, and brand-aligned.",
    fabrics: ["Poly/Cotton Twill", "Performance Polyester", "Stretch Poplin", "Wrinkle-Free Blend", "Antimicrobial Fabric"],
    customization: ["Logo Embroidery", "Name Tags", "Custom Pockets", "Reflective Strips", "Department Color Coding"],
    moq: "100 pieces per style/color",
  },
  {
    name: "Kids Wear",
    image: productTshirts,
    gallery: [productTshirts, galleryKidswear2, galleryTshirts2],
    desc: "Safe, comfortable, and stylish children's clothing. All fabrics meet international safety standards for children's garments.",
    fabrics: ["100% Organic Cotton", "BCI Cotton", "Bamboo Blend", "Hypoallergenic Polyester", "Soft Jersey"],
    customization: ["Screen Print", "Appliqué", "Embroidery", "Custom Labels", "Snap Buttons"],
    moq: "300 pieces per style/color",
  },
];

const Products = () => (
  <div className="min-h-screen">
    <Navbar />
    {/* Hero */}
    <section className="relative h-[400px] sm:h-[500px] overflow-hidden">
      <img src={heroFactory} alt="Products" className="absolute inset-0 w-full h-full object-cover" />
      <div className="gradient-overlay" />
      <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
        <div>
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Our Products</p>
          <h1 className="heading-xl text-primary-foreground">Premium Apparel Categories</h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Manufacturing excellence across every garment category for brands worldwide.
          </p>
        </div>
      </div>
    </section>

    {/* Product Categories */}
    {categories.map((cat, i) => (
      <section key={cat.name} className={`section-padding ${i % 2 === 0 ? "bg-background" : "bg-secondary"}`}>
        <div className="container-max">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}>
            <div className={`${i % 2 !== 0 ? "lg:order-2" : ""}`}>
              <img src={cat.image} alt={cat.name} className="w-full rounded-lg shadow-xl aspect-square object-cover" loading="lazy" />
              <ProductGallery images={cat.gallery} name={cat.name} />
            </div>
            <div className={`${i % 2 !== 0 ? "lg:order-1" : ""}`}>
              <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">Category</p>
              <h2 className="heading-md text-foreground">{cat.name}</h2>
              <p className="text-body text-muted-foreground mt-4">{cat.desc}</p>

              <div className="mt-6">
                <h4 className="font-heading font-semibold text-sm uppercase tracking-wide text-foreground mb-2">Fabric Options</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.fabrics.map((f) => (
                    <span key={f} className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">{f}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-heading font-semibold text-sm uppercase tracking-wide text-foreground mb-2">Customization</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.customization.map((c) => (
                    <span key={c} className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-6 text-sm">
                <div>
                  <span className="font-semibold text-foreground">MOQ: </span>
                  <span className="text-muted-foreground">{cat.moq}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">Export: </span>
                  <span className="text-muted-foreground">Worldwide</span>
                </div>
              </div>

              <Link to="/contact" className="btn-primary mt-6">Request Quote</Link>
            </div>
          </div>
        </div>
      </section>
    ))}

    <PromoBanner headline="Scalable Production for High-Volume Orders" image={serviceFabric} cta="Contact Us" />
    <Footer />
  </div>
);

export default Products;
