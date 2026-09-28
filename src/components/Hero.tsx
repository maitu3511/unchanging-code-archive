import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  Star,
  Check,
  Award,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight,
  Globe,
  Flame,
  Search,
  MousePointerClick,
  Code2,
  ShoppingBag,
  Share2,
} from "lucide-react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { HomeHeroBackground } from "./HomeHeroBackground";
import { AGENCY_CONFIG } from "../data/agencyData";
import { getWhatsAppUrl } from "../utils/whatsapp";
import homeHero from "../assets/heroes/home-hero.jpg";
import heroAgencyCommandImg from "../assets/images/agency-cursor-reveal.jpg.asset.json";

// Dynamic Services List with Concise 1-Line Titles, Icons, Tags, and Live Impact Metrics
const HERO_SERVICES = [
  {
    title: "SEO & Page 1 Google Rankings",
    short: "SEO Dominance",
    icon: Search,
    metric: "+350% Traffic Lift",
    tag: "Rank 1 Organic",
  },
  {
    title: "High-Performance Web Design",
    short: "Web Development",
    icon: Code2,
    metric: "0.65s Fluid Load Speed",
    tag: "Core Web Vitals",
  },
  {
    title: "Google & Meta High-ROAS Ads",
    short: "Performance Ads",
    icon: TrendingUp,
    metric: "8.4x Verified ROAS",
    tag: "Conversion-Ready",
  },
  {
    title: "Shopify E-Commerce Stores",
    short: "E-Commerce",
    icon: ShoppingBag,
    metric: "+210% Checkout Rate",
    tag: "Revenue Engine",
  },
  {
    title: "Social Media Brand Growth",
    short: "Social Marketing",
    icon: Share2,
    metric: "10M+ Impressions",
    tag: "Viral Community",
  },
  {
    title: "Local SEO & Inbound Leads",
    short: "Local Lead Gen",
    icon: MousePointerClick,
    metric: "3x Phone Call Volume",
    tag: "Saurashtra #1",
  },
  {
    title: "360° Digital Growth Strategy",
    short: "360° Growth",
    icon: Zap,
    metric: "98% Client Retention",
    tag: "Proven ROI",
  },
];

