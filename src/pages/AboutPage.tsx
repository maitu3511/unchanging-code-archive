import React, { useState, useEffect } from "react";
import { AboutHeroVisual } from "../components/AboutHeroVisual";
import { AboutSection } from "../components/AboutSection";

import { WhyChooseUs } from "../components/WhyChooseUs";
import { TrustStats } from "../components/TrustStats";
import { PageType } from "../types";
import founderFirasatPortrait from "../assets/founder-photo-new.webp";
import { loadStoredTeamMembers, CoreTeamMember } from "../data/teamData";
import {
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  Target,
  ArrowRight,
  GraduationCap,
  Quote,
  Send,
} from "lucide-react";

interface AboutPageProps {
  onNavigate: (page: PageType) => void;
  onOpenConsultation: (serviceName?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenConsultation }) => {
  const [teamMembers, setTeamMembers] = useState<CoreTeamMember[]>(() => loadStoredTeamMembers());

  useEffect(() => {
    const handleTeamUpdate = () => {
      setTeamMembers(loadStoredTeamMembers());
    };
    window.addEventListener("digibasera_team_updated", handleTeamUpdate);
    return () => window.removeEventListener("digibasera_team_updated", handleTeamUpdate);
  }, []);

  const visibleMembers = teamMembers.filter((m) => m.status !== "hidden");
  return (
    <div className="relative isolate pt-[68px] lg:pt-[72px] pb-16 bg-[#FFFFFF] text-[#111111] animate-in fade-in duration-300">
      {/* Page Hero Header with Distinctive Zoom Background */}
      <div className="relative z-10 py-10 sm:py-14 mb-8 overflow-hidden border-b border-[#E8E1D0] bg-[#FAF9F5]/85">
        <AboutHeroVisual />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-[#E8E1D0] text-[#9A7B16] text-xs font-bold uppercase tracking-widest mb-4 font-heading shadow-xs backdrop-blur-xs motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Agency Profile & Lineage</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] font-heading font-fonarto tracking-tight motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-100 motion-safe:fill-mode-backwards">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9A7B16] via-[#D4AF37] to-[#C9A227] italic font-serif">
              Digibasera
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#444444] mt-3 max-w-3xl leading-relaxed font-medium motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700 motion-safe:delay-200 motion-safe:fill-mode-backwards">
            A full-service Digital Marketing, Technology & Strategy Agency committed to turning
            digital ideas into measurable commercial pipeline and enterprise value.
          </p>
        </div>
      </div>

      {/* Main Core About Narrative */}
      <AboutSection
        onOpenConsultation={() => onOpenConsultation("Comprehensive Digital Partnership")}
        onNavigateToServices={() => onNavigate("services")}
      />

      {/* Trust Stats Bar */}
      <div className="my-16">
        <TrustStats />
      </div>

      {/* Zinmatt Association In-Depth Spotlight */}
      <section className="py-16 bg-[#111111] text-white border-y border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D4AF37] text-xs font-bold uppercase tracking-widest font-heading border border-white/10">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>Strategic Ecosystem Partnership</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold font-heading font-fonarto text-white tracking-tight">
                Official Business Associate of Zinmatt
              </h2>

              <p className="text-sm text-[#E8E1D0] leading-relaxed">
                Digibasera works in direct association with <strong>Zinmatt</strong>, combining
                cutting-edge agency execution with proven academic and professional training
                frameworks. This alliance ensures our strategies are built on standardized,
                quality-assured methodologies.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-heading block">
                    Agency Tech Standards
                  </span>
                  <p className="text-xs text-[#E8E1D0]/80">
                    Enterprise-grade tech stacks, structured sprint deliverables, and data
                    governance.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-heading block">
                    Talent & Skill Pipeline
                  </span>
                  <p className="text-xs text-[#E8E1D0]/80">
                    Continuous training on the latest generative AI, search algorithms, and paid ad
                    platforms.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate("training")}
                  className="px-6 py-3.5 rounded-lg bg-[#D4AF37] hover:bg-[#C9A227] text-[#111111] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Explore Zinmatt Training Programs</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-6 rounded-xl bg-white text-[#111111] border-2 border-[#D4AF37] shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E1D0]">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#9A7B16] font-heading">
                    Quality Benchmarks
                  </span>
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                </div>

                <ul className="space-y-3 text-xs text-[#555555]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>
                      <strong>ISO 9001:2015</strong> aligned process & service delivery framework.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Certified Google & Meta performance ad strategies.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>White-hat SEO and generative engine optimization practices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Transparent client reporting with direct attribution data.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Leadership & Core Team Showcase */}
      <section className="py-16 bg-[#F8F8F6] border-y border-[#E8E1D0]" id="team-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Executive Founder Spotlight Card */}
          <div className="mb-16 bg-white rounded-2xl border-2 border-[#D4AF37]/50 shadow-[0_15px_40px_-15px_rgba(17,17,17,0.08)] overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 items-center p-6 sm:p-10">
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37] max-w-sm w-full shadow-lg aspect-3/4">
                  <img
                    src={founderFirasatPortrait}
                    alt="Firasat Ali - Founder & CEO, Digibasera"
                    width={400}
                    height={533}
                    className="w-full h-full object-cover object-center filter brightness-100"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#111111] text-xs font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="w-3 h-3 text-[#111111]" />
                      <span>Founder & Chief Strategist</span>
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white">Firasat Ali</h3>
                    <p className="text-xs text-[#E8E1D0]/90">Digibasera Leadership</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E1D0] text-[#9A7B16] text-xs font-bold uppercase tracking-widest font-heading">
                  <Quote className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Founder's Vision & Commitment</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111111] font-heading font-fonarto tracking-tight requested-fonarto-heading">
                  Turning Digital Ambition into{" "}
                  <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#9A7B16] via-[#D4AF37] to-[#C9A227]">
                    Tangible Market Dominance
                  </span>
                </h2>

                <blockquote className="border-l-4 border-[#D4AF37] pl-4 text-sm sm:text-base text-[#444444] italic leading-relaxed">
                  "At Digibasera, our founding mission is simple yet uncompromising: to provide
                  ambitious brands with the strategic clarity, technical excellence, and aggressive
                  execution required to outperform their competition. Every campaign we launch and
                  every platform we build is engineered directly for commercial ROI."
                </blockquote>

                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                  Under Firasat Ali's leadership, Digibasera has scaled from a dedicated regional
                  consultancy into a multi-capability digital agency and official associate of
                  Zinmatt, serving high-growth brands across e-commerce, real estate, healthcare,
                  B2B manufacturing, and consumer tech.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() =>
                      onOpenConsultation("Direct Consultation with Founder Firasat Ali")
                    }
                    className="px-6 py-3.5 rounded-full bg-[#111111] hover:bg-[#222222] text-[#FAF9F5] hover:text-[#D4AF37] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 border border-[#D4AF37] shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-[#D4AF37]" />
                    <span>Consult with Firasat Ali</span>
                  </button>

                  <div className="text-xs sm:text-sm text-[#555555] font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Direct Strategist Session Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E1D0] text-[#9A7B16] text-xs font-bold uppercase tracking-widest mb-3 font-heading">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Leadership & Growth Engineers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] font-heading font-fonarto tracking-tight requested-fonarto-heading">
              Meet Our Core Team
            </h2>
            <p className="text-sm text-[#555555] mt-2">
              Cross-functional growth architects, full-stack engineers, and certified performance
              marketing specialists dedicated to accelerating your brand's digital revenue.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border-2 border-[#D4AF37] overflow-hidden shadow-lg hover:shadow-[0_15px_35px_-10px_rgba(212,175,55,0.35)] transition-all duration-300 flex flex-col group"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-[#111111]">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500 filter brightness-100"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/20 to-transparent" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37] text-[#111111] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
                      <Sparkles className="w-3 h-3 text-[#111111]" />
                      <span>{member.exp || "Core Member"}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-heading text-white">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#E8E1D0] font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="p-4 space-y-1.5 bg-white border-t-2 border-[#D4AF37]/30 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-[13px] text-[#333333] font-medium leading-relaxed line-clamp-3">
                    {member.specialty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Digibasera Section */}
      <WhyChooseUs onOpenConsultation={() => onOpenConsultation("Agency Partnership Inquiry")} />

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-[#F8F8F6] border border-[#E8E1D0] space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#111111] font-heading">
            Let's Discuss Your Growth Goals
          </h3>
          <p className="text-sm sm:text-base text-[#444444] max-w-xl mx-auto leading-relaxed">
            Schedule a 30-minute discovery call with our senior growth strategists to evaluate your
            digital roadmap.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              onClick={() => onOpenConsultation("About Us Strategy Call")}
              className="px-7 py-3.5 rounded-lg bg-[#111111] hover:bg-[#222222] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-md transition-all cursor-pointer"
            >
              <span>Schedule Strategy Call</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
            <button
              onClick={() => onNavigate("services")}
              className="px-7 py-3.5 rounded-lg bg-white hover:bg-[#F8F8F6] text-[#111111] border border-[#E8E1D0] hover:border-[#D4AF37] font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              <span>Explore Our Services</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
