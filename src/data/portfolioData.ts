import { PortfolioItem } from "../types";
import screenFixingPreview from "../assets/site-screenfixing.png.asset.json";
import eyewearOffer from "../assets/social-posts/offers-1.jpg";
import bakeryOffer from "../assets/social-posts/offers-2.jpg";
import fitnessOffer from "../assets/social-posts/offers-3.jpg";
import interiorsPromotion from "../assets/social-posts/offers-4.jpg";
import cafePromotion from "../assets/social-posts/promos-1.jpg";
import autoPromotion from "../assets/social-posts/promos-2.jpg";
import dentalPromotion from "../assets/social-posts/promos-3.jpg";
import floristPromotion from "../assets/social-posts/promos-4.jpg";
import jewelleryDiwali from "../assets/social-posts/festivals-1.jpg";
import restaurantHoli from "../assets/social-posts/festivals-2.jpg";
import fashionNavratri from "../assets/social-posts/festivals-3.jpg";
import sweetsEid from "../assets/social-posts/festivals-4.jpg";
import solsticeLogo from "../assets/branding-samples/logo-solstice-cafe.jpg";
import vantageLogo from "../assets/branding-samples/logo-vantage-architecture.jpg";
import bloomfieldLogo from "../assets/branding-samples/logo-bloomfield-florist.jpg";
import axiomLogo from "../assets/branding-samples/logo-axiom-fitness.jpg";
import aurelLogo from "../assets/branding-samples/logo-aurel-jewellery.jpg";
import novaLogo from "../assets/branding-samples/logo-nova-repair.jpg";
import harvestLogo from "../assets/branding-samples/logo-harvest-organic.jpg";
import solsticeCard from "../assets/branding-samples/card-solstice-cafe.jpg";
import vantageCard from "../assets/branding-samples/card-vantage-architecture.jpg";
import bloomfieldCard from "../assets/branding-samples/card-bloomfield-florist.jpg";
import axiomCard from "../assets/branding-samples/card-axiom-fitness.jpg";
import aurelCard from "../assets/branding-samples/card-aurel-jewellery.jpg";
import novaCard from "../assets/branding-samples/card-nova-repair.jpg";
import harvestCard from "../assets/branding-samples/card-harvest-organic.jpg";
import nestCard from "../assets/branding-samples/card-nest-real-estate.jpg";
import vivaCard from "../assets/branding-samples/card-viva-salon.jpg";
import cafeReel from "../assets/portfolio-media/cafe-reel.webm.asset.json";
import fitnessReel from "../assets/portfolio-media/fitness-reel.webm.asset.json";
import jewelleryReel from "../assets/portfolio-media/jewellery-reel.webm.asset.json";
import interiorsReel from "../assets/portfolio-media/interiors-reel.webm.asset.json";
import cafePoster from "../assets/portfolio-media/cafe-poster.jpg.asset.json";
import fitnessPoster from "../assets/portfolio-media/fitness-poster.jpg.asset.json";
import jewelleryPoster from "../assets/portfolio-media/jewellery-poster.jpg.asset.json";
import interiorsPoster from "../assets/portfolio-media/interiors-poster.jpg.asset.json";
import invitationSuite from "../assets/wedding-samples/invitation-suite.jpg";
import varmalaCeremony from "../assets/wedding-samples/varmala-ceremony.jpg";
import weddingAlbum from "../assets/wedding-samples/wedding-album.jpg";
import preWeddingPortrait from "../assets/wedding-samples/pre-wedding-portrait.jpg";
import mehndiCreative from "../assets/wedding-samples/mehndi-creative.jpg";
import receptionStage from "../assets/wedding-samples/reception-stage.jpg";

export const PORTFOLIO_STORAGE_KEY = "digibasera_portfolio_verified_clients_v11";

type SampleSeed = {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  relatedServiceIds?: string[];
  websiteUrl?: string;
  displayUrl?: string;
  industry?: string;
  videoUrl?: string;
};

