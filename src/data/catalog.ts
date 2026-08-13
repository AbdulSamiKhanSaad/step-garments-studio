import productTshirts from "@/assets/product-tshirts.jpg";
import productHoodies from "@/assets/product-hoodies.jpg";
import productSportswear from "@/assets/product-sportswear.jpg";
import productDenim from "@/assets/product-denim.jpg";
import productJackets from "@/assets/product-jackets.jpg";
import productPolo from "@/assets/product-polo.jpg";
import productTracksuits from "@/assets/product-tracksuits.jpg";
import productStreetwear from "@/assets/product-streetwear.jpg";
import productTrousers from "@/assets/product-trousers.jpg";
import productShorts from "@/assets/product-shorts.jpg";
import productTanktops from "@/assets/product-tanktops.jpg";
import productJoggers from "@/assets/product-joggers.jpg";
import productDressshirts from "@/assets/product-dressshirts.jpg";
import productPuffer from "@/assets/product-puffer.jpg";
import productCargopants from "@/assets/product-cargopants.jpg";
import productSwimwear from "@/assets/product-swimwear.jpg";
import productLeggings from "@/assets/product-leggings.jpg";
import productCaps from "@/assets/product-caps.jpg";
import serviceFabric from "@/assets/service-fabric.jpg";
import heroFactory from "@/assets/hero-factory.jpg";

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
import galleryTrousers2 from "@/assets/gallery-trousers-2.jpg";
import galleryTrousers3 from "@/assets/gallery-trousers-3.jpg";
import galleryShorts2 from "@/assets/gallery-shorts-2.jpg";
import galleryShorts3 from "@/assets/gallery-shorts-3.jpg";
import galleryTanktops2 from "@/assets/gallery-tanktops-2.jpg";
import galleryTanktops3 from "@/assets/gallery-tanktops-3.jpg";
import galleryJoggers2 from "@/assets/gallery-joggers-2.jpg";
import galleryJoggers3 from "@/assets/gallery-joggers-3.jpg";
import galleryDressshirts2 from "@/assets/gallery-dressshirts-2.jpg";
import galleryDressshirts3 from "@/assets/gallery-dressshirts-3.jpg";
import galleryPuffer2 from "@/assets/gallery-puffer-2.jpg";
import galleryPuffer3 from "@/assets/gallery-puffer-3.jpg";
import galleryCargopants2 from "@/assets/gallery-cargopants-2.jpg";
import galleryCargopants3 from "@/assets/gallery-cargopants-3.jpg";
import gallerySwimwear2 from "@/assets/gallery-swimwear-2.jpg";
import gallerySwimwear3 from "@/assets/gallery-swimwear-3.jpg";
import galleryLeggings2 from "@/assets/gallery-leggings-2.jpg";
import galleryLeggings3 from "@/assets/gallery-leggings-3.jpg";
import galleryCaps2 from "@/assets/gallery-caps-2.jpg";
import galleryCaps3 from "@/assets/gallery-caps-3.jpg";

export type CatalogItem = {
  id: string;
  category_slug: string;
  name: string;
  description: string;
  image: string;
  gallery: string[];
  fabrics: string[];
  moq: string;
  featured?: boolean;
  source: "seed" | "admin";
};

export const CATEGORIES = [
  { slug: "tshirts", name: "T-Shirts" },
  { slug: "hoodies", name: "Hoodies" },
  { slug: "tracksuits", name: "Tracksuits" },
  { slug: "jackets", name: "Jackets" },
  { slug: "sportswear", name: "Sportswear" },
  { slug: "streetwear", name: "Streetwear" },
  { slug: "denim", name: "Denim" },
  { slug: "polo", name: "Polo Shirts" },
  { slug: "uniforms", name: "Uniforms" },
  { slug: "kidswear", name: "Kids Wear" },
  { slug: "trousers", name: "Trousers" },
  { slug: "shorts", name: "Shorts" },
  { slug: "tanktops", name: "Tank Tops" },
  { slug: "joggers", name: "Joggers" },
  { slug: "dressshirts", name: "Dress Shirts" },
  { slug: "puffer", name: "Puffer" },
  { slug: "cargopants", name: "Cargo Pants" },
  { slug: "swimwear", name: "Swimwear" },
  { slug: "leggings", name: "Leggings" },
  { slug: "caps", name: "Caps & Hats" },
];

