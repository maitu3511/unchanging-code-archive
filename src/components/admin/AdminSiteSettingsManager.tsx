import React, { useState, useEffect } from "react";
import {
  Settings,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Bell,
  Globe,
  Share2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Save,
  Check,
} from "lucide-react";
import {
  SiteSettings,
  loadStoredSiteSettings,
  saveSiteSettings,
  resetSiteSettingsToFactoryDefaults,
  DEFAULT_SITE_SETTINGS,
} from "../../data/siteSettingsData";

export const AdminSiteSettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => loadStoredSiteSettings());
  const [activeSubTab, setActiveSubTab] = useState<
    "contact" | "announcement" | "social" | "branding"
  >("contact");
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "info";
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setSettings(loadStoredSiteSettings());
    window.addEventListener("digibasera_settings_updated", handleUpdate);
    return () => window.removeEventListener("digibasera_settings_updated", handleUpdate);
  }, []);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleFieldChange = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveSiteSettings(settings);
    setIsSaved(true);
    showToast("Website settings saved and updated across the site!");
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        "Reset all website settings (contact info, announcement, social links) back to factory defaults?",
      )
    ) {
      const defaults = resetSiteSettingsToFactoryDefaults();
      setSettings(defaults);
      setIsSaved(true);
      showToast("Reset all site settings to factory defaults", "info");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="bg-[#111111] text-white px-4 py-3 rounded-lg shadow-xl border border-[#D4AF37] flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Header & Quick Save Bar */}
      <div className="bg-white p-6 rounded-xl border border-[#E8E1D0] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              <span className="text-xs uppercase font-bold tracking-widest text-[#9A7B16] font-heading">
                Site-Wide Administration & Global Config
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#111111] font-heading mt-1">
              General Website Settings
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              Manage your official contact numbers, office address, WhatsApp message, top
              announcement banner, and social media profiles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleSaveAll()}
              className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white border border-[#D4AF37] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#D4AF37]" />
              <span>{isSaved ? "Settings Saved" : "Save All Changes"}</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F2EFE9] text-[#666666] hover:text-[#111111] border border-[#E8E1D0] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset all settings to initial defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="mt-6 pt-5 border-t border-[#E8E1D0] flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab("contact")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeSubTab === "contact"
                ? "bg-[#111111] text-[#FAF9F5] border border-[#D4AF37]"
                : "bg-[#FAF9F5] text-[#666666] border border-[#E8E1D0] hover:bg-white hover:text-[#111111]"
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Contact & Location</span>
          </button>

          <button
            onClick={() => setActiveSubTab("announcement")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeSubTab === "announcement"
                ? "bg-[#111111] text-[#FAF9F5] border border-[#D4AF37]"
                : "bg-[#FAF9F5] text-[#666666] border border-[#E8E1D0] hover:bg-white hover:text-[#111111]"
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Top Announcement Banner</span>
          </button>

          <button
            onClick={() => setActiveSubTab("social")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeSubTab === "social"
                ? "bg-[#111111] text-[#FAF9F5] border border-[#D4AF37]"
                : "bg-[#FAF9F5] text-[#666666] border border-[#E8E1D0] hover:bg-white hover:text-[#111111]"
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Social Profiles</span>
          </button>

          <button
            onClick={() => setActiveSubTab("branding")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeSubTab === "branding"
                ? "bg-[#111111] text-[#FAF9F5] border border-[#D4AF37]"
                : "bg-[#FAF9F5] text-[#666666] border border-[#E8E1D0] hover:bg-white hover:text-[#111111]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Tagline & Hero Copy</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Contact & Location */}
      {activeSubTab === "contact" && (
        <div className="bg-white p-6 rounded-xl border border-[#E8E1D0] shadow-xs space-y-6">
          <div className="border-b border-[#E8E1D0] pb-3">
            <h3 className="text-base font-bold text-[#111111] font-heading flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>Contact Information, WhatsApp & Rajkot Office</span>
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              These details are reflected across headers, footers, consultation modals, and Google
              map sections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Phone Display */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Display Phone Number
              </label>
              <input
                type="text"
                value={settings.phoneDisplay}
                onChange={(e) => handleFieldChange("phoneDisplay", e.target.value)}
                placeholder="+91 98987 78047"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
              <span className="text-xs text-[#777777] mt-1 block">
                Formatted with spaces (e.g. +91 98987 78047)
              </span>
            </div>

            {/* Phone Raw */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Dialing Number (Tel / Click-to-call)
              </label>
              <input
                type="text"
                value={settings.phoneRaw}
                onChange={(e) => handleFieldChange("phoneRaw", e.target.value)}
                placeholder="919898778047"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
              <span className="text-xs text-[#777777] mt-1 block">
                Numeric only with country code (e.g. 919898778047)
              </span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Official Agency Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="contact@digibasera.com"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                WhatsApp Business Number
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => handleFieldChange("whatsappNumber", e.target.value)}
                placeholder="919898778047"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            {/* Office Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Rajkot Headquarters / Office Address
              </label>
              <input
                type="text"
                value={settings.headquarters}
                onChange={(e) => handleFieldChange("headquarters", e.target.value)}
                placeholder="DigiBasera, Chandresh Nagar Main Road, Mayani Chowk, Opposite Backbone Shopping Center, Rajkot - 360004"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            {/* Office Hours */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Office Hours
              </label>
              <input
                type="text"
                value={settings.officeHours}
                onChange={(e) => handleFieldChange("officeHours", e.target.value)}
                placeholder="Monday – Saturday: 9:30 AM – 7:30 PM IST (Sunday Closed)"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            {/* Google Maps URL */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Google Maps Profile / Directions Link
              </label>
              <input
                type="url"
                value={settings.googleMapsUrl}
                onChange={(e) => handleFieldChange("googleMapsUrl", e.target.value)}
                placeholder="https://share.google/6qE9KBy6hSqJnPcZ2"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            {/* WhatsApp Pre-filled message */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                WhatsApp Default Greeting Message
              </label>
              <textarea
                rows={2}
                value={settings.whatsappDefaultMessage}
                onChange={(e) => handleFieldChange("whatsappDefaultMessage", e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Announcement Banner */}
      {activeSubTab === "announcement" && (
        <div className="bg-white p-6 rounded-xl border border-[#E8E1D0] shadow-xs space-y-6">
          <div className="border-b border-[#E8E1D0] pb-3">
            <h3 className="text-base font-bold text-[#111111] font-heading flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#D4AF37]" />
              <span>Top Announcement Bar & Promotional Banner</span>
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              Highlight seasonal offers, free audits, or urgent agency announcements at the top of
              the screen.
            </p>
          </div>

          <div className="space-y-4">
            {/* Enable toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E1D0]">
              <div>
                <span className="text-xs font-bold text-[#111111] block">
                  Announcement Bar Visibility
                </span>
                <span className="text-xs text-[#666666]">
                  Toggle whether the gold-accented top notification bar appears to visitors.
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleFieldChange("announcementEnabled", !settings.announcementEnabled)
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  settings.announcementEnabled
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-gray-200 text-gray-700 border border-gray-300"
                }`}
              >
                {settings.announcementEnabled ? <Check className="w-3.5 h-3.5" /> : null}
                <span>
                  {settings.announcementEnabled ? "Enabled (Visible)" : "Disabled (Hidden)"}
                </span>
              </button>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Badge Tag Text
              </label>
              <input
                type="text"
                value={settings.announcementBadge}
                onChange={(e) => handleFieldChange("announcementBadge", e.target.value)}
                placeholder="LIMITED SLOTS / SPECIAL INITIATIVE"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            {/* Main announcement text */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Announcement Message Text
              </label>
              <textarea
                rows={2}
                value={settings.announcementText}
                onChange={(e) => handleFieldChange("announcementText", e.target.value)}
                placeholder="Complimentary Full-Stack Digital Marketing & SEO Growth Audit for Rajkot & Gujarat Brands"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none resize-none"
              />
            </div>

            {/* CTA Button */}
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Call-To-Action Button Label
              </label>
              <input
                type="text"
                value={settings.announcementCtaText}
                onChange={(e) => handleFieldChange("announcementCtaText", e.target.value)}
                placeholder="Claim Free Audit"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            {/* Live Preview */}
            <div className="pt-3">
              <span className="text-xs uppercase font-bold text-[#9A7B16] font-heading block mb-1.5">
                Live Announcement Bar Preview
              </span>
              <div className="bg-[#111111] text-[#FAF9F5] p-3 rounded-xl border border-[#D4AF37] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-[#D4AF37] text-[#111111] text-xs font-bold uppercase px-2 py-0.5 rounded">
                    {settings.announcementBadge || "SPECIAL"}
                  </span>
                  <span className="text-xs text-white/90">
                    {settings.announcementText || "Announcement banner text goes here"}
                  </span>
                </div>
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-[#D4AF37] text-[#111111] text-xs font-bold uppercase"
                >
                  {settings.announcementCtaText || "Click Here"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Social Profiles */}
      {activeSubTab === "social" && (
        <div className="bg-white p-6 rounded-xl border border-[#E8E1D0] shadow-xs space-y-6">
          <div className="border-b border-[#E8E1D0] pb-3">
            <h3 className="text-base font-bold text-[#111111] font-heading flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Official Social Media & Business Profiles</span>
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              Links used in footer, contact sections, and schema knowledge graph.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => handleFieldChange("instagramUrl", e.target.value)}
                placeholder="https://www.instagram.com/digibasera/"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => handleFieldChange("facebookUrl", e.target.value)}
                placeholder="https://www.facebook.com/digibasera"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                LinkedIn Company Page
              </label>
              <input
                type="url"
                value={settings.linkedinUrl}
                onChange={(e) => handleFieldChange("linkedinUrl", e.target.value)}
                placeholder="https://www.linkedin.com/company/digibasera"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                YouTube Channel
              </label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => handleFieldChange("youtubeUrl", e.target.value)}
                placeholder="https://www.youtube.com/@digibasera"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Branding & Hero Copy */}
      {activeSubTab === "branding" && (
        <div className="bg-white p-6 rounded-xl border border-[#E8E1D0] shadow-xs space-y-6">
          <div className="border-b border-[#E8E1D0] pb-3">
            <h3 className="text-base font-bold text-[#111111] font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Agency Branding, Slogans & Hero Messaging</span>
            </h3>
            <p className="text-xs text-[#666666] mt-0.5">
              Customize core agency headlines and taglines displayed across top sections.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Company / Agency Legal Name
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => handleFieldChange("companyName", e.target.value)}
                placeholder="Digi Basera"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Agency Tagline
              </label>
              <input
                type="text"
                value={settings.heroTagline}
                onChange={(e) => handleFieldChange("heroTagline", e.target.value)}
                placeholder="DIGITAL MARKETING • SEO • WEB ENGINEERING • PERFORMANCE ROAS"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Primary Hero Headline
              </label>
              <input
                type="text"
                value={settings.heroHeadline}
                onChange={(e) => handleFieldChange("heroHeadline", e.target.value)}
                placeholder="Turning Digital Ambition into Tangible Market Dominance"
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                Hero Supporting Description
              </label>
              <textarea
                rows={3}
                value={settings.heroSubheadline}
                onChange={(e) => handleFieldChange("heroSubheadline", e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="p-4 bg-white rounded-xl border border-[#E8E1D0] flex items-center justify-between">
        <span className="text-xs text-[#666666]">
          {isSaved ? "All changes are up to date." : "You have unsaved changes in this panel."}
        </span>
        <button
          onClick={() => handleSaveAll()}
          className="px-6 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white border border-[#D4AF37] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#D4AF37]" />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
};