const makeItem = (seed: SampleSeed, order: number): PortfolioItem => ({
  id: seed.id,
  title: seed.title,
  projectType: seed.websiteUrl ? "live_client" : "sample_project",
  badge: seed.websiteUrl ? "Live Client Website" : "Sample Project",
  clientName: seed.title,
  industry: seed.industry || seed.categoryName,
  categoryId: seed.categoryId,
  categoryName: seed.categoryName,
  category: seed.category,
  relatedServiceIds: seed.relatedServiceIds || [],
  relatedServiceNames: [],
  websiteUrl: seed.websiteUrl,
  displayUrl: seed.displayUrl,
  imageUrl: seed.imageUrl,
  videoUrl: seed.videoUrl,
  summary: "",
  challenge: "",
  strategy: "",
  deliverables: [],
  metrics: [],
  status: "active",
  displayOrder: order,
  featured: order <= 3,
});

const WEB = {
  category: "Websites",
  categoryId: "web-development",
  categoryName: "Web Development",
  relatedServiceIds: ["custom-web-development"],
};
const SOCIAL = {
  category: "Social Media",
  categoryId: "digital-marketing",
  categoryName: "Social Media",
  relatedServiceIds: ["social-media-marketing"],
};
const SEO = {
  category: "SEO",
  categoryId: "seo",
  categoryName: "SEO & AI Search",
  relatedServiceIds: ["seo-services-core"],
};
const ADS = {
  category: "Ads",
  categoryId: "digital-marketing",
  categoryName: "Performance Ads",
  relatedServiceIds: ["meta-ads"],
};
const BRAND = {
  category: "Branding",
  categoryId: "branding-creative",
  categoryName: "Branding & Design",
  relatedServiceIds: ["brand-identity"],
};
const WEDDING = {
  category: "Wedding",
  categoryId: "wedding-creative",
  categoryName: "Wedding Creative",
  relatedServiceIds: ["wedding-video-editing"],
};
const VIDEO = {
  category: "Video",
  categoryId: "video-production",
  categoryName: "Video & Reels",
  relatedServiceIds: ["video-editing"],
};