export const SEED: CatalogItem[] = [
  { id: "seed-tshirts", category_slug: "tshirts", name: "Premium T-Shirts", image: productTshirts, gallery: [productTshirts, galleryTshirts2, galleryTshirts3], description: "Custom t-shirts crafted from the finest cotton and blended fabrics. Perfect for streetwear, fashion brands, and promotional wear.", fabrics: ["100% Cotton", "Cotton/Poly Blend", "Organic Cotton", "Tri-Blend"], moq: "200 pcs", source: "seed" },
  { id: "seed-hoodies", category_slug: "hoodies", name: "Hoodies & Sweatshirts", image: productHoodies, gallery: [productHoodies, galleryHoodies2, galleryHoodies3], description: "High-quality hoodies with premium fleece lining. Ideal for streetwear brands, athleisure lines, and corporate merchandise.", fabrics: ["French Terry", "Fleece", "Cotton/Polyester", "Organic Cotton Fleece"], moq: "150 pcs", source: "seed" },
  { id: "seed-tracksuits", category_slug: "tracksuits", name: "Tracksuits", image: productTracksuits, gallery: [productTracksuits, galleryTracksuits2, gallerySportswear2], description: "Complete tracksuit sets with matching jackets and pants. Perfect for athletic brands, streetwear, and corporate teams.", fabrics: ["French Terry", "Tricot", "Velour", "Performance Blend"], moq: "150 sets", source: "seed" },
  { id: "seed-jackets", category_slug: "jackets", name: "Jackets & Outerwear", image: productJackets, gallery: [productJackets, galleryJackets2, galleryJackets3], description: "From bomber jackets to windbreakers, premium outerwear with expert construction and finishing.", fabrics: ["Nylon", "Polyester Shell", "Cotton Canvas", "Faux Leather"], moq: "100 pcs", source: "seed" },
  { id: "seed-sportswear", category_slug: "sportswear", name: "Sportswear & Activewear", image: productSportswear, gallery: [productSportswear, gallerySportswear2, gallerySportswear3], description: "Performance-driven sportswear engineered for comfort and durability. Moisture-wicking, breathable, and stylish.", fabrics: ["Dri-Fit Polyester", "Spandex Blend", "Nylon Mesh", "Compression Fabric"], moq: "200 pcs", source: "seed" },
  { id: "seed-streetwear", category_slug: "streetwear", name: "Streetwear Collection", image: productStreetwear, gallery: [productStreetwear, galleryHoodies2, galleryTshirts2], description: "Bold, trend-forward streetwear for urban fashion brands. Oversized fits, premium fabrics, and statement designs.", fabrics: ["Heavy Cotton", "French Terry", "Distressed Denim", "Washed Fleece"], moq: "200 pcs", source: "seed" },
  { id: "seed-denim", category_slug: "denim", name: "Premium Denim", image: productDenim, gallery: [productDenim, galleryDenim2, galleryDenim3], description: "Premium denim jeans and jackets with expert washes, distressing, and finishing.", fabrics: ["Raw Denim", "Stretch Denim", "Selvedge", "Organic Denim"], moq: "300 pcs", source: "seed" },
  { id: "seed-polo", category_slug: "polo", name: "Polo Shirts", image: productPolo, gallery: [productPolo, galleryPolo2, galleryPolo3], description: "Classic and modern polo shirts for corporate wear, golf brands, and fashion labels.", fabrics: ["Piqué Cotton", "Performance Polyester", "Cotton/Lycra", "CoolMax"], moq: "200 pcs", source: "seed" },
  { id: "seed-uniforms", category_slug: "uniforms", name: "Corporate Uniforms", image: productPolo, gallery: [productPolo, galleryUniforms2, galleryPolo2], description: "Professional uniforms for hospitality, healthcare, corporate, and industrial sectors.", fabrics: ["Poly/Cotton Twill", "Performance Polyester", "Stretch Poplin", "Antimicrobial"], moq: "100 pcs", source: "seed" },
  { id: "seed-kidswear", category_slug: "kidswear", name: "Kids Wear", image: productTshirts, gallery: [productTshirts, galleryKidswear2, galleryTshirts2], description: "Safe, comfortable, and stylish children's clothing. All fabrics meet international safety standards.", fabrics: ["100% Organic Cotton", "BCI Cotton", "Bamboo Blend", "Soft Jersey"], moq: "300 pcs", source: "seed" },
  { id: "seed-trousers", category_slug: "trousers", name: "Trousers & Chinos", image: productTrousers, gallery: [productTrousers, galleryTrousers2, galleryTrousers3], description: "Premium cargo pants, chinos, and casual trousers. Crafted for durability with modern fits.", fabrics: ["Cotton Twill", "Stretch Cotton", "Canvas", "Ripstop"], moq: "200 pcs", source: "seed" },
  { id: "seed-shorts", category_slug: "shorts", name: "Shorts & Board Shorts", image: productShorts, gallery: [productShorts, galleryShorts2, galleryShorts3], description: "Athletic shorts, swim trunks, and casual board shorts. Performance fabrics with quick-dry technology.", fabrics: ["Polyester Mesh", "Nylon Taslan", "Stretch Woven", "Quick-Dry Blend"], moq: "200 pcs", source: "seed" },
  { id: "seed-tanktops", category_slug: "tanktops", name: "Tank Tops & Vests", image: productTanktops, gallery: [productTanktops, galleryTanktops2, galleryTanktops3], description: "Gym tanks, fashion vests, and performance sleeveless tops. Breathable and lightweight.", fabrics: ["Cotton Jersey", "Performance Mesh", "Bamboo Blend", "Dri-Fit"], moq: "200 pcs", source: "seed" },
  { id: "seed-joggers", category_slug: "joggers", name: "Joggers & Sweatpants", image: productJoggers, gallery: [productJoggers, galleryJoggers2, galleryJoggers3], description: "Premium joggers and sweatpants with fleece lining. Perfect for athleisure and streetwear.", fabrics: ["French Terry", "Fleece", "Tech Fleece", "Cotton/Polyester"], moq: "150 pcs", source: "seed" },
  { id: "seed-dressshirts", category_slug: "dressshirts", name: "Dress Shirts & Formal", image: productDressshirts, gallery: [productDressshirts, galleryDressshirts2, galleryDressshirts3], description: "Premium formal and business dress shirts. Expert tailoring with luxury fabrics and finishing.", fabrics: ["Egyptian Cotton", "Poplin", "Oxford Cloth", "Twill Weave"], moq: "150 pcs", source: "seed" },
  { id: "seed-puffer", category_slug: "puffer", name: "Puffer & Down Jackets", image: productPuffer, gallery: [productPuffer, galleryPuffer2, galleryPuffer3], description: "Insulated puffer jackets with premium fill. Perfect for winter collections and outdoor brands.", fabrics: ["Ripstop Nylon", "Recycled Polyester", "Down Fill", "Synthetic Insulation"], moq: "100 pcs", source: "seed" },
  { id: "seed-cargopants", category_slug: "cargopants", name: "Cargo Pants", image: productCargopants, gallery: [productCargopants, galleryCargopants2, galleryCargopants3], description: "Military-inspired cargo pants with functional pockets. Durable construction for workwear and fashion.", fabrics: ["Cotton Canvas", "Ripstop", "Stretch Twill", "Nylon Blend"], moq: "200 pcs", source: "seed" },
  { id: "seed-swimwear", category_slug: "swimwear", name: "Swimwear & Beachwear", image: productSwimwear, gallery: [productSwimwear, gallerySwimwear2, gallerySwimwear3], description: "Board shorts, swim trunks, and resort wear. Quick-dry fabrics with vibrant sublimation prints.", fabrics: ["Quick-Dry Polyester", "Recycled Nylon", "Spandex Blend", "Board Short Fabric"], moq: "200 pcs", source: "seed" },
  { id: "seed-leggings", category_slug: "leggings", name: "Leggings & Tights", image: productLeggings, gallery: [productLeggings, galleryLeggings2, galleryLeggings3], description: "High-performance compression leggings and yoga tights for fitness and athleisure brands.", fabrics: ["Spandex/Polyester", "Nylon Blend", "Compression Fabric", "Moisture-Wicking"], moq: "200 pcs", source: "seed" },
  { id: "seed-caps", category_slug: "caps", name: "Caps & Headwear", image: productCaps, gallery: [productCaps, galleryCaps2, galleryCaps3], description: "Snapbacks, dad hats, beanies, and bucket hats. Custom embroidery, patches, and branding.", fabrics: ["Cotton Twill", "Polyester Mesh", "Acrylic Knit", "Corduroy"], moq: "200 pcs", source: "seed" },
];

