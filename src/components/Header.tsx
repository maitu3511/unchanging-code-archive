import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { DigiBaseraLogo } from "./DigiBaseraLogo";
import { PageTopProgressBar } from "./motion/MotionReveal";
import { PageType } from "../types";
import { loadStoredSiteSettings, SiteSettings } from "../data/siteSettingsData";

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onOpenConsultation: (prefillCategory?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onOpenConsultation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => loadStoredSiteSettings());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setSiteSettings(loadStoredSiteSettings());
    };
    window.addEventListener("digibasera_settings_updated", handleSettingsUpdate);
    return () => window.removeEventListener("digibasera_settings_updated", handleSettingsUpdate);
  }, []);

  const navItems: { id: PageType; label: string; badge?: string; isSpecial?: boolean }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Service" },
    { id: "pricing", label: "Pricing" },
    { id: "portfolio", label: "Portfolio" },
    { id: "training", label: "Education", badge: "Free 90D", isSpecial: true },
    { id: "careers", label: "Career" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageTopProgressBar />
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 font-fonarto transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#E8E1D0] py-2.5 shadow-[0_4px_30px_-5px_rgba(212,175,55,0.12)]"
            : "bg-white/90 backdrop-blur-sm py-3.5 border-b border-[#E8E1D0]/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Luxury Logo */}
            <div className="flex items-center gap-3">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("home");
                }}
                className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]"
                id="brand-logo-link"
              >
                <DigiBaseraLogo variant="light" size="md" showTagline={true} />
              </a>
            </div>

            {/* Desktop Navigation Links with Fonarto Typography */}
            <nav className="hidden lg:flex items-center gap-1 font-fonarto">
              {navItems.map((item) => {
                const isActive =
                  currentPage === item.id ||
                  (item.id === "training" && currentPage === "education");
                return (
                  <a
                    key={item.id}
                    href={
                      item.id === "home"
                        ? "/"
                        : item.id === "services"
                          ? "/services"
                          : `/${item.id}`
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      handleNavClick(item.id);
                    }}
                    className={`px-3.5 py-2 rounded-lg font-fonarto text-[14.5px] font-semibold tracking-wide transition-all relative flex items-center gap-1.5 ${
                      isActive
                        ? "text-[#111111] font-bold"
                        : item.isSpecial
                          ? "text-[#9A7B16] hover:text-[#111111] font-bold"
                          : "text-[#2D3748] hover:text-[#111111]"
                    }`}
                    id={`nav-link-${item.id}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 rounded-lg bg-[#FAF9F5] border border-[#D4AF37] shadow-2xs -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 font-fonarto">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`relative z-10 font-fonarto text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          item.isSpecial
                            ? "bg-[#D4AF37] text-[#111111]"
                            : "bg-[#111111] text-[#D4AF37]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right Action CTA Buttons with Fonarto Typography */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => onOpenConsultation("Comprehensive Growth Strategy")}
                className="btn-sheen relative group overflow-hidden px-4.5 py-2 rounded-lg bg-[#111111] hover:bg-[#222222] text-white font-fonarto text-xs tracking-wider uppercase font-bold border border-[#D4AF37] shadow-sm hover:shadow-[0_4px_18px_rgba(212,175,55,0.3)] transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
                id="header-consultation-cta"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] group-hover:rotate-12 transition-transform duration-300" />
                <span className="font-fonarto">Get Free Audit</span>
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-[#FAF9F5] text-[#111111] hover:bg-white border border-[#E8E1D0]"
                id="mobile-menu-toggle"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Drawer with Smooth Animated Entry/Exit */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="lg:hidden pt-4 pb-3 border-t border-[#E8E1D0] mt-3 space-y-2 max-h-[80vh] overflow-y-auto overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-1">
                  {navItems.map((item) => {
                    const isActive =
                      currentPage === item.id ||
                      (item.id === "training" && currentPage === "education");
                    return (
                      <a
                        key={item.id}
                        href={
                          item.id === "home"
                            ? "/"
                            : item.id === "services"
                              ? "/services"
                              : `/${item.id}`
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          handleNavClick(item.id);
                        }}
                        className={`w-full px-3.5 py-3 rounded-xl font-fonarto text-[13px] uppercase tracking-wider font-bold text-left flex items-center justify-between transition-colors min-h-[44px] ${
                          isActive
                            ? "bg-[#111111] text-[#D4AF37]"
                            : "bg-[#FAF9F5] text-[#333333] hover:bg-[#F0EEE6]"
                        }`}
                      >
                        <span className="font-fonarto">{item.label}</span>
                        {item.badge && (
                          <span className="font-fonarto text-xs bg-white/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-bold">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenConsultation("Mobile Header Free Audit");
                    }}
                    className="w-full py-3 rounded-xl bg-[#111111] text-[#D4AF37] border border-[#D4AF37] font-fonarto text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] shadow-sm active:scale-[0.98] transition-transform"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-fonarto">Request Free Growth Audit</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};
