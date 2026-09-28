// High-Performance Instant Image Preloader for DigiBasera
// Immediately preloads and decodes critical website assets when user opens site

import homeHero from "../assets/heroes/home-hero.jpg";
import servicesHero from "../assets/heroes/services-hero.jpg";
import aboutHero from "../assets/about-agency-reference-clean.webp";
import aboutHeroJpg from "../assets/about-agency-reference-clean.jpg";
import portfolioHero from "../assets/heroes/portfolio-hero.jpg";
import contactHero from "../assets/heroes/contact-hero.jpg";
import careersHero from "../assets/heroes/careers-hero.jpg";
import careersGrowthJourney from "../assets/heroes/careers-growth-journey.webp";
import careersGrowthJourneyJpg from "../assets/heroes/careers-growth-journey.jpg";
import faqHero from "../assets/heroes/faq-hero.jpg";
import pricingHero from "../assets/heroes/pricing-hero.jpg";
import blogHero from "../assets/heroes/blog-hero.jpg";
import trainingHero from "../assets/heroes/training-hero.jpg";

import logoHorizontal from "../assets/digibasera-horizontal-logo.webp";
import logoMonogram from "../assets/digibasera-monogram-clean.webp";
import logoWordmark from "../assets/digibasera-wordmark-title.webp";
import logoWordmarkFull from "../assets/digibasera-wordmark.webp";
import founderPhoto from "../assets/founder-photo-new.webp";

// Showcase images
import img1 from "../assets/images/abfi_interior_website_1788005819260.jpg";
import img2 from "../assets/images/super_india_interior_website_1788005835222.jpg";
import img3 from "../assets/images/premium_pack_co_website_1788005849368.jpg";
import img4 from "../assets/images/diwali_festive_promo_post_1788005979732.jpg";
import img5 from "../assets/images/navratri_festive_post_1788005993964.jpg";
import img6 from "../assets/images/business_growth_promo_post_1788006007399.jpg";

import { DEFAULT_TEAM_MEMBERS } from "../data/teamData";
import { BLOG_POSTS_DATA } from "../data/blogData";

import growthPartnerTeam from "../assets/images/growth_partner_team.webp";
import growthAnalyticsHub from "../assets/images/growth_analytics_hub.webp";

const INITIAL_IMAGES = [
  // Critical branding & primary heroes
  homeHero,
  logoHorizontal,
  logoMonogram,
  logoWordmark,
  logoWordmarkFull,
  aboutHero,
  servicesHero,
  portfolioHero,
  growthPartnerTeam,
];

const DEFERRED_IMAGES = [
  aboutHeroJpg,
  careersGrowthJourney,
  careersGrowthJourneyJpg,
  contactHero,
  careersHero,
  faqHero,
  pricingHero,
  blogHero,
  trainingHero,
  founderPhoto,
  growthAnalyticsHub,
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
];

// Memory cache of preloaded Image objects to prevent browser garbage collection
const preloadedCache = new Set<string>();

/**
 * Preloads a single image and decodes it in background
 */
export function preloadImage(src: string): Promise<void> {
  if (!src || preloadedCache.has(src)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.decoding = "async";
    if ("fetchPriority" in img) {
      (img as HTMLImageElement).fetchPriority = "high";
    }

    img.onload = () => {
      preloadedCache.add(src);
      if ("decode" in img) {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };

    img.onerror = () => {
      // Resolve anyway so it never blocks the queue
      resolve();
    };
  });
}

/**
 * Executes progressive parallel preloading of entire site assets:
 * Phase 1: Critical heroes & branding immediately
 * Phase 2: Team members, portfolio images, blog images via idle callback
 */
export function preloadSiteImages(): void {
  if (typeof window === "undefined") return;

  // Phase 1: first viewport only, avoiding bandwidth contention with the hero video.
  INITIAL_IMAGES.forEach((src) => {
    preloadImage(src);
  });

  // Phase 2: Secondary assets during browser idle / next tick
  const runSecondaryPreload = () => {
    DEFERRED_IMAGES.forEach((src) => {
      preloadImage(src);
    });

    // Preload active team members
    DEFAULT_TEAM_MEMBERS.forEach((m) => {
      if (m.image) preloadImage(m.image);
    });

    // Preload blog featured images
    BLOG_POSTS_DATA.slice(0, 8).forEach((b) => {
      if (b.imageUrl) preloadImage(b.imageUrl);
    });
  };

  if ("requestIdleCallback" in window) {
    (
      window as unknown as {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void;
      }
    ).requestIdleCallback(runSecondaryPreload, { timeout: 800 });
  } else {
    setTimeout(runSecondaryPreload, 100);
  }
}