export const CATEGORY_FALLBACK: Record<string, string> = {
  tshirts: productTshirts, hoodies: productHoodies, tracksuits: productTracksuits, jackets: productJackets,
  sportswear: productSportswear, streetwear: productStreetwear, denim: productDenim, polo: productPolo,
  uniforms: productPolo, kidswear: productTshirts, trousers: productTrousers, shorts: productShorts,
  tanktops: productTanktops, joggers: productJoggers, dressshirts: productDressshirts, puffer: productPuffer,
  cargopants: productCargopants, swimwear: productSwimwear, leggings: productLeggings, caps: productCaps,
};

export const CATEGORY_META: Record<string, { heading: string; blurb: string }> = {
  tshirts: { heading: "Custom T-Shirt Manufacturing", blurb: "Private-label t-shirt production in premium cotton and blends, with your prints, labels and packaging." },
  hoodies: { heading: "Custom Hoodie & Sweatshirt Manufacturing", blurb: "Heavyweight fleece and French terry hoodies built for streetwear and athleisure labels." },
  tracksuits: { heading: "Custom Tracksuit Manufacturing", blurb: "Matching jacket and pant sets produced for sports teams, streetwear brands and corporate kits." },
  jackets: { heading: "Custom Jacket & Outerwear Manufacturing", blurb: "Bombers, windbreakers and shells with technical fabrics and precision construction." },
  sportswear: { heading: "Custom Sportswear & Activewear Manufacturing", blurb: "Moisture-wicking performance apparel engineered for training and competition." },
  streetwear: { heading: "Custom Streetwear Manufacturing", blurb: "Oversized silhouettes, heavy fabrics and statement finishing for urban fashion labels." },
  denim: { heading: "Custom Denim Manufacturing", blurb: "Jeans and denim jackets with specialist washes, distressing and hardware." },
  polo: { heading: "Custom Polo Shirt Manufacturing", blurb: "Piqué and performance polos for corporate, golf and fashion programmes." },
  uniforms: { heading: "Corporate Uniform Manufacturing", blurb: "Durable uniform programmes for hospitality, healthcare, corporate and industrial teams." },
  kidswear: { heading: "Custom Kids Wear Manufacturing", blurb: "Child-safe fabrics and trims meeting international safety standards." },
  trousers: { heading: "Custom Trousers & Chinos Manufacturing", blurb: "Chinos, casual trousers and tailored pants in durable cotton twills." },
  shorts: { heading: "Custom Shorts Manufacturing", blurb: "Athletic, casual and board shorts with quick-dry performance fabrics." },
  tanktops: { heading: "Custom Tank Tops & Vests Manufacturing", blurb: "Lightweight, breathable sleeveless styles for gym and fashion lines." },
  joggers: { heading: "Custom Joggers & Sweatpants Manufacturing", blurb: "Fleece-lined joggers and tech-fleece sweatpants for athleisure collections." },
  dressshirts: { heading: "Custom Dress Shirt Manufacturing", blurb: "Formal and business shirts with luxury cottons and refined tailoring." },
  puffer: { heading: "Custom Puffer & Down Jacket Manufacturing", blurb: "Insulated winter outerwear with down and synthetic fill options." },
  cargopants: { heading: "Custom Cargo Pants Manufacturing", blurb: "Utility cargo pants with functional pocketing and rugged fabrics." },
  swimwear: { heading: "Custom Swimwear Manufacturing", blurb: "Swim trunks, board shorts and resort wear with vibrant sublimation printing." },
  leggings: { heading: "Custom Leggings & Tights Manufacturing", blurb: "Compression leggings and yoga tights for fitness and athleisure brands." },
  caps: { heading: "Custom Caps & Headwear Manufacturing", blurb: "Snapbacks, dad hats, beanies and bucket hats with custom embroidery." },
};

export const mapDbProduct = (p: any): CatalogItem => ({
  id: p.id,
  category_slug: p.category_slug,
  name: p.name,
  description: p.description || "",
  image: p.image_url || CATEGORY_FALLBACK[p.category_slug] || SEED[0].image,
  gallery: p.image_url ? [p.image_url] : [CATEGORY_FALLBACK[p.category_slug] || SEED[0].image],
  fabrics: p.fabrics || [],
  moq: p.moq || "—",
  featured: p.featured,
  source: "admin",
});

export const categoryName = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.name || slug;
