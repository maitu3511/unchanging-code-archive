import armanAliPhoto from "../assets/arman-ali.jpg";
import arbajSaifiPhoto from "../assets/arbaj-saifi.jpg";
import mohDanishPhoto from "../assets/mohd-danish.jpg";
import mohasinAhmedPhoto from "../assets/mohasin-ahmed.jpg";

export interface CoreTeamMember {
  id: string;
  name: string;
  role: string;
  exp: string; // E.g. "Performance Lead", "Engineering Head"
  specialty: string;
  image: string;
  bio?: string;
  department?: string;
  status?: "active" | "hidden";
  order?: number;
  linkedin?: string;
}

export const DEFAULT_TEAM_MEMBERS: CoreTeamMember[] = [
  {
    id: "team-arman-ali",
    name: "Arman Ali",
    role: "Strategic Growth Director & Performance Lead",
    exp: "Performance Lead",
    specialty: "Meta & Google Ads Funnels, Scaled ROAS, B2B Commercial Acquisition",
    image: armanAliPhoto,
    department: "Performance Marketing",
    bio: "Specializing in high-ROI media acquisition, conversion rate optimization, and scaling direct-response ad funnels across competitive industries.",
    status: "active",
    order: 1,
  },
  {
    id: "team-arbaj-saifi",
    name: "Arbaj Saifi",
    role: "Lead Technical Architect & Engineering Head",
    exp: "Engineering Head",
    specialty: "React, Next.js, Headless Shopify, Core Web Vitals & Fast Architecture",
    image: arbajSaifiPhoto,
    department: "Web & Software Engineering",
    bio: "Architecting high-performance web systems, custom e-commerce applications, and scalable headless storefronts with sub-second page speeds.",
    status: "active",
    order: 2,
  },
  {
    id: "team-moh-danish",
    name: "Moh. Danish",
    role: "Senior SEO Strategist & Search Intelligence",
    exp: "Search Specialist",
    specialty: "Technical SEO Audits, High-Authority Outreach, GEO Ranking & Local 3-Pack",
    image: mohDanishPhoto,
    department: "Organic Search & SEO",
    bio: "Leading advanced semantic SEO, Google AI Overview optimization, and local map-pack dominance for regional and pan-India enterprises.",
    status: "active",
    order: 3,
  },
  {
    id: "team-mohasin-ahmed",
    name: "Mohasin Ahmed",
    role: "Creative Brand Director & UI/UX Lead",
    exp: "Creative Lead",
    specialty: "High-Conversion Creatives, Visual Identities, Motion Design & UI Systems",
    image: mohasinAhmedPhoto,
    department: "Creative & Brand Design",
    bio: "Translating brand values into memorable visual aesthetics, high-converting social creative systems, and modern corporate identities.",
    status: "active",
    order: 4,
  },
];

const STORAGE_KEY = "digibasera_stored_team_members";

export const loadStoredTeamMembers = (): CoreTeamMember[] => {
  if (typeof window === "undefined") return DEFAULT_TEAM_MEMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_TEAM_MEMBERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_TEAM_MEMBERS;
  } catch (e) {
    console.error("Failed to load stored team members from localStorage", e);
    return DEFAULT_TEAM_MEMBERS;
  }
};

export const saveTeamMembers = (members: CoreTeamMember[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    window.dispatchEvent(new Event("digibasera_team_updated"));
  } catch (e) {
    console.error("Failed to save team members to localStorage", e);
  }
};

export const resetTeamMembersToFactoryDefaults = (): CoreTeamMember[] => {
  if (typeof window === "undefined") return DEFAULT_TEAM_MEMBERS;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("digibasera_team_updated"));
  } catch (e) {
    console.error("Failed to reset team members", e);
  }
  return DEFAULT_TEAM_MEMBERS;
};
