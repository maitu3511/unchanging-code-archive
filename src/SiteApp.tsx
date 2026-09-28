import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { AboutPage } from "./pages/AboutPage";
import { PricingPage } from "./pages/PricingPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ProcessPage } from "./pages/ProcessPage";
import { CareersPage } from "./pages/CareersPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminPage } from "./pages/AdminPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { AreasWeServePage } from "./pages/AreasWeServePage";
import { TrainingPage } from "./components/TrainingPage";
import { ServiceModal } from "./components/ServiceModal";
import { VisitorLeadPopup } from "./components/VisitorLeadPopup";
import { TermsModal, PrivacyModal, RefundModal } from "./components/CompanyModals";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { FloatingBottomDock } from "./components/FloatingBottomDock";
import { CustomCursor } from "./components/CustomCursor";
import { SEOHead } from "./components/SEOHead";
import { PAGE_SEO_CONFIG } from "./data/seoData";
import { AnimationProvider } from "./context/AnimationContext";
import {
  getServiceRoute,
  getServiceCanonical,
  getServiceSchema,
  getServiceBreadcrumbSchema,
} from "./data/serviceRoutes";
import { ServiceLandingPage } from "./pages/ServiceLandingPage";
import { PageType, ServiceItem, ServiceCategory } from "./types";
import { preloadSiteImages } from "./utils/imagePreloader";
import { PageTopProgressBar } from "./components/motion/MotionReveal";

export interface SiteAppProps {
  /** When rendered from a dedicated SEO route (e.g. /services/seo) */
  initialPage?: PageType;
  initialCategorySlug?: string;
  initialSubServiceId?: string;
  serviceRouteSlug?: string;
  seoOverride?: {
    title: string;
    description: string;
    canonical: string;
    keywords: string;
  };
}

export default function App(props: SiteAppProps = {}) {
  return (
    <AnimationProvider>
      <AppContent {...props} />
    </AnimationProvider>
  );
}