const SAMPLE_SEEDS: SampleSeed[] = [
  // Websites (real live client sites)
  {
    ...WEB,
    id: "abfi-interior-live",
    title: "ABFI Interior",
    websiteUrl: "https://www.abfiinterior.com",
    displayUrl: "www.abfiinterior.com",
    imageUrl: "/assets/images/site-abfiinterior.jpg",
    industry: "Interior Design",
  },
  {
    ...WEB,
    id: "super-india-interior-live",
    title: "Super India Interior",
    websiteUrl: "https://www.superindiainterior.com",
    displayUrl: "www.superindiainterior.com",
    imageUrl: "/assets/images/site-superindiainterior.jpg",
    industry: "Interior & Contractor",
  },
  {
    ...WEB,
    id: "premium-pack-co-live",
    title: "Premium Pack Co",
    websiteUrl: "https://www.premiumpackco.com",
    displayUrl: "www.premiumpackco.com",
    imageUrl: "/assets/images/site-premiumpackco.jpg",
    industry: "Packaging Manufacturer",
  },
  {
    ...WEB,
    id: "screen-fixing-live",
    title: "Screen Fixing",
    websiteUrl: "https://www.screenfixing.in",
    displayUrl: "www.screenfixing.in",
    imageUrl: screenFixingPreview.url,
    industry: "Device Repair",
  },

  // Social Media Posts
  {
    ...SOCIAL,
    id: "social-diwali",
    title: "Diwali Festive Offer Post",
    imageUrl: "/assets/images/sample-social-diwali.jpg",
  },
  {
    ...SOCIAL,
    id: "social-navratri",
    title: "Navratri Festive Post",
    imageUrl: "/assets/images/navratri_festive_post_1788005993964.jpg",
  },
  {
    ...SOCIAL,
    id: "social-holi",
    title: "Holi Flash Sale Post",
    imageUrl: "/assets/images/holi_festival_promo_post_1788006061652.jpg",
  },
  {
    ...SOCIAL,
    id: "social-business-growth",
    title: "Business Promotion Post",
    imageUrl: "/assets/images/business_growth_promo_post_1788006007399.jpg",
  },
  {
    ...SOCIAL,
    id: "social-real-estate",
    title: "Real Estate Launch Post",
    imageUrl: "/assets/images/real_estate_promo_post_1788006020063.jpg",
  },
  {
    ...SOCIAL,
    id: "social-restaurant",
    title: "Restaurant Festive Offer Post",
    imageUrl: "/assets/images/restaurant_festive_offer_post_1788006034950.jpg",
  },
  {
    ...SOCIAL,
    id: "social-salon",
    title: "Salon & Spa Promotion Post",
    imageUrl: "/assets/images/salon_spa_festive_glow_promo_1788006048578.jpg",
  },
  {
    ...SOCIAL,
    id: "social-jewellery",
    title: "Jewellery Festive Post",
    imageUrl: "/assets/images/sample-social-jewellery.jpg",
  },
  {
    ...SOCIAL,
    id: "social-gym",
    title: "Gym New Year Offer Post",
    imageUrl: "/assets/images/sample-social-gym-offer.jpg",
  },
  {
    ...SOCIAL,
    id: "social-google-ads",
    title: "Google Ads Service Post",
    imageUrl: "/assets/images/sample-social-google-ads.jpg",
  },
  // Additional concept creatives: offers, business promotions, and festival greetings.
  {
    ...SOCIAL,
    id: "social-new-eyewear-offer",
    title: "Eyewear Store Offer Post",
    imageUrl: eyewearOffer,
  },
  {
    ...SOCIAL,
    id: "social-new-bakery-offer",
    title: "Bakery Fresh Bakes Offer Post",
    imageUrl: bakeryOffer,
  },
  {
    ...SOCIAL,
    id: "social-new-fitness-offer",
    title: "Fitness Studio Joining Offer Post",
    imageUrl: fitnessOffer,
  },
  {
    ...SOCIAL,
    id: "social-new-interiors-promotion",
    title: "Home Interiors Promotion Post",
    imageUrl: interiorsPromotion,
  },
  {
    ...SOCIAL,
    id: "social-new-cafe-promotion",
    title: "Cafe Business Promotion Post",
    imageUrl: cafePromotion,
  },
  {
    ...SOCIAL,
    id: "social-new-auto-promotion",
    title: "Auto Detailing Promotion Post",
    imageUrl: autoPromotion,
  },
  {
    ...SOCIAL,
    id: "social-new-dental-promotion",
    title: "Dental Clinic Promotion Post",
    imageUrl: dentalPromotion,
  },
  {
    ...SOCIAL,
    id: "social-new-florist-promotion",
    title: "Florist Business Promotion Post",
    imageUrl: floristPromotion,
  },
  {
    ...SOCIAL,
    id: "social-new-jewellery-diwali",
    title: "Jewellery Boutique Diwali Wish Post",
    imageUrl: jewelleryDiwali,
  },
  {
    ...SOCIAL,
    id: "social-new-restaurant-holi",
    title: "Restaurant Holi Wish Post",
    imageUrl: restaurantHoli,
  },
  {
    ...SOCIAL,
    id: "social-new-fashion-navratri",
    title: "Fashion Boutique Navratri Wish Post",
    imageUrl: fashionNavratri,
  },
  {
    ...SOCIAL,
    id: "social-new-sweets-eid",
    title: "Sweet Shop Eid Wish Post",
    imageUrl: sweetsEid,
  },

  // SEO Reports & Charts
  {
    ...SEO,
    id: "seo-traffic",
    title: "Organic Traffic Growth Report",
    imageUrl: "/assets/images/sample-seo-traffic-chart.jpg",
  },
  {
    ...SEO,
    id: "seo-console",
    title: "Search Console Performance",
    imageUrl: "/assets/images/sample-seo-console-chart.jpg",
  },
  {
    ...SEO,
    id: "seo-local",
    title: "Local SEO Ranking Report",
    imageUrl: "/assets/images/sample-seo-local-chart.jpg",
  },
  {
    ...SEO,
    id: "seo-audit",
    title: "Technical SEO Audit Score",
    imageUrl: "/assets/images/sample-seo-audit-chart.jpg",
  },

  // Performance Ads
  {
    ...ADS,
    id: "ads-meta-report",
    title: "Meta Ads Performance Report",
    imageUrl: "/assets/images/sample-ads-report.jpg",
  },

  // Branding & Design
  {
    ...BRAND,
    id: "brand-logo-aura-cafe",
    title: "Aura Cafe Logo Design",
    imageUrl: "/assets/images/brand-logo-sample-1.jpg",
  },
  {
    ...BRAND,
    id: "brand-logo-nova-build",
    title: "Nova Build Logo Design",
    imageUrl: "/assets/images/brand-logo-sample-2.jpg",
  },
  {
    ...BRAND,
    id: "brand-visiting-card-premium",
    title: "Premium Black & Gold Visiting Card",
    imageUrl: "/assets/images/brand-visiting-card-1.jpg",
  },
  {
    ...BRAND,
    id: "brand-visiting-card-corporate",
    title: "Corporate Visiting Card Design",
    imageUrl: "/assets/images/brand-visiting-card-2.jpg",
  },
  // Distinct branding concepts for nine business types.
  {
    ...BRAND,
    id: "brand-new-logo-solstice",
    title: "Solstice Cafe Logo Design",
    imageUrl: solsticeLogo,
    industry: "Boutique Cafe",
  },
  {
    ...BRAND,
    id: "brand-new-logo-vantage",
    title: "Vantage Architecture Logo Design",
    imageUrl: vantageLogo,
    industry: "Architecture",
  },
  {
    ...BRAND,
    id: "brand-new-logo-bloomfield",
    title: "Bloomfield Florist Logo Design",
    imageUrl: bloomfieldLogo,
    industry: "Florist",
  },
  {
    ...BRAND,
    id: "brand-new-logo-axiom",
    title: "Axiom Fitness Logo Design",
    imageUrl: axiomLogo,
    industry: "Fitness Club",
  },
  {
    ...BRAND,
    id: "brand-new-logo-aurel",
    title: "Aurel Jewellery Logo Design",
    imageUrl: aurelLogo,
    industry: "Fine Jewellery",
  },
  {
    ...BRAND,
    id: "brand-new-logo-nova",
    title: "Nova Repair Logo Design",
    imageUrl: novaLogo,
    industry: "Technology Repair",
  },
  {
    ...BRAND,
    id: "brand-new-logo-harvest",
    title: "Harvest Organic Logo Design",
    imageUrl: harvestLogo,
    industry: "Organic Food",
  },
  {
    ...BRAND,
    id: "brand-new-card-solstice",
    title: "Solstice Cafe Visiting Card",
    imageUrl: solsticeCard,
    industry: "Boutique Cafe",
  },
  {
    ...BRAND,
    id: "brand-new-card-vantage",
    title: "Vantage Architecture Visiting Card",
    imageUrl: vantageCard,
    industry: "Architecture",
  },
  {
    ...BRAND,
    id: "brand-new-card-bloomfield",
    title: "Bloomfield Florist Visiting Card",
    imageUrl: bloomfieldCard,
    industry: "Florist",
  },
  {
    ...BRAND,
    id: "brand-new-card-axiom",
    title: "Axiom Fitness Visiting Card",
    imageUrl: axiomCard,
    industry: "Fitness Club",
  },
  {
    ...BRAND,
    id: "brand-new-card-aurel",
    title: "Aurel Jewellery Visiting Card",
    imageUrl: aurelCard,
    industry: "Fine Jewellery",
  },
  {
    ...BRAND,
    id: "brand-new-card-nova",
    title: "Nova Repair Visiting Card",
    imageUrl: novaCard,
    industry: "Technology Repair",
  },
  {
    ...BRAND,
    id: "brand-new-card-harvest",
    title: "Harvest Organic Visiting Card",
    imageUrl: harvestCard,
    industry: "Organic Food",
  },
  {
    ...BRAND,
    id: "brand-new-card-nest",
    title: "Nest Real Estate Visiting Card",
    imageUrl: nestCard,
    industry: "Real Estate",
  },
  {
    ...BRAND,
    id: "brand-new-card-viva",
    title: "Viva Salon Visiting Card",
    imageUrl: vivaCard,
    industry: "Beauty Salon",
  },
  {
    ...BRAND,
    id: "brand-banner-gym",
    title: "Gym Promotion Banner",
    imageUrl: "/assets/images/brand-banner-1.jpg",
  },
  {
    ...BRAND,
    id: "brand-banner-sale",
    title: "Grand Opening Sale Banner",
    imageUrl: "/assets/images/brand-banner-2.jpg",
  },

  // Video Editing, Reels & Motion
  {
    ...VIDEO,
    id: "video-product-promo",
    title: "Product Promo Video",
    imageUrl: "/assets/images/portfolio-product-promo-thumb.jpg",
    videoUrl: "/assets/videos/portfolio-product-promo.webm",
  },
  {
    ...VIDEO,
    id: "video-instagram-reel",
    title: "Instagram Reel Edit",
    imageUrl: "/assets/images/portfolio-instagram-reel-thumb.jpg",
    videoUrl: "/assets/videos/portfolio-instagram-reel.webm",
  },
  {
    ...VIDEO,
    id: "video-wedding-film",
    title: "Wedding Film Edit",
    imageUrl: "/assets/images/portfolio-wedding-film-thumb.jpg",
    videoUrl: "/assets/videos/portfolio-wedding-film.webm",
  },
  {
    ...VIDEO,
    id: "video-ai-motion",
    title: "AI Motion Video",
    imageUrl: "/assets/images/portfolio-ai-motion-thumb.jpg",
    videoUrl: "/assets/videos/portfolio-ai-motion.webm",
  },
  {
    ...VIDEO,
    id: "video-new-cafe",
    title: "Cafe Social Reel",
    imageUrl: cafePoster.url,
    videoUrl: cafeReel.url,
    industry: "Cafe & Hospitality",
  },
  {
    ...VIDEO,
    id: "video-new-fitness",
    title: "Fitness Studio Reel",
    imageUrl: fitnessPoster.url,
    videoUrl: fitnessReel.url,
    industry: "Fitness",
  },
  {
    ...VIDEO,
    id: "video-new-jewellery",
    title: "Jewellery Boutique Reel",
    imageUrl: jewelleryPoster.url,
    videoUrl: jewelleryReel.url,
    industry: "Jewellery",
  },
  {
    ...VIDEO,
    id: "video-new-interiors",
    title: "Interior Design Reel",
    imageUrl: interiorsPoster.url,
    videoUrl: interiorsReel.url,
    industry: "Interior Design",
  },

  // Wedding Creative
  {
    ...WEDDING,
    id: "wedding-teaser",
    title: "Wedding Film Teaser",
    imageUrl: "/assets/images/sample-wedding-teaser.jpg",
  },
  {
    ...WEDDING,
    id: "wedding-album",
    title: "Wedding Album Design",
    imageUrl: "/assets/images/sample-wedding-album.jpg",
  },
  {
    ...WEDDING,
    id: "wedding-invite",
    title: "Wedding Invitation Creative",
    imageUrl: "/assets/images/sample-wedding-invite.jpg",
  },
  {
    ...WEDDING,
    id: "wedding-prewedding",
    title: "Pre-Wedding Shoot Edit",
    imageUrl: "/assets/images/sample-wedding-prewedding.jpg",
  },
  {
    ...WEDDING,
    id: "wedding-editing",
    title: "Wedding Video Editing",
    imageUrl: "/assets/images/sample-wedding-editing.jpg",
  },
  {
    ...WEDDING,
    id: "wedding-new-invitation",
    title: "Wedding Invitation Suite",
    imageUrl: invitationSuite,
  },
  {
    ...WEDDING,
    id: "wedding-new-varmala",
    title: "Varmala Ceremony Creative",
    imageUrl: varmalaCeremony,
  },
  { ...WEDDING, id: "wedding-new-album", title: "Wedding Photo Album", imageUrl: weddingAlbum },
  {
    ...WEDDING,
    id: "wedding-new-prewedding",
    title: "Pre-Wedding Portrait",
    imageUrl: preWeddingPortrait,
  },
  {
    ...WEDDING,
    id: "wedding-new-mehndi",
    title: "Mehndi Ceremony Creative",
    imageUrl: mehndiCreative,
  },
  {
    ...WEDDING,
    id: "wedding-new-reception",
    title: "Wedding Reception Creative",
    imageUrl: receptionStage,
  },
];

