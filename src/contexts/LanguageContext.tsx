import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "es" | "fr" | "zh" | "ar" | "tr";

const translations: Record<Lang, Record<string, string>> = {
  en: {
    home: "Home", products: "Products", services: "Services", process: "Process", contact: "Contact", faq: "FAQ",
    getQuote: "Get a Quote", login: "Login", dashboard: "Dashboard", admin: "Admin",
    heroTitle: "Premium Apparel Manufacturing", heroSub: "From concept to delivery — quality garments at scale.",
    ourProducts: "Our Products", premiumCategories: "Premium Apparel Categories",
    weManufacture: "We manufacture a wide range of garments for every market segment.",
    viewAll: "View All Products", viewCollection: "View Collection",
    requestQuote: "Request Quote", contactForPrice: "Contact for Price",
    moq: "MOQ", fabrics: "Fabrics", customization: "Customization",
  },
  es: {
    home: "Inicio", products: "Productos", services: "Servicios", process: "Proceso", contact: "Contacto", faq: "Preguntas",
    getQuote: "Cotización", login: "Iniciar Sesión", dashboard: "Panel", admin: "Admin",
    heroTitle: "Fabricación Premium de Ropa", heroSub: "Del concepto a la entrega — prendas de calidad a escala.",
    ourProducts: "Nuestros Productos", premiumCategories: "Categorías Premium de Ropa",
    weManufacture: "Fabricamos una amplia gama de prendas para cada segmento del mercado.",
    viewAll: "Ver Todos los Productos", viewCollection: "Ver Colección",
    requestQuote: "Solicitar Cotización", contactForPrice: "Contactar por Precio",
    moq: "Cantidad Mínima", fabrics: "Telas", customization: "Personalización",
  },
  fr: {
    home: "Accueil", products: "Produits", services: "Services", process: "Processus", contact: "Contact", faq: "FAQ",
    getQuote: "Devis", login: "Connexion", dashboard: "Tableau de bord", admin: "Admin",
    heroTitle: "Fabrication Premium de Vêtements", heroSub: "Du concept à la livraison — vêtements de qualité à grande échelle.",
    ourProducts: "Nos Produits", premiumCategories: "Catégories Premium",
    weManufacture: "Nous fabriquons une large gamme de vêtements pour chaque segment de marché.",
    viewAll: "Voir Tous les Produits", viewCollection: "Voir Collection",
    requestQuote: "Demander un Devis", contactForPrice: "Contacter pour le Prix",
    moq: "QMC", fabrics: "Tissus", customization: "Personnalisation",
  },
  zh: {
    home: "首页", products: "产品", services: "服务", process: "流程", contact: "联系我们", faq: "常见问题",
    getQuote: "获取报价", login: "登录", dashboard: "控制台", admin: "管理",
    heroTitle: "高端服装制造", heroSub: "从概念到交付 — 大规模优质服装。",
    ourProducts: "我们的产品", premiumCategories: "高端服装类别",
    weManufacture: "我们为每个市场领域制造各种服装。",
    viewAll: "查看所有产品", viewCollection: "查看系列",
    requestQuote: "请求报价", contactForPrice: "联系获取价格",
    moq: "最小起订量", fabrics: "面料", customization: "定制",
  },
  ar: {
    home: "الرئيسية", products: "المنتجات", services: "الخدمات", process: "العملية", contact: "اتصل بنا", faq: "الأسئلة الشائعة",
    getQuote: "طلب عرض سعر", login: "تسجيل الدخول", dashboard: "لوحة التحكم", admin: "الإدارة",
    heroTitle: "تصنيع ملابس فاخرة", heroSub: "من الفكرة إلى التسليم — ملابس عالية الجودة.",
    ourProducts: "منتجاتنا", premiumCategories: "فئات الملابس الفاخرة",
    weManufacture: "نصنع مجموعة واسعة من الملابس لكل قطاع سوقي.",
    viewAll: "عرض جميع المنتجات", viewCollection: "عرض المجموعة",
    requestQuote: "طلب عرض سعر", contactForPrice: "اتصل للسعر",
    moq: "الحد الأدنى للطلب", fabrics: "الأقمشة", customization: "التخصيص",
  },
  tr: {
    home: "Ana Sayfa", products: "Ürünler", services: "Hizmetler", process: "Süreç", contact: "İletişim", faq: "SSS",
    getQuote: "Teklif Al", login: "Giriş", dashboard: "Panel", admin: "Yönetim",
    heroTitle: "Premium Giyim Üretimi", heroSub: "Konseptten teslimata — ölçekte kaliteli giysiler.",
    ourProducts: "Ürünlerimiz", premiumCategories: "Premium Giyim Kategorileri",
    weManufacture: "Her pazar segmenti için geniş bir giyim yelpazesi üretiyoruz.",
    viewAll: "Tüm Ürünleri Gör", viewCollection: "Koleksiyonu Gör",
    requestQuote: "Teklif İste", contactForPrice: "Fiyat İçin İletişime Geçin",
    moq: "Minimum Sipariş", fabrics: "Kumaşlar", customization: "Kişiselleştirme",
  },
};

const langNames: Record<Lang, string> = { en: "EN", es: "ES", fr: "FR", zh: "中文", ar: "عربي", tr: "TR" };

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  langs: { code: Lang; name: string }[];
}

const LanguageContext = createContext<LangContextType>({
  lang: "en", setLang: () => {}, t: (k) => k,
  langs: Object.entries(langNames).map(([code, name]) => ({ code: code as Lang, name })),
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>((localStorage.getItem("lang") as Lang) || "en");

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("lang", l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const t = (key: string) => translations[lang]?.[key] || translations.en[key] || key;
  const langs = Object.entries(langNames).map(([code, name]) => ({ code: code as Lang, name }));

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t, langs }}>
      {children}
    </LanguageContext.Provider>
  );
};
