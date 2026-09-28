import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  Quote,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  X,
  ShieldCheck,
  Building,
} from "lucide-react";
import { loadStoredTestimonials, StoredTestimonialItem } from "../data/testimonialsData";

interface TestimonialsSectionProps {
  onOpenConsultation: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onOpenConsultation }) => {
  const [testimonials, setTestimonials] = useState<StoredTestimonialItem[]>(() => {
    return loadStoredTestimonials().filter((t) => t.status !== "hidden");
  });

  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isTrackHovered, setIsTrackHovered] = useState<boolean>(false);
  const [selectedReview, setSelectedReview] = useState<StoredTestimonialItem | null>(null);

  useEffect(() => {
    const handleStorage = () => {
      setTestimonials(loadStoredTestimonials().filter((t) => t.status !== "hidden"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const testimonialsList = useMemo(() => {
    const list = testimonials.length > 0 ? testimonials : loadStoredTestimonials();
    return list.filter((t) => t.status !== "hidden");
  }, [testimonials]);

  // Ensure we have at least 10 items for seamless infinite 1-line loop across desktop and ultrawide monitors
  const singleLineItems = useMemo(() => {
    if (testimonialsList.length === 0) return [];
    let expanded = [...testimonialsList];
    while (expanded.length < 10) {
      expanded = [...expanded, ...testimonialsList];
    }
    return expanded;
  }, [testimonialsList]);

  const isPaused = isTrackHovered || hoveredCardId !== null;

  const renderCard = (item: StoredTestimonialItem, uniqueKey: string) => {
    const isHovered = hoveredCardId === uniqueKey;

    return (
      <div
        key={uniqueKey}
        onMouseEnter={() => setHoveredCardId(uniqueKey)}
        onMouseLeave={() => setHoveredCardId(null)}
        onClick={() => setSelectedReview(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setSelectedReview(item);
          }
        }}
        className={`w-[340px] sm:w-[400px] shrink-0 p-5 sm:p-6 rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden text-left select-none ${
          isHovered
            ? "border-[#D4AF37] shadow-[0_16px_36px_-8px_rgba(212,175,55,0.22)] -translate-y-1"
            : "border-[#E8E1D0] shadow-[0_4px_20px_-4px_rgba(17,17,17,0.04)] hover:border-[#D4AF37]/60"
        }`}
      >
        {/* Subtle top gold accent on card hover */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        <div>
          {/* Rating Stars & Industry Tag */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {[...Array(item.rating || 5)].map((_, s) => (
                <Star key={s} className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              ))}
              <span className="text-xs font-bold text-[#111111] ml-1.5 font-fonarto">5.0</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A7B16] bg-[#FAF8F2] px-3 py-0.5 rounded-full border border-[#E8E1D0]">
              {item.industry}
            </span>
          </div>

          {/* Verified Metric Highlight Box */}
          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#D4AF37]/40 text-xs sm:text-sm font-bold text-[#6D4805] flex items-center gap-2.5 mb-3.5 shadow-2xs font-fonarto">
            <div className="w-5 h-5 rounded-full bg-[#D4AF37]/25 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-[#9A7B16]" />
            </div>
            <span className="truncate font-fonarto">{item.metricHighlight}</span>
          </div>

          {/* Quote Text - High Legibility */}
          <p className="text-base font-medium text-[#111111] leading-relaxed line-clamp-3 mb-3">
            "{item.quote}"
          </p>
        </div>

        {/* Author Info & Verified Tag */}
        <div className="mt-4 pt-3.5 border-t border-[#E8E1D0] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar Image or Initials Badge */}
            {item.avatarUrl ? (
              <img
                loading="lazy"
                decoding="async"
                src={item.avatarUrl}
                alt={item.clientName}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37] shrink-0 shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#111111] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                {item.clientName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm sm:text-base font-bold text-[#111111] font-heading truncate">
                  {item.clientName}
                </h4>
                <span title="Verified Review" className="inline-flex shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#9A7B16] shrink-0" />
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#444444] truncate">
                {item.role}, <span className="font-bold text-[#111111]">{item.company}</span>
              </p>
            </div>
          </div>
          <Quote className="w-5 h-5 text-[#D4AF37]/35 shrink-0 ml-2" />
        </div>
      </div>
    );
  };

  return (
    <section
      className="relative py-16 sm:py-20 bg-[#FAF9F5] border-y border-[#E8E1D0] overflow-hidden select-none"
      id="testimonials-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E1D0] text-[#9A7B16] text-xs font-bold uppercase tracking-widest mb-3 font-heading shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>CLIENT REVIEWS & SUCCESS STORIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111111] font-heading font-fonarto tracking-tight">
            <span className="requested-fonarto-heading">Trusted by Clients Across</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9A7B16] via-[#D4AF37] to-[#C9A227] italic font-serif">
              Industries
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#555555] mt-3 leading-relaxed">
            See how our performance marketing, SEO architecture, and high-conversion web development
            transformed bottom-line revenue for founders and corporate brands.
          </p>
        </motion.div>
      </div>

      {/* 1-Line Continuous Auto-Scrolling Track (Auto pauses on hover for comfortable reading) */}
      <div
        className="relative w-full overflow-hidden py-4 my-2 group"
        onMouseEnter={() => setIsTrackHovered(true)}
        onMouseLeave={() => {
          setIsTrackHovered(false);
          setHoveredCardId(null);
        }}
      >
        {/* Left & Right Soft Fade Gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#FAF9F5] via-[#FAF9F5]/90 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#FAF9F5] via-[#FAF9F5]/90 to-transparent z-20" />

        {/* 1-Line Seamless Continuous Track */}
        <div className="overflow-hidden w-full">
          <div
            className="flex shrink-0 w-max animate-marquee-testimonials group-hover:[animation-play-state:paused]"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
              animationDuration: "62s",
            }}
          >
            {/* Set 1 */}
            <div className="flex shrink-0 items-stretch gap-5 pr-5">
              {singleLineItems.map((item, idx) => renderCard(item, `line-s1-${item.id}-${idx}`))}
            </div>
            {/* Set 2 (Exact Duplicate for continuous infinite loop) */}
            <div className="flex shrink-0 items-stretch gap-5 pr-5" aria-hidden="true">
              {singleLineItems.map((item, idx) => renderCard(item, `line-s2-${item.id}-${idx}`))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Snapshot & Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-2xl bg-[#111111] border border-[#D4AF37] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Quote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                690+ Brands Partnered • 98% Client Retention
              </h3>
              <p className="text-xs text-[#E8E1D0] mt-0.5">
                Join our roster of high-growth businesses scaling with transparent data and
                dedicated growth strategists.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenConsultation}
            className="px-6 py-3 rounded-lg bg-[#D4AF37] hover:bg-[#C9A227] text-[#111111] text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 shrink-0 font-heading cursor-pointer"
          >
            <span>Start Your Success Story</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Full Testimonial Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl border border-[#D4AF37] shadow-2xl p-6 sm:p-7 relative overflow-hidden"
            >
              {/* Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#9A7B16] via-[#D4AF37] to-[#C9A227]" />

              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#FAF8F2] hover:bg-[#E8E1D0] flex items-center justify-center text-[#555555] hover:text-[#111111] transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9A7B16] bg-[#FAF8F2] px-2.5 py-0.5 rounded border border-[#E8E1D0]">
                  {selectedReview.industry}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(selectedReview.rating || 5)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                </div>
              </div>

              {/* Metric Callout */}
              <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#D4AF37]/40 text-xs font-bold text-[#7E580A] flex items-center gap-2.5 mb-4">
                <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[#9A7B16]" />
                </div>
                <span>{selectedReview.metricHighlight}</span>
              </div>

              {/* Full Quote */}
              <div className="relative my-4 pl-4 border-l-2 border-[#D4AF37]">
                <p className="text-base text-[#222222] leading-relaxed">
                  "{selectedReview.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 mt-4 border-t border-[#E8E1D0] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedReview.avatarUrl ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={selectedReview.avatarUrl}
                      alt={selectedReview.clientName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#111111] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center font-bold text-sm shrink-0">
                      {selectedReview.clientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-[#111111] font-heading flex items-center gap-1.5">
                      <span>{selectedReview.clientName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#9A7B16]" />
                    </h4>
                    <p className="text-xs text-[#666666]">
                      {selectedReview.role},{" "}
                      <span className="font-semibold text-[#111111]">{selectedReview.company}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action in modal */}
              <div className="mt-6 pt-4 border-t border-[#E8E1D0] flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedReview(null);
                    onOpenConsultation();
                  }}
                  className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-lg bg-[#D4AF37] hover:bg-[#C9A227] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm font-heading cursor-pointer"
                >
                  <span>Get Similar Results for My Business</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-lg bg-[#FAF8F2] hover:bg-[#E8E1D0] text-[#555555] text-xs font-bold tracking-wider transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