export const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = SAMPLE_SEEDS.map((seed, i) =>
  makeItem(seed, i + 1),
);

export interface PortfolioCategoryMeta {
  id: string;
  label: string;
  description?: string;
  badge?: string;
  displayOrder?: number;
}

export const PORTFOLIO_CATEGORIES_STORAGE_KEY = "digibasera_portfolio_categories_v4";

export const DEFAULT_PORTFOLIO_CATEGORIES: PortfolioCategoryMeta[] = [
  { id: "Websites", label: "Websites", badge: "Live & Custom Portals", displayOrder: 1 },
  { id: "Social Media", label: "Social Media", badge: "Creatives & Reels", displayOrder: 2 },
  { id: "SEO", label: "SEO & AI Search", badge: "Organic Growth", displayOrder: 3 },
  { id: "Ads", label: "Performance Ads", badge: "Meta & Google PPC", displayOrder: 4 },
  { id: "Branding", label: "Branding & Design", badge: "Logos & Identity", displayOrder: 5 },
  { id: "Wedding", label: "Wedding Creative", badge: "Teasers & Albums", displayOrder: 6 },
  { id: "Video", label: "Video & Reels", badge: "Editing & Motion", displayOrder: 7 },
];

export const loadStoredPortfolioCategories = (): PortfolioCategoryMeta[] => {
  if (typeof window === "undefined") return DEFAULT_PORTFOLIO_CATEGORIES;
  try {
    const data = localStorage.getItem(PORTFOLIO_CATEGORIES_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load portfolio categories from localStorage:", err);
  }
  return DEFAULT_PORTFOLIO_CATEGORIES;
};

export const saveStoredPortfolioCategories = (categories: PortfolioCategoryMeta[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PORTFOLIO_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error("Failed to save portfolio categories to localStorage:", err);
  }
};

export const resetPortfolioCategoriesToDefaults = (): PortfolioCategoryMeta[] => {
  if (typeof window === "undefined") return DEFAULT_PORTFOLIO_CATEGORIES;
  try {
    localStorage.setItem(
      PORTFOLIO_CATEGORIES_STORAGE_KEY,
      JSON.stringify(DEFAULT_PORTFOLIO_CATEGORIES),
    );
  } catch (err) {
    console.error("Failed to reset portfolio categories in localStorage:", err);
  }
  return DEFAULT_PORTFOLIO_CATEGORIES;
};

export const loadStoredPortfolioItems = (): PortfolioItem[] => {
  if (typeof window === "undefined") return DEFAULT_PORTFOLIO_ITEMS;
  try {
    const data = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Preserve saved edits while adding only this release's new samples.
        const existingIds = new Set(parsed.map((item: PortfolioItem) => item.id));
        const newSamples = DEFAULT_PORTFOLIO_ITEMS.filter(
          (item) =>
            (item.id === "screen-fixing-live" ||
              item.id.startsWith("social-new-") ||
              item.id.startsWith("brand-new-") ||
              item.id.startsWith("video-new-") ||
              item.id.startsWith("wedding-new-")) &&
            !existingIds.has(item.id),
        );
        return [
          ...parsed.map((item: PortfolioItem) => {
            const defaultItem = DEFAULT_PORTFOLIO_ITEMS.find((sample) => sample.id === item.id);
            if (
              defaultItem?.videoUrl &&
              item.videoUrl?.startsWith("/assets/videos/portfolio-") &&
              item.videoUrl.endsWith(".mp4")
            ) {
              return { ...item, videoUrl: defaultItem.videoUrl };
            }
            return item;
          }),
          ...newSamples,
        ];
      }
    }
  } catch (err) {
    console.error("Failed to load portfolio items from localStorage:", err);
  }
  return DEFAULT_PORTFOLIO_ITEMS;
};

export const saveStoredPortfolioItems = (items: PortfolioItem[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save portfolio items to localStorage:", err);
  }
};

export const savePortfolioItems = saveStoredPortfolioItems;

export const resetPortfolioToFactoryDefaults = (): PortfolioItem[] => {
  if (typeof window === "undefined") return DEFAULT_PORTFOLIO_ITEMS;
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(DEFAULT_PORTFOLIO_ITEMS));
  } catch (err) {
    console.error("Failed to reset portfolio items in localStorage:", err);
  }
  return DEFAULT_PORTFOLIO_ITEMS;
};
