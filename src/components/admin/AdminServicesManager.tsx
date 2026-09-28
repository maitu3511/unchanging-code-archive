import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Search,
  Layers,
  DollarSign,
  Image,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Globe,
  Settings,
  ExternalLink,
  Upload,
  ImageIcon,
  X,
} from "lucide-react";
import {
  MainServiceCatalogueItem,
  loadStoredMainServices,
  saveStoredMainServices,
  resetMainServicesToFactoryDefaults,
  DEFAULT_MAIN_SERVICES,
} from "../../data/servicesData";
import { ServiceItem } from "../../types";
import { DeviceImageUploader } from "./DeviceImageUploader";

export const AdminServicesManager: React.FC = () => {
  const [mainServices, setMainServices] = useState<MainServiceCatalogueItem[]>(() => {
    return loadStoredMainServices();
  });

  const [selectedServiceId, setSelectedServiceId] = useState<string>(mainServices[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Confirmation states to avoid blocked window.confirm in iframes
  const [confirmDeleteSubId, setConfirmDeleteSubId] = useState<string | null>(null);
  const [confirmDeleteMainId, setConfirmDeleteMainId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Editing state for Main Service
  const [editingMainService, setEditingMainService] = useState<MainServiceCatalogueItem | null>(
    null,
  );
  const [isCreatingMainService, setIsCreatingMainService] = useState(false);

  // Editing state for Sub Service
  const [editingSubService, setEditingSubService] = useState<{
    mainServiceId: string;
    subService: ServiceItem;
    isNew?: boolean;
  } | null>(null);

  // Sub-service form state helpers
  const [deliverablesText, setDeliverablesText] = useState("");
  const [toolsText, setToolsText] = useState("");
  const [benefitsText, setBenefitsText] = useState("");
  const [keyServicesText, setKeyServicesText] = useState("");

  const currentMainService =
    mainServices.find((s) => s.id === selectedServiceId) || mainServices[0];

  const handleSaveToStorage = (
    updatedList: MainServiceCatalogueItem[],
    msg = "Services updated successfully!",
  ) => {
    setMainServices(updatedList);
    saveStoredMainServices(updatedList);
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleResetToDefaults = () => {
    resetMainServicesToFactoryDefaults();
    const defaults = DEFAULT_MAIN_SERVICES;
    setMainServices(defaults);
    setSelectedServiceId(defaults[0]?.id || "");
    setEditingMainService(null);
    setEditingSubService(null);
    setShowResetConfirm(false);
    setSaveSuccessMsg("All 11 main services & sub-services reset to factory defaults.");
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  // Toggle Main Service visibility (active / hidden)
  const handleToggleMainServiceStatus = (id: string) => {
    const updated = mainServices.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === "hidden" ? ("active" as const) : ("hidden" as const),
        };
      }
      return s;
    });
    handleSaveToStorage(updated, "Service status updated.");
  };

  // Delete Main Service
  const handleDeleteMainService = (id: string) => {
    const target = mainServices.find((s) => s.id === id);
    if (!target) return;
    const updated = mainServices.filter((s) => s.id !== id);
    handleSaveToStorage(updated, `Deleted "${target.title}".`);
    setConfirmDeleteMainId(null);
    if (selectedServiceId === id) {
      setSelectedServiceId(updated[0]?.id || "");
    }
  };

  // Open Edit Main Service
  const handleStartEditMainService = (service: MainServiceCatalogueItem) => {
    setEditingMainService({ ...service });
    setIsCreatingMainService(false);
    setBenefitsText(service.benefits?.join("\n") || "");
    setKeyServicesText(service.keyServicesList?.join("\n") || "");
  };

  // Open Create Main Service
  const handleStartCreateMainService = () => {
    const nextNum = (mainServices.length + 1).toString().padStart(2, "0");
    const newService: MainServiceCatalogueItem = {
      id: `service-${Date.now()}`,
      number: nextNum,
      title: "NEW SERVICE CATEGORY",
      badge: "Specialized Discipline",
      shortDescription: "Describe the main focus and value proposition of this service.",
      fullDescription:
        "Comprehensive overview of our methodology, deliverables, and commercial outcomes for this service.",
      iconName: "Sparkles",
      accentColor: "gold",
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      portfolioCategory: "Websites",
      startingPrice: "₹19,999",
      benefits: [
        "Dedicated Senior Specialists",
        "Transparent Weekly Progress Reporting",
        "Full Intellectual Property Ownership",
      ],
      keyServicesList: ["Core Strategy", "Execution & Deployment", "Continuous Optimization"],
      status: "active",
      displayOrder: mainServices.length + 1,
      seoTitle: "Digital Marketing & Growth Services | DigiBasera",
      seoDescription:
        "High-performance digital marketing, web engineering and branding services in Rajkot.",
      services: [],
    };
    setEditingMainService(newService);
    setIsCreatingMainService(true);
    setBenefitsText(newService.benefits.join("\n"));
    setKeyServicesText(newService.keyServicesList.join("\n"));
  };

  // Save Main Service (Create or Update)
  const handleSaveMainService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMainService) return;

    const benefits = benefitsText
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    const keyServicesList = keyServicesText
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);

    const formattedSlug = editingMainService.id
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const finalService: MainServiceCatalogueItem = {
      ...editingMainService,
      id: formattedSlug || editingMainService.id,
      benefits: benefits.length > 0 ? benefits : ["High-Quality Execution"],
      keyServicesList: keyServicesList.length > 0 ? keyServicesList : ["Core Consultation"],
    };

    let updatedList: MainServiceCatalogueItem[];
    if (isCreatingMainService) {
      updatedList = [...mainServices, finalService];
    } else {
      updatedList = mainServices.map((s) => (s.id === editingMainService.id ? finalService : s));
    }

    handleSaveToStorage(
      updatedList,
      isCreatingMainService ? "New main service published!" : "Main service saved!",
    );
    setSelectedServiceId(finalService.id);
    setEditingMainService(null);
    setIsCreatingMainService(false);
  };

  // Sub-Service Handlers
  const handleStartCreateSubService = (mainServiceId: string) => {
    const parent = mainServices.find((s) => s.id === mainServiceId);
    if (!parent) return;

    const newSub: ServiceItem = {
      id: `sub-${Date.now()}`,
      title: "New Sub-Service Solution",
      shortDesc: "Short description highlighting user benefits and core outcome.",
      description:
        "Comprehensive explanation of what this sub-service entails, why it matters, and how we deliver it.",
      iconName: "CheckCircle2",
      imageUrl:
        parent.imageUrl ||
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      pricingStartingAt: parent.startingPrice || "₹9,999",
      deliverables: [
        "Dedicated Project Discovery & Requirement Mapping",
        "Custom High-Quality Deliverables Architecture",
        "Quality Assurance & Validation Review",
        "Client Handover & Post-Launch Support",
      ],
      idealFor: "Businesses, startups, and growing enterprises looking for specialized execution.",
      roiImpact: "Measurable improvement in efficiency, lead capture, or brand perception.",
      targetOutcome: "Full implementation ready for commercial use.",
      timeline: "7 - 14 Business Days",
      toolsUsed: ["Figma", "Google Workspace", "Industry Tools"],
      portfolioCategory: parent.portfolioCategory || "Websites",
    };

    setDeliverablesText(newSub.deliverables.join("\n"));
    setToolsText(newSub.toolsUsed?.join(", ") || "");
    setEditingSubService({
      mainServiceId,
      subService: newSub,
      isNew: true,
    });
  };

  const handleStartEditSubService = (mainServiceId: string, sub: ServiceItem) => {
    setDeliverablesText(sub.deliverables.join("\n"));
    setToolsText(sub.toolsUsed?.join(", ") || "");
    setEditingSubService({
      mainServiceId,
      subService: { ...sub },
      isNew: false,
    });
  };

  const handleDeleteSubService = (mainServiceId: string, subId: string) => {
    const updated = mainServices.map((main) => {
      if (main.id === mainServiceId) {
        return {
          ...main,
          services: main.services.filter((s) => s.id !== subId),
        };
      }
      return main;
    });
    handleSaveToStorage(updated, "Sub-service removed.");
    setConfirmDeleteSubId(null);
  };

  const handleSaveSubService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubService) return;

    const deliverables = deliverablesText
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const toolsUsed = toolsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const finalSub: ServiceItem = {
      ...editingSubService.subService,
      deliverables: deliverables.length > 0 ? deliverables : ["Standard Deliverables Pack"],
      toolsUsed: toolsUsed.length > 0 ? toolsUsed : ["Standard Industry Tools"],
    };

    const updated = mainServices.map((main) => {
      if (main.id === editingSubService.mainServiceId) {
        let newSubList: ServiceItem[];
        if (editingSubService.isNew) {
          newSubList = [...main.services, finalSub];
        } else {
          newSubList = main.services.map((s) => (s.id === finalSub.id ? finalSub : s));
        }
        return {
          ...main,
          services: newSubList,
        };
      }
      return main;
    });

    handleSaveToStorage(
      updated,
      editingSubService.isNew ? "Sub-service created!" : "Sub-service saved!",
    );
    setEditingSubService(null);
  };

  // Filtered list of main services for search
  const filteredMainServices = mainServices.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.badge.toLowerCase().includes(q) ||
      s.shortDescription.toLowerCase().includes(q) ||
      s.services.some((sub) => sub.title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner / Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141414] p-6 rounded-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-1">
            <Layers className="w-4 h-4" />
            <span>Digital Agency Architecture</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Services & Sub-Services Management</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Manage all 11 core agency pillars (Digital Marketing, SEO, Web, etc.) and their
            specialized sub-services.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleStartCreateMainService}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-semibold text-sm rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Main Service</span>
          </button>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              title="Restore default 11 service categories"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Defaults</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-red-950/90 border border-red-500/50 p-1.5 rounded-lg">
              <span className="text-xs text-red-200 px-2 font-medium">
                Reset all services to defaults?
              </span>
              <button
                onClick={handleResetToDefaults}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 text-neutral-300 text-xs rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Service Switcher Bar - Fast access to Digital Marketing, SEO, Web, etc. */}
      <div className="bg-[#181818] p-4 rounded-xl border border-white/10 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Select Service to View & Add Sub-Services:
            </span>
          </div>
          <span className="text-xs text-[#D4AF37]">
            Active: {currentMainService?.title} ({currentMainService?.services?.length || 0}{" "}
            sub-services)
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {mainServices.map((srv) => {
            const isActive = srv.id === selectedServiceId;
            return (
              <button
                key={srv.id}
                onClick={() => {
                  setSelectedServiceId(srv.id);
                  setEditingMainService(null);
                  setEditingSubService(null);
                  setConfirmDeleteSubId(null);
                  const el = document.getElementById("sub-services-panel");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#D4AF37] text-black font-bold shadow-md shadow-[#D4AF37]/20 border border-[#D4AF37]"
                    : "bg-[#141414] hover:bg-[#222222] text-neutral-300 border border-white/10"
                }`}
              >
                <span className="font-mono text-xs">{srv.number || ""}.</span>
                <span>{srv.title}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-black/20 text-black" : "bg-white/10 text-neutral-400"
                  }`}
                >
                  {srv.services?.length || 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="flex items-center justify-between p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/40 rounded-lg text-[#F3E5AB] text-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg("")}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container: Left Services Selector + Right Details/Subservices Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: List of 11 Main Services */}
        <div className="lg:col-span-4 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or sub-services..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-white/10 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {filteredMainServices.map((service, idx) => {
              const isSelected = service.id === selectedServiceId;
              const isHidden = service.status === "hidden";

              const isConfirmingDelete = confirmDeleteMainId === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    setEditingMainService(null);
                    setEditingSubService(null);
                    setConfirmDeleteSubId(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1a1813] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5"
                      : "bg-[#141414] border-white/5 hover:border-white/20 hover:bg-[#181818]"
                  } ${isHidden ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#D4AF37] px-2 py-1 bg-white/5 rounded border border-[#D4AF37]/20">
                        {service.number || (idx + 1).toString().padStart(2, "0")}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-white line-clamp-1">
                          {service.title}
                        </h4>
                        <span className="text-xs text-neutral-400">{service.badge}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMainServiceStatus(service.id);
                        }}
                        className={`p-1.5 rounded transition-colors ${
                          isHidden
                            ? "text-neutral-500 hover:text-white"
                            : "text-[#D4AF37] hover:bg-white/5"
                        }`}
                        title={
                          isHidden
                            ? "Currently Hidden - Click to Show"
                            : "Currently Active - Click to Hide"
                        }
                      >
                        {isHidden ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditMainService(service);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded transition-colors"
                        title="Edit Main Service Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteMainId(service.id);
                        }}
                        className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isConfirmingDelete && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2.5 p-2 rounded bg-red-950/90 border border-red-500/60 flex items-center justify-between text-xs"
                    >
                      <span className="text-red-200">Delete {service.title}?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteMainService(service.id)}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteMainId(null)}
                          className="px-2 py-0.5 bg-white/10 text-neutral-300 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 border-t border-white/5 pt-2">
                    <span className="text-neutral-400">
                      {service.services?.length || 0} Sub-Services
                    </span>
                    <span className="font-semibold text-[#D4AF37]">
                      Starts {service.startingPrice || "₹19,999"}
                    </span>
                  </div>

                  {/* Direct Action Buttons on each Card */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedServiceId(service.id);
                        setEditingMainService(null);
                        setEditingSubService(null);
                        const el = document.getElementById("sub-services-panel");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="flex-1 py-1.5 px-2.5 rounded bg-white/5 hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-xs font-semibold text-white hover:text-[#D4AF37] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Sub-Services ({service.services?.length || 0})</span>
                      <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedServiceId(service.id);
                        handleStartCreateSubService(service.id);
                        const el = document.getElementById("sub-services-panel");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="py-1.5 px-3 rounded bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black text-xs font-bold flex items-center gap-1 transition-all shadow-xs hover:scale-105"
                      title="Add Sub-Service under this pillar"
                    >
                      <Plus className="w-3.5 h-3.5 text-black stroke-[3]" />
                      <span>+ Add Sub-Service</span>
                    </button>
                  </div>

                  {/* If selected, show expanded list of sub-services inside the card */}
                  {isSelected && service.services && service.services.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/30 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                        <span>Live Sub-Services:</span>
                        <span>{service.services.length} items</span>
                      </div>
                      <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                        {service.services.map((sub, sIdx) => (
                          <div
                            key={sub.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditSubService(service.id, sub);
                              const el = document.getElementById("sub-services-panel");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="p-1.5 rounded bg-black/40 hover:bg-[#D4AF37]/15 border border-white/5 hover:border-[#D4AF37]/40 text-xs text-neutral-300 hover:text-white flex items-center justify-between transition-colors group"
                            title="Click to edit this sub-service"
                          >
                            <span className="truncate flex-1">
                              <span className="text-neutral-500 font-mono mr-1">{sIdx + 1}.</span>
                              {sub.title}
                            </span>
                            <span className="text-xs text-[#D4AF37] opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 ml-1">
                              <Edit2 className="w-2.5 h-2.5" />
                              <span>Edit</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Service Details + Sub-Services */}
        <div id="sub-services-panel" className="lg:col-span-8 space-y-6">
          {/* Quick Dropdown Category Switcher on top of Right Panel */}
          {currentMainService && !editingMainService && !editingSubService && (
            <div className="bg-[#181818] p-4 rounded-xl border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 shrink-0">
                  Editing Pillar:
                </span>
                <select
                  value={selectedServiceId}
                  onChange={(e) => {
                    setSelectedServiceId(e.target.value);
                    setEditingMainService(null);
                    setEditingSubService(null);
                  }}
                  className="bg-black border border-[#D4AF37]/50 text-[#F3E5AB] font-bold text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#D4AF37] cursor-pointer max-w-full truncate"
                >
                  {mainServices.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.number}. {srv.title} ({srv.services?.length || 0} Sub-Services)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleStartCreateSubService(currentMainService.id)}
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-[#D4AF37]/30 hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-black stroke-[3]" />
                  <span>+ Add Sub-Service</span>
                </button>
              </div>
            </div>
          )}
          {/* If Editing/Creating Main Service */}
          {editingMainService ? (
            <div className="bg-[#141414] p-6 rounded-xl border-2 border-[#D4AF37]/60 space-y-6 shadow-xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isCreatingMainService
                      ? "Add New Main Service"
                      : `Edit: ${editingMainService.title}`}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Configure the main category banner, starting price, and benefits checklist.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMainService(null)}
                  className="text-xs text-neutral-300 hover:text-white px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Form</span>
                </button>
              </div>

              <form onSubmit={handleSaveMainService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Display Number
                    </label>
                    <input
                      type="text"
                      value={editingMainService.number || ""}
                      onChange={(e) =>
                        setEditingMainService({ ...editingMainService, number: e.target.value })
                      }
                      placeholder="e.g. 05"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMainService.title}
                      onChange={(e) =>
                        setEditingMainService({ ...editingMainService, title: e.target.value })
                      }
                      placeholder="e.g. WEB DESIGN & DEVELOPMENT"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Category Badge Tag
                    </label>
                    <input
                      type="text"
                      value={editingMainService.badge}
                      onChange={(e) =>
                        setEditingMainService({ ...editingMainService, badge: e.target.value })
                      }
                      placeholder="e.g. Modern Web Engineering"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Starting Price Reference *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingMainService.startingPrice || ""}
                      onChange={(e) =>
                        setEditingMainService({
                          ...editingMainService,
                          startingPrice: e.target.value,
                        })
                      }
                      placeholder="e.g. Starting From ₹19,999"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Device Image Uploader for Main Service */}
                <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10">
                  <DeviceImageUploader
                    label="Main Service Hero Cover Image"
                    value={editingMainService.imageUrl || ""}
                    onChange={(val) =>
                      setEditingMainService({ ...editingMainService, imageUrl: val })
                    }
                    recommendedSizeText="Upload from your computer or phone (JPG, PNG, WebP up to 4MB)"
                    aspectRatioText="16:9 Landscape"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Short Description (For Overview & Main Cards) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingMainService.shortDescription}
                    onChange={(e) =>
                      setEditingMainService({
                        ...editingMainService,
                        shortDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Full Description (For Detail Page Hero)
                  </label>
                  <textarea
                    rows={3}
                    value={editingMainService.fullDescription || ""}
                    onChange={(e) =>
                      setEditingMainService({
                        ...editingMainService,
                        fullDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Key Benefits / Highlights (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={benefitsText}
                      onChange={(e) => setBenefitsText(e.target.value)}
                      placeholder="Custom Responsive UI&#10;Core Web Vitals 95+&#10;1-Click WhatsApp Lead Routing"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Key Sub-Services List (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={keyServicesText}
                      onChange={(e) => setKeyServicesText(e.target.value)}
                      placeholder="Web Design&#10;Custom Website Design&#10;WordPress Design&#10;E-Commerce Development"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingMainService(null)}
                    className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close & Discard</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Main Service</span>
                  </button>
                </div>
              </form>
            </div>
          ) : editingSubService ? (
            /* Sub-Service Form */
            <div className="bg-[#141414] p-6 rounded-xl border-2 border-[#D4AF37]/70 space-y-6 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                      Sub-Service Editor
                    </span>
                    <span className="text-xs text-neutral-400">
                      Under:{" "}
                      <strong className="text-white font-semibold">
                        {mainServices.find((s) => s.id === editingSubService.mainServiceId)?.title}
                      </strong>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {editingSubService.isNew
                      ? "Create New Sub-Service"
                      : `Edit Sub-Service: ${editingSubService.subService.title}`}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingSubService(null)}
                  className="text-xs text-neutral-300 hover:text-white px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg border border-white/15 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close Form</span>
                </button>
              </div>

              <form onSubmit={handleSaveSubService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Sub-Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingSubService.subService.title}
                      onChange={(e) =>
                        setEditingSubService({
                          ...editingSubService,
                          subService: { ...editingSubService.subService, title: e.target.value },
                        })
                      }
                      placeholder="e.g. Custom Website Design"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Starting Price Reference *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingSubService.subService.pricingStartingAt || ""}
                      onChange={(e) =>
                        setEditingSubService({
                          ...editingSubService,
                          subService: {
                            ...editingSubService.subService,
                            pricingStartingAt: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Starting From ₹24,999/month"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Sub-Service Device Image Uploader */}
                <div className="p-4 rounded-xl bg-neutral-900/80 border border-white/10">
                  <DeviceImageUploader
                    label="Sub-Service Image (Device Upload or URL)"
                    value={editingSubService.subService.imageUrl || ""}
                    onChange={(val) =>
                      setEditingSubService({
                        ...editingSubService,
                        subService: {
                          ...editingSubService.subService,
                          imageUrl: val,
                        },
                      })
                    }
                    recommendedSizeText="Upload image directly from your phone/computer (JPG, PNG, WebP up to 4MB)"
                    aspectRatioText="16:9 Landscape"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editingSubService.subService.shortDesc}
                    onChange={(e) =>
                      setEditingSubService({
                        ...editingSubService,
                        subService: {
                          ...editingSubService.subService,
                          shortDesc: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Full Description (Deep Dive)
                  </label>
                  <textarea
                    rows={3}
                    value={editingSubService.subService.description}
                    onChange={(e) =>
                      setEditingSubService({
                        ...editingSubService,
                        subService: {
                          ...editingSubService.subService,
                          description: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Deliverables Checklist (One per line) *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={deliverablesText}
                      onChange={(e) => setDeliverablesText(e.target.value)}
                      placeholder="Responsive design for mobile and desktop&#10;Modern UI with typography hierarchy&#10;WhatsApp chat integration&#10;SEO-friendly semantic HTML5"
                      className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Ideal For
                      </label>
                      <input
                        type="text"
                        value={editingSubService.subService.idealFor || ""}
                        onChange={(e) =>
                          setEditingSubService({
                            ...editingSubService,
                            subService: {
                              ...editingSubService.subService,
                              idealFor: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. Growing enterprises, corporate brands..."
                        className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Tools / Tech Stack (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={toolsText}
                        onChange={(e) => setToolsText(e.target.value)}
                        placeholder="React, Next.js, Tailwind CSS, Figma"
                        className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                        Estimated Delivery Timeline
                      </label>
                      <input
                        type="text"
                        value={editingSubService.subService.timeline || ""}
                        onChange={(e) =>
                          setEditingSubService({
                            ...editingSubService,
                            subService: {
                              ...editingSubService.subService,
                              timeline: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g. 7 - 12 Business Days"
                        className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingSubService(null)}
                    className="px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Close & Discard</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Sub-Service</span>
                  </button>
                </div>
              </form>
            </div>
          ) : currentMainService ? (
            /* Active Main Service Overview Card & Sub-Services List */
            <div className="space-y-6">
              {/* 1. Sub-Services Header Banner (PRIMARY VIEW) */}
              <div className="bg-gradient-to-r from-[#1c1913] via-[#141414] to-[#141414] p-5 rounded-xl border-2 border-[#D4AF37] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-black bg-[#D4AF37] px-2 py-0.5 rounded">
                      {currentMainService.number}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                      Sub-Services Hub
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white mt-1">
                    Sub-Services under {currentMainService.title}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {currentMainService.services?.length || 0} active sub-services published and
                    live on public site
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartCreateSubService(currentMainService.id)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-[#D4AF37]/40 hover:scale-[1.03] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-black stroke-[3]" />
                    <span>+ Add Sub-Service</span>
                  </button>
                </div>
              </div>

              {/* 2. Sub-Services List */}
              <div className="space-y-3">
                {currentMainService.services?.length === 0 ? (
                  <div className="p-8 text-center bg-[#141414] rounded-xl border border-dashed border-white/10 text-neutral-400 text-sm space-y-3">
                    <p>No sub-services added yet for {currentMainService.title}.</p>
                    <button
                      onClick={() => handleStartCreateSubService(currentMainService.id)}
                      className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                    >
                      + Add First Sub-Service
                    </button>
                  </div>
                ) : (
                  <>
                    {currentMainService.services?.map((sub, idx) => {
                      const isDeletingThis = confirmDeleteSubId === sub.id;
                      return (
                        <div
                          key={sub.id}
                          className="p-4 bg-[#141414] rounded-xl border border-white/5 hover:border-white/15 transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {sub.imageUrl ? (
                                <div className="w-16 h-12 rounded-xl overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-black shadow-xs">
                                  <img
                                    src={sub.imageUrl}
                                    alt={sub.title}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-12 rounded-xl bg-white/5 border-2 border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                                  <Sparkles className="w-5 h-5" />
                                </div>
                              )}

                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-neutral-400">
                                    {(idx + 1).toString().padStart(2, "0")}.
                                  </span>
                                  <h5 className="text-sm font-bold text-white">{sub.title}</h5>
                                  {sub.pricingStartingAt && (
                                    <span className="text-xs font-semibold text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/30">
                                      {sub.pricingStartingAt}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                                  {sub.shortDesc}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                              <button
                                onClick={() =>
                                  handleStartEditSubService(currentMainService.id, sub)
                                }
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                                title="Edit Sub-Service"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => setConfirmDeleteSubId(sub.id)}
                                className="p-1.5 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                title="Delete Sub-Service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Inline Delete Confirmation */}
                          {isDeletingThis && (
                            <div className="p-3 rounded-lg bg-red-950/90 border border-red-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                              <span className="text-red-200">
                                Are you sure you want to delete &quot;{sub.title}&quot;?
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleDeleteSubService(currentMainService.id, sub.id)
                                  }
                                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded cursor-pointer"
                                >
                                  Confirm Delete
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteSubId(null)}
                                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-neutral-300 rounded cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Deliverables summary */}
                          {sub.deliverables && sub.deliverables.length > 0 && (
                            <div className="pt-2 border-t border-white/5">
                              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                                Key Deliverables ({sub.deliverables.length}):
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-neutral-300">
                                {sub.deliverables.slice(0, 4).map((d, dIdx) => (
                                  <div key={dIdx} className="flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-[#D4AF37] shrink-0" />
                                    <span className="truncate">{d}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Bottom Add Sub-Service Button */}
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={() => handleStartCreateSubService(currentMainService.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] font-bold text-xs uppercase tracking-wider rounded-lg transition-all hover:scale-105 cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-[#D4AF37] stroke-[3]" />
                        <span>+ Add Another Sub-Service under {currentMainService.title}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 3. Main Service Category Overview Card */}
              <div className="bg-[#141414] p-6 rounded-xl border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/30">
                        {currentMainService.number}
                      </span>
                      <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                        Pillar Details: {currentMainService.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{currentMainService.title}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
                      {currentMainService.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditMainService(currentMainService)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Edit Category</span>
                    </button>
                  </div>
                </div>

                {/* Key Benefits */}
                {currentMainService.benefits && currentMainService.benefits.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-white/5">
                    {currentMainService.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <span className="text-neutral-400">
                    Starting Reference:{" "}
                    <strong className="text-[#D4AF37] font-semibold">
                      {currentMainService.startingPrice}
                    </strong>
                  </span>
                  <span className="text-neutral-500">Slug: {currentMainService.id}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-400 bg-[#141414] rounded-xl border border-white/10">
              Select a service from the left column to view or manage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
