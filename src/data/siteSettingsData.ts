export interface SiteSettings {
  companyName: string;
  phoneDisplay: string;
  phoneRaw: string;
  email: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  headquarters: string;
  officeHours: string;
  googleMapsUrl: string;
  googleBusinessUrl: string;

  // Announcement Bar
  announcementEnabled: boolean;
  announcementBadge: string;
  announcementText: string;
  announcementCtaText: string;

  // Social Links
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;

  // Hero Copy
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: "Digi Basera",
  phoneDisplay: "+91 98987 78047",
  phoneRaw: "919898778047",
  email: "contact@digibasera.com",
  whatsappNumber: "919898778047",
  whatsappDefaultMessage:
    "Hello DigiBasera, I would like to schedule a strategic digital marketing consultation for my brand.",
  headquarters:
    "DigiBasera, Chandresh Nagar Main Road, Mayani Chowk, Opposite Backbone Shopping Center, Rajkot - 360004",
  officeHours: "Monday – Saturday: 9:30 AM – 7:30 PM IST (Sunday Closed)",
  googleMapsUrl: "https://share.google/6qE9KBy6hSqJnPcZ2",
  googleBusinessUrl: "https://share.google/6qE9KBy6hSqJnPcZ2",

  announcementEnabled: false,
  announcementBadge: "LIMITED SLOTS",
  announcementText:
    "Complimentary Full-Stack Digital Marketing & SEO Growth Audit for Rajkot & Gujarat Brands",
  announcementCtaText: "Claim Free Audit",

  instagramUrl: "https://www.instagram.com/digibasera/",
  facebookUrl: "https://www.facebook.com/digibasera",
  linkedinUrl: "https://www.linkedin.com/company/digibasera",
  youtubeUrl: "https://www.youtube.com/@digibasera",

  heroTagline: "DIGITAL MARKETING • SEO • WEB ENGINEERING • PERFORMANCE ROAS",
  heroHeadline: "Turning Digital Ambition into Tangible Market Dominance",
  heroSubheadline:
    "Certified growth architects and full-stack software engineers scaling ROI for Gujarat and pan-India enterprises.",
};

const SITE_SETTINGS_STORAGE_KEY = "digibasera_stored_site_settings";

export const loadStoredSiteSettings = (): SiteSettings => {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    const parsed = JSON.parse(raw);
    if (parsed.headquarters && !parsed.headquarters.includes("Mayani Chowk")) {
      parsed.headquarters = DEFAULT_SITE_SETTINGS.headquarters;
    }
    return { ...DEFAULT_SITE_SETTINGS, ...parsed };
  } catch (e) {
    console.error("Failed to load stored site settings", e);
    return DEFAULT_SITE_SETTINGS;
  }
};

export const saveSiteSettings = (settings: SiteSettings): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SITE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("digibasera_settings_updated"));
  } catch (e) {
    console.error("Failed to save site settings", e);
  }
};

export const resetSiteSettingsToFactoryDefaults = (): SiteSettings => {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
  try {
    localStorage.removeItem(SITE_SETTINGS_STORAGE_KEY);
    window.dispatchEvent(new Event("digibasera_settings_updated"));
  } catch (e) {
    console.error("Failed to reset site settings", e);
  }
  return DEFAULT_SITE_SETTINGS;
};
