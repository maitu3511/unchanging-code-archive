import React, { useState } from "react";
import {
  Star,
  Quote,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Image as ImageIcon,
  Upload,
  AlertCircle,
  X,
  Building,
  User,
  Tag,
} from "lucide-react";
import {
  StoredTestimonialItem,
  loadStoredTestimonials,
  saveStoredTestimonials,
  resetTestimonialsToFactoryDefaults,
} from "../../data/testimonialsData";
import { DeviceImageUploader } from "./DeviceImageUploader";

interface AdminReviewsManagerProps {
  showToast?: (msg: string) => void;
  onUpdate?: () => void;
}

export const AdminReviewsManager: React.FC<AdminReviewsManagerProps> = ({
  showToast,
  onUpdate,
}) => {
  const [reviews, setReviews] = useState<StoredTestimonialItem[]>(() => {
    return loadStoredTestimonials();
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState("all");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");

  // Modal / Form state
  const [editingReview, setEditingReview] = useState<StoredTestimonialItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [formError, setFormError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sample avatar presets for quick pick
  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  ];

  const handleSaveToStorage = (
    updatedList: StoredTestimonialItem[],
    msg = "Reviews updated successfully!",
  ) => {
    setReviews(updatedList);
    saveStoredTestimonials(updatedList);
    window.dispatchEvent(new Event("storage"));
    setSaveSuccessMsg(msg);
    if (showToast) showToast(msg);
    if (onUpdate) onUpdate();
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleResetToDefaults = () => {
    setShowResetConfirm(true);
  };

  const confirmResetDefaultsAction = () => {
    const defaults = resetTestimonialsToFactoryDefaults();
    setReviews(defaults);
    setEditingReview(null);
    setIsCreatingNew(false);
    setShowResetConfirm(false);
    window.dispatchEvent(new Event("storage"));
    setSaveSuccessMsg("Factory default reviews restored.");
    if (showToast) showToast("Factory default reviews restored.");
    if (onUpdate) onUpdate();
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  const handleToggleStatus = (id: string) => {
    const updated = reviews.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          status: r.status === "hidden" ? ("active" as const) : ("hidden" as const),
        };
      }
      return r;
    });
    handleSaveToStorage(updated, "Review visibility updated.");
  };

  const handleDeleteReview = (id: string, name: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setConfirmDeleteId(null);
    handleSaveToStorage(updated, `Review by "${name}" deleted successfully.`);
  };

  const handleStartCreate = () => {
    setFormError("");
    const newRev: StoredTestimonialItem = {
      id: `review-${Date.now()}`,
      clientName: "",
      role: "Founder & CEO",
      company: "",
      industry: "General Business",
      quote: "",
      metricHighlight: "100% Growth Lift Achieved",
      rating: 5,
      avatarUrl: avatarPresets[0],
      date: "Verified Client Review",
      status: "active",
      displayOrder: reviews.length + 1,
      featured: true,
    };
    setEditingReview(newRev);
    setIsCreatingNew(true);
  };

  const handleStartEdit = (rev: StoredTestimonialItem) => {
    setFormError("");
    setEditingReview({ ...rev });
    setIsCreatingNew(false);
  };

  const handleCloseModal = () => {
    setEditingReview(null);
    setIsCreatingNew(false);
    setFormError("");
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    if (!editingReview.clientName.trim()) {
      setFormError("Please enter client name.");
      return;
    }
    if (!editingReview.company.trim()) {
      setFormError("Please enter company / brand name.");
      return;
    }
    if (!editingReview.quote.trim()) {
      setFormError("Please enter testimonial quote text.");
      return;
    }

    setFormError("");
    let updatedList: StoredTestimonialItem[];
    if (isCreatingNew) {
      updatedList = [editingReview, ...reviews];
    } else {
      updatedList = reviews.map((r) => (r.id === editingReview.id ? editingReview : r));
    }

    handleSaveToStorage(
      updatedList,
      isCreatingNew
        ? "New client review added successfully!"
        : "Client review updated successfully!",
    );
    setEditingReview(null);
    setIsCreatingNew(false);
  };

  // Industries list
  const industries = Array.from(new Set(reviews.map((r) => r.industry).filter(Boolean)));

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.metricHighlight.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustryFilter === "all" || r.industry === selectedIndustryFilter;
    const matchesRating =
      selectedRatingFilter === "all" || r.rating === parseInt(selectedRatingFilter, 10);

    return matchesSearch && matchesIndustry && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-sm shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg("")}
            className="text-emerald-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-[#E8E1D0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F5] border border-[#E8E1D0] text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-2">
            <Quote className="w-3.5 h-3.5" />
            <span>Social Proof & Client Testimonials</span>
          </div>
          <h2 className="text-2xl font-bold text-[#111111] font-heading">
            Client Reviews & Testimonials Manager
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Add, modify, or remove verified client reviews and testimonials. Updates sync instantly
            with the live home page carousel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white border border-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>+ Add New Review</span>
          </button>

          <button
            onClick={handleResetToDefaults}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#666666] hover:text-[#111111] border border-[#E8E1D0] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset to Factory Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Banner */}
      {showResetConfirm && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span>
              <strong>Are you sure you want to reset all reviews?</strong> All custom reviews will
              be restored to default verified agency testimonials.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={confirmResetDefaultsAction}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Yes, Reset All
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-[#E8E1D0] shadow-xs">
          <div className="text-xs font-bold text-[#777777] uppercase tracking-wider">
            Total Reviews
          </div>
          <div className="text-2xl font-bold text-[#111111] mt-1 font-heading">
            {reviews.length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E8E1D0] shadow-xs">
          <div className="text-xs font-bold text-[#777777] uppercase tracking-wider">
            Active Live
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-heading">
            {reviews.filter((r) => r.status !== "hidden").length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E8E1D0] shadow-xs">
          <div className="text-xs font-bold text-[#777777] uppercase tracking-wider">
            5-Star Rated
          </div>
          <div className="text-2xl font-bold text-[#D4AF37] mt-1 font-heading">
            {reviews.filter((r) => (r.rating || 5) === 5).length}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#E8E1D0] shadow-xs">
          <div className="text-xs font-bold text-[#777777] uppercase tracking-wider">
            Industries Represented
          </div>
          <div className="text-2xl font-bold text-[#111111] mt-1 font-heading">
            {industries.length}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#E8E1D0] flex flex-col md:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, company, quote keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs placeholder-[#999999] focus:border-[#D4AF37] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedIndustryFilter}
            onChange={(e) => setSelectedIndustryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="all">All Industries</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          <select
            value={selectedRatingFilter}
            onChange={(e) => setSelectedRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-xs text-[#111111] focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white border border-[#E8E1D0] text-[#777777] shadow-xs">
            <Quote className="w-8 h-8 mx-auto mb-2 text-[#D4AF37]" />
            <p className="text-sm font-semibold">No client reviews found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedIndustryFilter("all");
                setSelectedRatingFilter("all");
              }}
              className="mt-3 text-xs text-[#D4AF37] font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => {
            const isHidden = rev.status === "hidden";
            return (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between shadow-xs ${
                  isHidden
                    ? "border-[#E8E1D0] opacity-60 bg-[#F9F8F5]"
                    : "border-[#E8E1D0] hover:border-[#D4AF37]"
                }`}
              >
                <div>
                  {/* Top Bar: Rating, Industry, Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating || 5)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E8E1D0]">
                        {rev.industry}
                      </span>
                      {isHidden ? (
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Hidden
                        </span>
                      ) : (
                        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metric Box */}
                  <div className="p-2.5 rounded-xl bg-[#FAF9F5] border border-[#E8E1D0] text-xs font-bold text-[#B89628] flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    <span className="truncate">{rev.metricHighlight}</span>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-[#555555] leading-relaxed italic line-clamp-3 mb-4">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                {/* Bottom Bar: Client Info & Actions */}
                <div className="pt-3 border-t border-[#E8E1D0] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {rev.avatarUrl ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={rev.avatarUrl}
                        alt={rev.clientName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#D4AF37] shrink-0 shadow-xs"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#FAF9F5] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center font-bold text-xs shrink-0">
                        {rev.clientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#111111] truncate">
                        {rev.clientName}
                      </h4>
                      <p className="text-xs text-[#777777] truncate">
                        {rev.role},{" "}
                        <span className="text-[#333333] font-medium">{rev.company}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(rev.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isHidden
                          ? "bg-[#FAF9F5] text-amber-600 border-amber-200 hover:bg-amber-100"
                          : "bg-[#FAF9F5] text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                      }`}
                      title={isHidden ? "Show on website" : "Hide from website"}
                    >
                      {isHidden ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleStartEdit(rev)}
                      className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F0EEE6] text-[#D4AF37] border border-[#E8E1D0] transition-colors cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(rev.id)}
                      className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-red-50 text-red-500 border border-[#E8E1D0] hover:border-red-200 transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inline Card Delete Confirmation */}
                {confirmDeleteId === rev.id && (
                  <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs animate-in fade-in">
                    <span className="text-red-700">
                      Delete review by <strong>&quot;{rev.clientName}&quot;</strong>?
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteReview(rev.id, rev.clientName)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Edit / Create Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#E8E1D0] rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D0] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F5] border border-[#E8E1D0] flex items-center justify-center text-[#D4AF37]">
                  <Quote className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111] font-heading">
                    {isCreatingNew ? "Add New Client Review" : "Edit Client Review"}
                  </h3>
                  <p className="text-xs text-[#777777]">
                    {isCreatingNew
                      ? "Create a verified testimonial with client photo & metrics."
                      : `Editing review for ${editingReview.clientName || "Client"}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F0EEE6] text-[#111111] border border-[#E8E1D0] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Close form and discard unsaved edits"
                >
                  <X className="w-4 h-4 text-red-500" />
                  <span>Close Form</span>
                </button>
              </div>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client Name */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReview.clientName}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, clientName: e.target.value })
                    }
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {/* Role / Designation */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReview.role}
                    onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                    placeholder="e.g. Founder & CEO, Director"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Company / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReview.company}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, company: e.target.value })
                    }
                    placeholder="e.g. Aura Lifestyle, ABFI Interiors"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Industry Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReview.industry}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, industry: e.target.value })
                    }
                    placeholder="e.g. E-commerce, Real Estate, Healthcare"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Star Rating & Verified Metric Highlight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Star Rating (1-5)
                  </label>
                  <select
                    value={editingReview.rating || 5}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, rating: parseInt(e.target.value, 10) })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Metric Highlight / Outcome *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReview.metricHighlight}
                    onChange={(e) =>
                      setEditingReview({ ...editingReview, metricHighlight: e.target.value })
                    }
                    placeholder="e.g. 4.6x Blended ROAS Achieved, +210% Inquiries"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Quote / Full Review Text */}
              <div>
                <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                  Client Review Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingReview.quote}
                  onChange={(e) => setEditingReview({ ...editingReview, quote: e.target.value })}
                  placeholder="Write the verified feedback or client praise detailing ROI, turnaround time, communication, and growth impact..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Avatar Image Selection & Upload via DeviceImageUploader */}
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E1D0] space-y-3">
                <DeviceImageUploader
                  label="Client Profile Picture / Avatar (Upload From Device)"
                  value={editingReview.avatarUrl || ""}
                  onChange={(val) => setEditingReview({ ...editingReview, avatarUrl: val })}
                  recommendedSizeText="Upload client portrait directly from your computer or phone (JPG, PNG, WebP up to 5MB)"
                  aspectRatioText="Square / Circular (1:1)"
                />

                {/* Quick Presets */}
                <div>
                  <div className="text-xs font-semibold text-[#777777] mb-1.5">
                    Or Choose Fast Stock Preset Avatar:
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {avatarPresets.map((preset, idx) => (
                      <img
                        loading="lazy"
                        decoding="async"
                        key={idx}
                        src={preset}
                        alt={`Preset ${idx + 1}`}
                        onClick={() => setEditingReview({ ...editingReview, avatarUrl: preset })}
                        className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition-all ${
                          editingReview.avatarUrl === preset
                            ? "border-[#D4AF37] scale-110 shadow-md"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Status & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Visibility Status
                  </label>
                  <select
                    value={editingReview.status || "active"}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        status: e.target.value as "active" | "hidden",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="active">Active (Visible in Carousel)</option>
                    <option value="hidden">Hidden (Draft / Archive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] uppercase tracking-wider mb-1.5">
                    Display Order Position
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingReview.displayOrder || 1}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        displayOrder: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] border border-[#E8E1D0] text-[#111111] text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E8E1D0]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#E8E1D0] text-[#666666] hover:text-[#111111] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-red-500" />
                  <span>Close & Discard</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#111111] hover:bg-black text-white border border-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                  <span>{isCreatingNew ? "Create Review" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
