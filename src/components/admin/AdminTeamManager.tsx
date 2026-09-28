import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  ArrowUp,
  ArrowDown,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  CoreTeamMember,
  loadStoredTeamMembers,
  saveTeamMembers,
  resetTeamMembersToFactoryDefaults,
  DEFAULT_TEAM_MEMBERS,
} from "../../data/teamData";
import { DeviceImageUploader } from "./DeviceImageUploader";

const AVATAR_PRESETS = [
  {
    label: "Strategist (Male)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=75",
  },
  {
    label: "Engineer (Male)",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=75",
  },
  {
    label: "SEO Specialist (Male)",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=75",
  },
  {
    label: "Creative Lead (Male)",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=75",
  },
  {
    label: "Leader (Female)",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    label: "Strategist (Female)",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  },
];

export const AdminTeamManager: React.FC = () => {
  const [team, setTeam] = useState<CoreTeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "hidden">("all");
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "info";
  } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CoreTeamMember | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [image, setImage] = useState("");
  const [department, setDepartment] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<"active" | "hidden">("active");

  const loadData = () => {
    setTeam(loadStoredTeamMembers());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => setTeam(loadStoredTeamMembers());
    window.addEventListener("digibasera_team_updated", handleUpdate);
    return () => window.removeEventListener("digibasera_team_updated", handleUpdate);
  }, []);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingMember(null);
    setName("");
    setRole("");
    setExp("Growth Specialist");
    setSpecialty("");
    setImage(AVATAR_PRESETS[0].url);
    setDepartment("Growth & Strategy");
    setBio("");
    setStatus("active");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: CoreTeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setExp(member.exp);
    setSpecialty(member.specialty);
    setImage(member.image);
    setDepartment(member.department || "Growth & Strategy");
    setBio(member.bio || "");
    setStatus(member.status || "active");
    setIsModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a member name");
      return;
    }
    if (!role.trim()) {
      alert("Please enter the member's role or designation");
      return;
    }
    if (!image.trim()) {
      alert("Please provide an image URL");
      return;
    }

    if (editingMember) {
      // Update existing
      const updated = team.map((m) =>
        m.id === editingMember.id
          ? {
              ...m,
              name: name.trim(),
              role: role.trim(),
              exp: exp.trim() || "Team Member",
              specialty: specialty.trim(),
              image: image.trim(),
              department: department.trim(),
              bio: bio.trim(),
              status,
            }
          : m,
      );
      saveTeamMembers(updated);
      setTeam(updated);
      showToast(`Updated team member: "${name}"`);
    } else {
      // Create new
      const newMember: CoreTeamMember = {
        id: `team-${Date.now()}`,
        name: name.trim(),
        role: role.trim(),
        exp: exp.trim() || "Growth Specialist",
        specialty: specialty.trim() || "Digital Strategy & High-ROI Performance",
        image: image.trim(),
        department: department.trim() || "Operations",
        bio: bio.trim(),
        status,
        order: team.length + 1,
      };
      const updated = [...team, newMember];
      saveTeamMembers(updated);
      setTeam(updated);
      showToast(`Added new team member: "${name}"`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteMember = (id: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove "${memberName}" from the About team?`)) {
      const updated = team.filter((m) => m.id !== id);
      saveTeamMembers(updated);
      setTeam(updated);
      showToast(`Removed team member "${memberName}"`);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = team.map((m) => {
      if (m.id === id) {
        const next = m.status === "hidden" ? "active" : "hidden";
        return { ...m, status: next as "active" | "hidden" };
      }
      return m;
    });
    saveTeamMembers(updated);
    setTeam(updated);
    showToast("Updated member visibility status");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= team.length) return;
    const clone = [...team];
    const temp = clone[index];
    clone[index] = clone[targetIdx];
    clone[targetIdx] = temp;
    saveTeamMembers(clone);
    setTeam(clone);
    showToast("Updated team member order");
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        "Reset team members list to factory default members? Any custom members added will be replaced with defaults.",
      )
    ) {
      const defaults = resetTeamMembersToFactoryDefaults();
      setTeam(defaults);
      showToast("Reset team members to factory defaults", "info");
    }
  };

  // Filtered list
  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.exp && member.exp.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all"
        ? true
        : member.status === statusFilter || (!member.status && statusFilter === "active");

    return matchesSearch && matchesStatus;
  });

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

      {/* Header & Stats Banner */}
      <div className="bg-white p-6 rounded-xl border border-[#E8E1D0] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              <span className="text-xs uppercase font-bold tracking-widest text-[#9A7B16] font-heading">
                About Page • Core Team Management
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#111111] font-heading mt-1">
              Leadership & Team Members ({team.length})
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              Add new team members, edit images, designations, specialties, or toggle visibility on
              the public About Page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white border border-[#D4AF37] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add New Team Member</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F2EFE9] text-[#666666] hover:text-[#111111] border border-[#E8E1D0] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset to 4 default core members"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-5 border-t border-[#E8E1D0] grid sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, role, badge or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg pl-9 pr-4 py-2 text-xs text-[#111111] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-lg border border-[#E8E1D0]">
            <button
              onClick={() => setStatusFilter("all")}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === "all" ? "bg-white text-[#111111] shadow-2xs" : "text-[#777777]"
              }`}
            >
              All ({team.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === "active"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-[#777777]"
              }`}
            >
              Active ({team.filter((t) => t.status !== "hidden").length})
            </button>
            <button
              onClick={() => setStatusFilter("hidden")}
              className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === "hidden" ? "bg-white text-amber-700 shadow-2xs" : "text-[#777777]"
              }`}
            >
              Hidden ({team.filter((t) => t.status === "hidden").length})
            </button>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      {filteredTeam.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[#E8E1D0] space-y-3">
          <Users className="w-10 h-10 text-[#888888] mx-auto opacity-50" />
          <p className="text-sm font-semibold text-[#111111]">No team members found</p>
          <p className="text-xs text-[#666666]">
            Try adjusting your search query or click "Add New Team Member" to create one.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeam.map((member, index) => {
            const isHidden = member.status === "hidden";
            return (
              <div
                key={member.id}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                  isHidden
                    ? "border-dashed border-gray-300 opacity-65 bg-gray-50/50"
                    : "border-[#D4AF37] shadow-lg hover:shadow-xl"
                }`}
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-3/4 bg-[#111111] overflow-hidden group">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/20 to-transparent" />

                    {/* Badge / Exp Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#D4AF37] px-2.5 py-0.5 rounded shadow-xs">
                        {member.exp || "Team Member"}
                      </span>

                      {isHidden && (
                        <span className="text-xs font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded">
                          Hidden
                        </span>
                      )}
                    </div>

                    {/* Reorder arrows on top right */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-md">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 hover:text-[#D4AF37] text-white disabled:opacity-30 disabled:hover:text-white"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === team.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-[#D4AF37] text-white disabled:opacity-30 disabled:hover:text-white"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2">
                    <div>
                      <h3 className="text-base font-bold text-[#111111] font-heading leading-snug">
                        {member.name}
                      </h3>
                      <p className="text-xs text-[#9A7B16] font-semibold mt-0.5">{member.role}</p>
                    </div>

                    <p className="text-xs text-[#555555] leading-relaxed line-clamp-2 pt-2 border-t border-[#E8E1D0]/60">
                      {member.specialty}
                    </p>

                    {member.department && (
                      <span className="inline-block text-xs font-medium text-[#777777] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#E8E1D0]/70">
                        Dept: {member.department}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="p-3 bg-[#FAF9F5] border-t border-[#E8E1D0] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStatus(member.id)}
                    className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isHidden
                        ? "text-amber-700 hover:text-amber-800"
                        : "text-emerald-700 hover:text-emerald-800"
                    }`}
                    title={
                      isHidden ? "Click to publish on About page" : "Click to hide from About page"
                    }
                  >
                    {isHidden ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(member)}
                      className="px-2.5 py-1.5 rounded-md bg-white hover:bg-[#EFEFEA] border border-[#E8E1D0] text-[#111111] text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Edit team member details & image"
                    >
                      <Edit2 className="w-3 h-3 text-[#9A7B16]" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteMember(member.id, member.name)}
                      className="p-1.5 rounded-md bg-white hover:bg-red-50 border border-[#E8E1D0] hover:border-red-200 text-red-600 transition-colors"
                      title="Delete team member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Team Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-[#E8E1D0] shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF9F5] border-b border-[#E8E1D0] flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#9A7B16] font-heading">
                  About Page Team Editor
                </span>
                <h3 className="text-lg font-bold text-[#111111] font-heading">
                  {editingMember
                    ? `Edit Team Member: ${editingMember.name}`
                    : "Add New Team Member"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#E8E1D0] text-[#111111] border border-[#E8E1D0] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Close and discard changes"
              >
                <X className="w-4 h-4 text-red-500" />
                <span>Close Form</span>
              </button>
            </div>

            {/* Modal Body: Form + Live Preview */}
            <form onSubmit={handleSaveMember} className="p-6 space-y-5">
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Form (7 cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arman Ali"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                      Designation / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Strategic Growth Director & Performance Lead"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Badge / Exp */}
                    <div>
                      <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                        Card Badge / Exp Tag *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Performance Lead, 6+ Yrs Exp"
                        value={exp}
                        onChange={(e) => setExp(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Media Buying / SEO / Web"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                      Specialty & Core Competencies *
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Meta & Google Ads Funnels, Scaled ROAS, B2B Commercial Acquisition"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Profile Image via DeviceImageUploader */}
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E1D0] space-y-3">
                    <DeviceImageUploader
                      label="Team Member Portrait (Upload from device or enter link) *"
                      value={image}
                      onChange={(val) => setImage(val)}
                      recommendedSizeText="Upload portrait directly from your device (JPG, PNG, WebP up to 3MB)"
                      aspectRatioText="Portrait / Square (3:4 or 1:1)"
                    />

                    {/* Quick presets */}
                    <div className="pt-2 border-t border-[#E8E1D0]/60">
                      <span className="text-xs text-[#777777] font-semibold block mb-1.5">
                        Or Pick from Verified Portrait Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {AVATAR_PRESETS.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImage(p.url)}
                            className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                              image === p.url
                                ? "bg-[#D4AF37] text-[#111111] font-bold border-[#D4AF37] shadow-xs"
                                : "bg-white text-[#555555] border-[#E8E1D0] hover:bg-[#FAF9F5]"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex items-center gap-3 pt-2">
                    <label className="text-xs font-bold text-[#111111] uppercase tracking-wider font-heading">
                      Visibility:
                    </label>
                    <button
                      type="button"
                      onClick={() => setStatus(status === "active" ? "hidden" : "active")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        status === "active"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {status === "active" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {status === "active" ? "Active (Shown on About Page)" : "Hidden (Draft)"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right Live Preview (5 cols) */}
                <div className="lg:col-span-5 bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E1D0] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8E1D0]">
                      <span className="text-xs uppercase font-bold text-[#9A7B16] font-heading">
                        Live About Page Preview
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>

                    {/* Miniature Card */}
                    <div className="bg-white rounded-2xl border-2 border-[#D4AF37] overflow-hidden shadow-lg">
                      <div className="relative aspect-3/4 bg-[#111111] overflow-hidden">
                        <img
                          src={
                            image ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=75"
                          }
                          alt={name || "Preview"}
                          className="w-full h-full object-cover filter brightness-95"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=75";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/85 via-[#111111]/20 to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#D4AF37] px-2 py-0.5 rounded shadow-xs">
                            {exp || "Team Member"}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <h4 className="text-sm font-bold text-[#111111] font-heading">
                          {name || "Team Member Name"}
                        </h4>
                        <p className="text-xs text-[#9A7B16] font-semibold">
                          {role || "Designation / Position"}
                        </p>
                        <p className="text-xs text-[#666666] leading-relaxed pt-1.5 border-t border-[#E8E1D0]/60">
                          {specialty || "Specialty and key strengths listed here."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#777777] italic mt-3 text-center">
                    This preview accurately mirrors the live component on the About Us page.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#E8E1D0] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-white hover:bg-[#FAF9F5] border border-[#E8E1D0] text-xs font-semibold text-[#666666] hover:text-[#111111] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-red-500" />
                  <span>Close & Discard</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white border border-[#D4AF37] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>{editingMember ? "Save Changes" : "Create Team Member"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