function AppContent({
  initialPage,
  initialCategorySlug,
  initialSubServiceId,
  serviceRouteSlug,
  seoOverride,
}: SiteAppProps) {
  const isStandaloneRoute = Boolean(initialPage);
  const [currentPage, setCurrentPage] = useState<PageType>(initialPage || "home");

  // Service Detail Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  // Consultation & Lead Modal State
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [consultationService, setConsultationService] = useState<string>(
    "Comprehensive Growth Strategy",
  );
  const [consultationBudget, setConsultationBudget] = useState<number | undefined>(undefined);
  const [consultationIndustry, setConsultationIndustry] = useState<string | undefined>(undefined);

  // Company Legal Modals State
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isRefundOpen, setIsRefundOpen] = useState<boolean>(false);

  // Navigation targeted state
  const [portfolioCategory, setPortfolioCategory] = useState<string>("All");
  const [serviceTargetId, setServiceTargetId] = useState<string | null>(null);

  useEffect(() => {
    // Global listener for inquiry modal
    const handleInquiryEvent = (e?: Event) => {
      const customEvt = e as CustomEvent<{ serviceName?: string }>;
      handleOpenConsultation(customEvt?.detail?.serviceName);
    };

    window.addEventListener("open-inquiry-modal", handleInquiryEvent);
    window.addEventListener("open-visitor-lead-popup", handleInquiryEvent);
    window.addEventListener("open-consultation-modal", handleInquiryEvent);

    (window as unknown as { openInquiryModal: typeof handleOpenConsultation }).openInquiryModal =
      handleOpenConsultation;

    return () => {
      window.removeEventListener("open-inquiry-modal", handleInquiryEvent);
      window.removeEventListener("open-visitor-lead-popup", handleInquiryEvent);
      window.removeEventListener("open-consultation-modal", handleInquiryEvent);
    };
  }, []);

  // Sync hash routing on mount and hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      const validPages: PageType[] = [
        "home",
        "about",
        "services",
        "portfolio",
        "pricing",
        "training",
        "careers",
        "blog",
        "process",
        "contact",
        "admin",
        "terms",
        "privacy",
        "areas-we-serve",
      ];
      if (hash === "privacy" || hash === "privacypolicy" || hash === "privacy-policy") {
        setCurrentPage("privacy");
      } else if (
        hash === "terms" ||
        hash === "termsandconditions" ||
        hash === "terms-and-conditions"
      ) {
        setCurrentPage("terms");
      } else if (
        hash === "areas-we-serve" ||
        hash === "areasweserve" ||
        hash === "areas_we_serve"
      ) {
        setCurrentPage("areas-we-serve");
      } else if (hash === "refund" || hash === "refund-policy") {
        setIsRefundOpen(true);
      } else if (validPages.includes(hash as PageType)) {
        setCurrentPage(hash as PageType);
      }
    };

    if (window.location.hash) {
      // Preserve old shared links while canonical page links use real paths.
      const oldPage = window.location.hash.slice(1).toLowerCase();
      if (oldPage && PAGE_SEO_CONFIG[oldPage] && oldPage !== "admin") {
        window.history.replaceState(null, "", `/${oldPage}`);
        setCurrentPage(oldPage as PageType);
      } else if (!isStandaloneRoute) {
        handleHashChange();
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    const handleHistoryChange = () => {
      const path = window.location.pathname.slice(1);
      if (path === "" || path === "services" || PAGE_SEO_CONFIG[path]) {
        setCurrentPage((path || "home") as PageType);
      }
    };
    window.addEventListener("popstate", handleHistoryChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHistoryChange);
    };
  }, [isStandaloneRoute]);

  const handleNavigate = (page: PageType) => {
    if (page !== "services") {
      setServiceTargetId(null);
    }
    // Use an address per page so links can be opened directly and indexed.
    if (page !== "admin" && isStandaloneRoute) {
      if (page === "services") {
        window.location.href = "/services";
      } else {
        window.location.href = page === "home" ? "/" : `/${page}`;
      }
      return;
    }
    setCurrentPage(page);
    if (page !== "admin") {
      const path = page === "home" ? "/" : `/${page}`;
      window.history.pushState(null, "", path);
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateService = (serviceId: string) => {
    const targetPayload = `${serviceId}#${Date.now()}`;
    if (isStandaloneRoute) {
      window.location.href = `/services`;
      return;
    }
    setServiceTargetId(targetPayload);
    setCurrentPage("services");
    window.history.pushState(null, "", "/services");
  };

  const handleNavigatePortfolio = (category: "Websites" | "SEO" | "All") => {
    if (isStandaloneRoute) {
      window.location.href = "/portfolio";
      return;
    }
    setPortfolioCategory(category);
    setCurrentPage("portfolio");
    window.history.pushState(null, "", "/portfolio");
    setTimeout(() => {
      const el = document.getElementById("portfolio-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 150);
  };

  const handleOpenConsultation = (serviceName?: string, budget?: number, industry?: string) => {
    setConsultationService(serviceName || "Comprehensive Growth Strategy");
    setConsultationBudget(budget);
    setConsultationIndustry(industry);
    setIsConsultationOpen(true);
  };

  const handleSelectService = (service: ServiceItem, category: ServiceCategory) => {
    // Navigate to services page and scroll smoothly directly to the clicked service
    const targetPayload = `${category.id}:${service.id}#${Date.now()}`;
    setServiceTargetId(targetPayload);
    setCurrentPage("services");
    if (isStandaloneRoute) {
      window.location.href = "/services";
    } else {
      window.history.pushState(null, "", "/services");
    }
  };

  // Dynamic SEO Meta based on current page
  const pageSeo = PAGE_SEO_CONFIG[currentPage] || PAGE_SEO_CONFIG.home;
  const serviceRoute = serviceRouteSlug ? getServiceRoute(serviceRouteSlug) : undefined;
  const seoMeta =
    seoOverride ||
    (serviceRoute
      ? {
          title: serviceRoute.title,
          description: serviceRoute.description,
          canonical: getServiceCanonical(serviceRoute.slug),
          keywords: serviceRoute.keywords,
        }
      : pageSeo);

  useEffect(() => {
    // Progressively warm up image cache on idle so subsequent pages open instantaneously
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (
          window as unknown as {
            requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void;
          }
        ).requestIdleCallback(preloadSiteImages, { timeout: 1200 });
      } else {
        setTimeout(preloadSiteImages, 300);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] font-sans selection:bg-[#D4AF37] selection:text-[#111111] antialiased flex flex-col justify-between">
      <PageTopProgressBar />
      {/* Dynamic SEO Meta & Structured Data */}
      <SEOHead
        currentPage={currentPage}
        title={seoMeta.title}
        description={seoMeta.description}
        canonical={seoMeta.canonical}
        keywords={seoMeta.keywords}
        serviceSchema={serviceRoute ? getServiceSchema(serviceRoute) : undefined}
        serviceBreadcrumbSchema={
          serviceRoute ? getServiceBreadcrumbSchema(serviceRoute) : undefined
        }
      />

      {/* Luxury Custom Gold Cursor */}
      <CustomCursor />

      {/* Complete Header with Navigation to All Pages */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Main Multi-Page Application Router with Smooth Page Transitions */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="w-full"
          >
            {currentPage === "home" && (
              <HomePage
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
                onSelectService={handleSelectService}
              />
            )}

            {currentPage === "services" && serviceRouteSlug && getServiceRoute(serviceRouteSlug) ? (
              <ServiceLandingPage
                service={getServiceRoute(serviceRouteSlug)!}
                onOpenConsultation={handleOpenConsultation}
              />
            ) : (
              currentPage === "services" && (
                <ServicesPage
                  onSelectService={handleSelectService}
                  onOpenConsultation={handleOpenConsultation}
                  onNavigate={handleNavigate}
                  targetServiceId={serviceTargetId}
                />
              )
            )}

            {currentPage === "portfolio" && (
              <PortfolioPage
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
                initialCategory={portfolioCategory}
              />
            )}

            {currentPage === "pricing" && (
              <PricingPage
                onOpenConsultation={handleOpenConsultation}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === "process" && (
              <ProcessPage
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
              />
            )}

            {currentPage === "about" && (
              <AboutPage onNavigate={handleNavigate} onOpenConsultation={handleOpenConsultation} />
            )}

            {currentPage === "training" && (
              <TrainingPage
                onOpenEnquiryModal={(course) =>
                  handleOpenConsultation(
                    course ? `Training Course: ${course}` : "Training Counseling",
                  )
                }
                onSwitchToAgency={() => handleNavigate("home")}
              />
            )}

            {currentPage === "careers" && (
              <CareersPage
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
              />
            )}

            {currentPage === "blog" && (
              <BlogPage onNavigate={handleNavigate} onOpenConsultation={handleOpenConsultation} />
            )}

            {currentPage === "contact" && (
              <ContactPage
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
              />
            )}

            {currentPage === "admin" && <AdminPage onNavigate={handleNavigate} />}

            {currentPage === "terms" && (
              <TermsPage onNavigate={handleNavigate} onOpenConsultation={handleOpenConsultation} />
            )}

            {currentPage === "privacy" && (
              <PrivacyPage
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
              />
            )}

            {currentPage === "areas-we-serve" && (
              <AreasWeServePage
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Complete Footer with Full Sitemap & Contact Details */}
      <Footer
        onNavigate={handleNavigate}
        onOpenConsultation={handleOpenConsultation}
        onOpenTerms={() => handleNavigate("terms")}
        onOpenPrivacy={() => handleNavigate("privacy")}
        onNavigateService={handleNavigateService}
        onNavigatePortfolio={handleNavigatePortfolio}
      />

      {/* Floating Interactive WhatsApp Desk */}
      <FloatingWhatsApp />

      {/* Floating Bottom Quick Action Dock (Matching Images 1 & 2) */}
      <FloatingBottomDock
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Detailed Service Deep-Dive Modal */}
      <ServiceModal
        service={selectedService}
        category={selectedCategory}
        onClose={() => {
          setSelectedService(null);
          setSelectedCategory(null);
        }}
        onOpenConsultation={(serviceName) => {
          setSelectedService(null);
          setSelectedCategory(null);
          handleOpenConsultation(serviceName);
        }}
        onNavigate={(page) => handleNavigate(page as PageType)}
      />

      {/* High-Converting Golden Inquiry & Consultation Modal */}
      <VisitorLeadPopup
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        defaultService={consultationService}
        onOpenConsultation={handleOpenConsultation}
      />

      {/* Policy, Terms & Refund Modals */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <RefundModal isOpen={isRefundOpen} onClose={() => setIsRefundOpen(false)} />
    </div>
  );
}