interface HeroProps {
  onOpenConsultation: () => void;
  onNavigateToServices: () => void;
  onNavigateToTraining: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenConsultation,
  onNavigateToServices,
  onNavigateToTraining,
}) => {
  // Pre-initialize with first service so text shows instantly on open with zero blank delay
  const [displayText, setDisplayText] = useState(HERO_SERVICES[0].title);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState(2500);
  const revealRef = useRef<HTMLDivElement>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealImageUrl = `https://project--${heroAgencyCommandImg.project_id}.lovable.app${heroAgencyCommandImg.url}`;

  // Keep the reveal centred on the cursor or touch point, without intercepting the hero.
  const showHeroReveal = (target: HTMLElement, clientX: number, clientY: number) => {
    const reveal = revealRef.current;
    if (!reveal) return;
    const bounds = target.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;
    reveal.style.setProperty("--reveal-x", `${x}px`);
    reveal.style.setProperty("--reveal-y", `${y}px`);
    reveal.style.opacity = "1";
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
  };

  const hideHeroReveal = () => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (revealRef.current) revealRef.current.style.opacity = "0";
  };

  const finishTouchReveal = () => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    revealTimerRef.current = setTimeout(hideHeroReveal, 1800);
  };

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    };
  }, []);

  // Typewriter effect: types letter-by-letter, pauses, deletes, and cycles through services
  useEffect(() => {
    const currentFullText = HERO_SERVICES[serviceIndex].title;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing characters forward
        const nextText = currentFullText.substring(0, displayText.length + 1);
        setDisplayText(nextText);
        setTypingSpeed(70);

        if (nextText === currentFullText) {
          // Finished typing word, pause so user can comfortably read it
          setTypingSpeed(2400);
          setIsDeleting(true);
        }
      } else {
        // Erasing characters backward
        const nextText = currentFullText.substring(0, displayText.length - 1);
        setDisplayText(nextText);
        setTypingSpeed(35);

        if (nextText === "") {
          // Finished erasing, move to next service
          setIsDeleting(false);
          setServiceIndex((prev) => (prev + 1) % HERO_SERVICES.length);
          setTypingSpeed(350); // Brief pause before starting next word
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, serviceIndex, typingSpeed]);

  const currentService = HERO_SERVICES[serviceIndex];
  const CurrentIcon = currentService.icon;

  return (
    <section
      className="relative pt-[72px] sm:pt-[78px] pb-16 lg:pt-[82px] lg:pb-24 overflow-hidden bg-[#FAF9F5] text-[#111111] border-b border-[#E8E1D0] isolate"
      id="hero-section"
      onPointerMove={(event) => {
        if (event.pointerType !== "touch") showHeroReveal(event.currentTarget, event.clientX, event.clientY);
      }}
      onWheel={(event) => showHeroReveal(event.currentTarget, event.clientX, event.clientY)}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (touch) showHeroReveal(event.currentTarget, touch.clientX, touch.clientY);
      }}
      onTouchMove={(event) => {
        const touch = event.touches[0];
        if (touch) showHeroReveal(event.currentTarget, touch.clientX, touch.clientY);
      }}
      onTouchEnd={finishTouchReveal}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") hideHeroReveal();
      }}
      onPointerCancel={(event) => {
        if (event.pointerType !== "touch") hideHeroReveal();
      }}
    >
      {/* Background Image with Ken Burns / Zoom Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-20">
        <img
          loading="eager"
          fetchPriority="high"
          decoding="async"
          src={homeHero}
          alt="DigiBasera Digital Growth & Performance Marketing"
          className="w-full h-full object-cover object-center animate-hero-zoom opacity-20 mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-[#FAF9F5]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-85" />
      </div>

      {/* Ambient Warm Golden Depth Glows with Breathing Animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] sm:w-[960px] h-[400px] bg-[#D4AF37]/15 rounded-full blur-[110px] pointer-events-none -z-10 animate-pulse duration-1000" />
      <div className="absolute top-8 left-8 w-72 h-72 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-8 right-8 w-80 h-80 bg-[#D4AF37]/12 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Dynamic Cyber-Matrix & Concentric Core Animation Background */}
      <HomeHeroBackground />

      {/* Interactive Cursor & Scroll Image Reveal: Reveals the futuristic digital agency command center without affecting text or buttons */}
      <div
        ref={revealRef}
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-0 transition-opacity duration-300 ease-out motion-reduce:transition-none [mask-image:radial-gradient(circle_190px_at_var(--reveal-x,-600px)_var(--reveal-y,-600px),black_65%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_190px_at_var(--reveal-x,-600px)_var(--reveal-y,-600px),black_65%,transparent_100%)] sm:[mask-image:radial-gradient(circle_320px_at_var(--reveal-x,-600px)_var(--reveal-y,-600px),black_65%,transparent_100%)] sm:[-webkit-mask-image:radial-gradient(circle_320px_at_var(--reveal-x,-600px)_var(--reveal-y,-600px),black_65%,transparent_100%)]"
      >
        <img
          src={revealImageUrl}
          alt="Futuristic digital agency workspace"
          className="w-full h-full object-cover object-center filter brightness-110 contrast-110 saturate-125"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Keep the moving image visible around the text while retaining a light reading surface beneath it. */}
      <div aria-hidden="true" className="absolute inset-0 z-[2] pointer-events-none bg-radial from-white/80 via-white/45 to-transparent [background-size:90%_80%] bg-no-repeat [background-position:center]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 z-10">
        {/* Top Eyebrow Badge: Rating & Google Partner */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/95 border border-[#E8E1D0] shadow-xs backdrop-blur-md text-sm hover:border-[#D4AF37] transition-all">
            <span className="flex items-center gap-1.5 text-[#D4AF37]">
              <Star className="w-4 h-4 fill-[#D4AF37]" />
              <span className="text-[#111111] font-semibold font-fonarto text-sm">4.9/5</span>
            </span>
            <span className="text-[#E8E1D0]">|</span>
            <span className="text-[#9A7B16] font-medium tracking-wide text-xs sm:text-sm flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#D4AF37]" />
              <span>Best Digital Marketing Agency in Rajkot</span>
            </span>
            <span className="text-[#E8E1D0] hidden sm:inline">|</span>
            <span className="text-[#2B3441] text-xs sm:text-sm font-normal hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              Google & Meta Certified Partner
            </span>
          </div>
        </motion.div>

        {/* Main Centered Headline with Smooth Typewriter Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4 max-w-5xl mx-auto"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111111] font-fonarto hero-title leading-[1.18]">
            <span className="block mb-2 sm:mb-3">Transforming Brands Through High-Converting</span>

            {/* Typewriter Dynamic Service Box - Locked Fixed Height to prevent any layout shift (CLS) */}
            <div className="relative h-16 sm:h-20 lg:h-24 flex items-center justify-center my-2 sm:my-3 select-none">
              <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3.5 text-center max-w-full px-2">
                {/* Dynamic Animated Icon Badge */}
                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white border border-[#D4AF37]/50 shadow-[0_4px_16px_rgba(212,175,55,0.22)] text-[#D4AF37] shrink-0 self-center">
                  <CurrentIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#9A7B16]" />
                </span>

                {/* Typewriter Text with Upright Crisp Contrast & Non-Breaking Space Protection */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9A7B16] via-[#B8860B] to-[#9A7B16] font-extrabold not-italic text-2xl sm:text-4xl md:text-5xl lg:text-[3.2rem] tracking-tight drop-shadow-xs whitespace-nowrap">
                  {displayText || "\u00A0"}
                </span>

                {/* Blinking Typewriter Gold Cursor */}
                <span className="inline-block w-[3px] sm:w-[4px] h-[0.8em] bg-[#D4AF37] ml-0.5 sm:ml-1.5 align-middle animate-pulse rounded-full shadow-[0_0_12px_rgba(212,175,55,0.9)] shrink-0" />
              </div>
            </div>
          </h1>

          {/* Dynamic Service Accelerator - Outside: "Accelerating:", Inside Black Box: Dynamic Service Transition */}
          <div className="min-h-10 flex flex-wrap items-center justify-center gap-2.5 pt-1.5">
            <span className="text-sm sm:text-base font-medium tracking-wide text-[#9A7B16] font-heading flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Accelerating:</span>
            </span>

            <div className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full bg-[#111111] text-white shadow-md border border-[#D4AF37]/60 min-h-[38px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={serviceIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2.5"
                >
                  <CurrentIcon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-[#F5D77F] font-normal tracking-wide font-fonarto text-sm sm:text-base">
                    {currentService.title}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Centered Value Proposition Subtitle with High Contrast Readability */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-[#2B3441] max-w-3xl mx-auto font-medium leading-relaxed"
        >
          Rajkot&apos;s leading digital marketing and web development agency. We engineer custom,
          fast-loading web applications, dominate competitive Google search rankings, and deploy
          high-ROAS Google and Meta ad funnels that deliver verifiable commercial revenue.
        </motion.p>

        {/* Floating Kinetic Metric Cards & Badges Grid (Matebiz High-Impact Visuals) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-2 max-w-4xl mx-auto">
          {[
            {
              title: "+350% Traffic Growth",
              subtitle: "Average SEO Rank Lift",
              icon: TrendingUp,
              accent: "text-[#9A7B16] bg-[#FAF8F2] border-[#D4AF37]/40",
            },
            {
              title: "Page 1 Google Rankings",
              subtitle: "High-Intent Keywords",
              icon: Search,
              accent: "text-[#0A66C2] bg-[#F0F7FF] border-[#0A66C2]/30",
            },
            {
              title: "99.8% Speed Score",
              subtitle: "Conversion-Ready UX",
              icon: Zap,
              accent: "text-amber-600 bg-amber-50 border-amber-300",
            },
            {
              title: "98% Client Retention",
              subtitle: "10+ Years Trust",
              icon: ShieldCheck,
              accent: "text-emerald-700 bg-emerald-50 border-emerald-300",
            },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.28 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-3.5 rounded-xl border ${stat.accent} shadow-xs text-left backdrop-blur-xs flex items-center gap-3 transition-shadow duration-300 hover:shadow-[0_12px_28px_-6px_rgba(212,175,55,0.18)] cursor-default`}
              >
                <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-inherit flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-inherit" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-semibold text-[#111111] font-heading leading-tight">
                    {stat.title}
                  </div>
                  <div className="text-xs sm:text-sm text-[#4B5563] font-normal leading-tight mt-0.5">
                    {stat.subtitle}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Centered CTA Buttons with Smooth Glow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-3.5 pt-3"
        >
          <button
            onClick={onOpenConsultation}
            className="btn-sheen px-8 py-3.5 rounded-md bg-[#111111] hover:bg-[#222222] text-white font-medium text-sm sm:text-[15px] uppercase tracking-wider border border-[#D4AF37] shadow-[0_4px_20px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.45)] active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5 group"
            id="hero-cta-quote"
          >
            <span>Request Free Proposal & Audit</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>

          <a
            href={getWhatsAppUrl(
              "Hello Digibasera, I saw your agency portfolio and would like to get a free proposal for my business website and digital marketing.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-md bg-white hover:bg-[#F8F8F6] text-[#111111] border border-[#E8E1D0] hover:border-[#D4AF37] font-medium text-sm sm:text-[15px] uppercase tracking-wider shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5"
            id="hero-cta-whatsapp"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <span>Chat on WhatsApp</span>
          </a>
        </motion.div>

        {/* Centered Trust Proof Badges (Clutch, Google, GoodFirms, Zinmatt) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-6 border-t border-[#E8E1D0] flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 text-sm"
        >
          {/* Clutch Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#E8E1D0] shadow-sm hover:border-[#D4AF37] transition-colors">
            <span className="font-semibold text-[#111111] tracking-tight text-sm">Clutch</span>
            <div className="flex items-center text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
              ))}
            </div>
            <span className="font-medium text-sm text-[#111111] font-fonarto">5.0</span>
            <span className="text-xs sm:text-sm text-[#555555] font-normal">(50+ Reviews)</span>
          </div>

          {/* Google Partner Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#E8E1D0] shadow-sm hover:border-[#D4AF37] transition-colors">
            <span className="font-medium text-[#111111] text-sm flex items-center gap-1">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
              <span className="text-[#555555] font-normal ml-0.5">Partner</span>
            </span>
            <span className="text-xs sm:text-sm text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Certified
            </span>
          </div>

          {/* GoodFirms Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#E8E1D0] shadow-sm hidden sm:flex">
            <span className="font-semibold text-[#111111] text-sm">GoodFirms</span>
            <span className="text-xs sm:text-sm text-[#9A7B16] font-medium">5.0 ★ Top Agency</span>
          </div>

          {/* Zinmatt Partner Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#D4AF37]/50 shadow-sm hidden md:flex">
            <Award className="w-4 h-4 text-[#9A7B16]" />
            <span className="font-medium text-sm text-[#111111]">Zinmatt Associate Partner</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
