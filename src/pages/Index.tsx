import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import StatsSection from "@/components/StatsSection";
import ServicesPreview from "@/components/ServicesPreview";
import ProductsPreview from "@/components/ProductsPreview";
import ClientsSection from "@/components/ClientsSection";
import PromoBanner from "@/components/PromoBanner";
import DesignStudioCTA from "@/components/DesignStudioCTA";
import LookbookPreview from "@/components/LookbookPreview";
import Footer from "@/components/Footer";
import heroFashion from "@/assets/hero-fashion.jpg";
import heroLabels from "@/assets/hero-labels.jpg";
import serviceShipping from "@/assets/service-shipping.jpg";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSlider />
    <StatsSection />
    <ServicesPreview />
    <PromoBanner headline="Launch Your Clothing Brand Today" image={heroFashion} cta="Start Now" />
    <ProductsPreview />
    <DesignStudioCTA />
    <LookbookPreview />
    <PromoBanner headline="From Idea to Global Delivery" image={serviceShipping} cta="Learn More" link="/process" />
    <ClientsSection />
    <PromoBanner headline="Custom Manufacturing for Growing Brands" image={heroLabels} cta="Request a Quote" />
    <Footer />
  </div>
);

export default Index;
