import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Copy,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  Calendar,
  Clock,
  Tag,
  HelpCircle,
  ListOrdered,
  Eye,
} from "lucide-react";
import { BlogPost } from "../../types";
import {
  loadStoredBlogPosts,
  saveBlogPosts,
  resetBlogPostsToFactoryDefaults,
  BLOG_POSTS_DATA,
} from "../../data/blogData";
import { DeviceImageUploader } from "./DeviceImageUploader";

const BLOG_IMAGE_PRESETS = [
  {
    label: "SEO & Growth",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Paid Ads & Analytics",
    url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Web Development & Tech",
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Brand & Creative Design",
    url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Local Business & Retail",
    url: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "WhatsApp & AI Automation",
    url: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80",
  },
];

const CATEGORIES = [
  "SEO & Search",
  "Paid Media & ROAS",
  "Web Engineering",
  "Brand & Creative",
  "E-Commerce & Shopify",
  "WhatsApp & AI Automation",
  "Local Rajkot Business",
];

export const AdminBlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notification, setNotification] = useState<{
    msg: string;
    type: "success" | "info";
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [readTime, setReadTime] = useState("6 min read");
  const [publishedDate, setPublishedDate] = useState("September 2026");
  const [authorName, setAuthorName] = useState("Firasat Ali");
  const [authorRole, setAuthorRole] = useState("Founder & Chief Strategist");
  const [authorAvatar, setAuthorAvatar] = useState(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  );
  const [contentRaw, setContentRaw] = useState("");
  const [tagsRaw, setTagsRaw] = useState("#DigitalMarketing, #SEO, #Growth");
  const [takeawaysRaw, setTakeawaysRaw] = useState("");
  const [relatedService, setRelatedService] = useState("");

  const loadData = () => {
    setPosts(loadStoredBlogPosts());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => setPosts(loadStoredBlogPosts());
    window.addEventListener("digibasera_blogs_updated", handleUpdate);
    return () => window.removeEventListener("digibasera_blogs_updated", handleUpdate);
  }, []);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setCategory(CATEGORIES[0]);
    setCustomCategory("");
    setExcerpt("");
    setImageUrl(BLOG_IMAGE_PRESETS[0].url);
    setReadTime("7 min read");
    setPublishedDate(new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }));
    setAuthorName("Firasat Ali");
    setAuthorRole("Founder & Chief Strategist");
    setAuthorAvatar(
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    );
    setContentRaw(
      "In today's hyper-competitive digital ecosystem, acquiring high-intent customers requires a structured, data-driven approach.\n\nEvery marketing touchpoint must be engineered to deliver measurable commercial returns. Brands that combine technical agility with sharp messaging consistently dominate their category.\n\nHere are the key strategic principles to implement in your next growth cycle.",
    );
    setTagsRaw("#DigitalMarketing, #BusinessGrowth, #ROI");
    setTakeawaysRaw(
      "Align media budgets with verifiable customer lifetime value.\nEnsure sub-second website speed and mobile UX.\nLeverage multi-channel retargeting for conversion acceleration.",
    );
    setRelatedService("Enterprise 360° Retainer");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug || post.id);
    if (CATEGORIES.includes(post.category)) {
      setCategory(post.category);
      setCustomCategory("");
    } else {
      setCategory("Custom");
      setCustomCategory(post.category);
    }
    setExcerpt(post.excerpt);
    setImageUrl(post.imageUrl);
    setReadTime(post.readTime || "7 min read");
    setPublishedDate(post.publishedDate || "September 2026");
    setAuthorName(post.author?.name || "DigiBasera Team");
    setAuthorRole(post.author?.role || "Growth Consultant");
    setAuthorAvatar(
      post.author?.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    );
    setContentRaw(
      Array.isArray(post.content) ? post.content.join("\n\n") : String(post.content || ""),
    );
    setTagsRaw(post.tags ? post.tags.join(", ") : "");
    setTakeawaysRaw(post.takeaways ? post.takeaways.join("\n") : "");
    setRelatedService(post.relatedService || "");
    setIsModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter an article title");
      return;
    }
    if (!imageUrl.trim()) {
      alert("Please enter a cover image URL");
      return;
    }
    if (!excerpt.trim()) {
      alert("Please enter a short excerpt summary");
      return;
    }

    const finalCategory =
      category === "Custom" ? customCategory.trim() || "General Growth" : category;
    const finalSlug =
      slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const parsedContent = contentRaw
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const parsedTags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    const parsedTakeaways = takeawaysRaw
      .split("\n")
      .map((t) => t.trim().replace(/^[-•*]\s*/, ""))
      .filter((t) => t.length > 0);

    if (editingPost) {
      // Update existing
      const updated = posts.map((p) =>
        p.id === editingPost.id
          ? {
              ...p,
              title: title.trim(),
              slug: finalSlug,
              category: finalCategory,
              excerpt: excerpt.trim(),
              imageUrl: imageUrl.trim(),
              readTime: readTime.trim(),
              publishedDate: publishedDate.trim(),
              author: {
                ...p.author,
                name: authorName.trim(),
                role: authorRole.trim(),
                avatar: authorAvatar.trim(),
              },
              content: parsedContent.length > 0 ? parsedContent : [excerpt.trim()],
              tags: parsedTags,
              takeaways: parsedTakeaways.length > 0 ? parsedTakeaways : p.takeaways,
              relatedService: relatedService.trim() || p.relatedService,
            }
          : p,
      );
      saveBlogPosts(updated);
      setPosts(updated);
      showToast(`Updated blog: "${title}"`);
    } else {
      // Create new
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        slug: finalSlug,
        title: title.trim(),
        category: finalCategory,
        excerpt: excerpt.trim(),
        imageUrl: imageUrl.trim(),
        readTime: readTime.trim() || "6 min read",
        publishedDate: publishedDate.trim() || "September 2026",
        author: {
          name: authorName.trim() || "DigiBasera Team",
          role: authorRole.trim() || "Growth Consultant",
          avatar:
            authorAvatar.trim() ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          bio: "Senior Digital Growth Specialist at DigiBasera.",
        },
        content: parsedContent.length > 0 ? parsedContent : [excerpt.trim()],
        tags: parsedTags,
        takeaways: parsedTakeaways,
        relatedService: relatedService.trim() || "Enterprise 360° Retainer",
      };

      const updated = [newPost, ...posts];
      saveBlogPosts(updated);
      setPosts(updated);
      showToast(`Published new blog: "${title}"`);
    }

    setIsModalOpen(false);
  };

  const handleDeletePost = (id: string, postTitle: string) => {
    if (window.confirm(`Are you sure you want to delete this blog post?\n\n"${postTitle}"`)) {
      const updated = posts.filter((p) => p.id !== id);
      saveBlogPosts(updated);
      setPosts(updated);
      showToast(`Deleted blog: "${postTitle}"`);
    }
  };

  const handleDuplicatePost = (post: BlogPost) => {
    const duplicated: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      slug: `${post.slug || post.id}-copy`,
      title: `${post.title} (Copy)`,
      publishedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    const updated = [duplicated, ...posts];
    saveBlogPosts(updated);
    setPosts(updated);
    showToast(`Duplicated post as draft`);
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        "Reset all blogs to original factory defaults? Any custom blogs or modifications will be replaced with initial articles.",
      )
    ) {
      const defaults = resetBlogPostsToFactoryDefaults();
      setPosts(defaults);
      showToast("Reset all blog articles to factory defaults", "info");
    }
  };

  // Filtered
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCat = selectedCategory === "all" ? true : post.category === selectedCategory;

    return matchesSearch && matchesCat;
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
                Knowledge & Editorial Suite
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#111111] font-heading mt-1">
              Blog & Strategic Insights Manager ({posts.length})
            </h2>
            <p className="text-xs text-[#666666] mt-1">
              Create new articles, edit titles, update cover images, rewrite content, or delete
              existing posts from the public Blog page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white border border-[#D4AF37] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>Add New Blog Article</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              className="px-3.5 py-2.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F2EFE9] text-[#666666] hover:text-[#111111] border border-[#E8E1D0] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset to factory preset articles"
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
              placeholder="Search blogs by title, keywords or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg pl-9 pr-4 py-2 text-xs text-[#111111] focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-[#111111] focus:outline-none"
            >
              <option value="all">All Categories ({posts.length})</option>
              {Array.from(new Set(posts.map((p) => p.category))).map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({posts.filter((p) => p.category === cat).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-[#E8E1D0] space-y-3">
          <BookOpen className="w-10 h-10 text-[#888888] mx-auto opacity-50" />
          <p className="text-sm font-semibold text-[#111111]">
            No blog articles match your filters
          </p>
          <p className="text-xs text-[#666666]">
            Try a different search term or click "Add New Blog Article" to create one.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-[#E8E1D0] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 bg-[#111111] overflow-hidden group">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#D4AF37] px-2.5 py-0.5 rounded shadow-xs">
                      {post.category}
                    </span>
                    <span className="text-xs text-white/90 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{post.readTime || "6 min read"}</span>
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-2.5">
                  <h3 className="text-sm font-bold text-[#111111] font-heading line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#666666] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="pt-2 border-t border-[#E8E1D0]/70 flex items-center justify-between text-xs text-[#777777]">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={post.author?.avatar}
                        alt={post.author?.name}
                        className="w-5 h-5 rounded-full object-cover border-2 border-[#D4AF37]"
                      />
                      <span className="font-semibold text-[#111111] truncate max-w-[120px]">
                        {post.author?.name || "Author"}
                      </span>
                    </div>

                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#9A7B16]" />
                      <span>{post.publishedDate || "2026"}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-3 bg-[#FAF9F5] border-t border-[#E8E1D0] flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider truncate max-w-[120px]">
                  ID: {post.id}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicatePost(post)}
                    className="p-1.5 rounded-md bg-white hover:bg-[#EFEFEA] border border-[#E8E1D0] text-[#555555] transition-colors"
                    title="Duplicate article draft"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(post)}
                    className="px-2.5 py-1.5 rounded-md bg-white hover:bg-[#EFEFEA] border border-[#E8E1D0] text-[#111111] text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Edit blog details and image"
                  >
                    <Edit3 className="w-3 h-3 text-[#9A7B16]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="p-1.5 rounded-md bg-white hover:bg-red-50 border border-[#E8E1D0] hover:border-red-200 text-red-600 transition-colors"
                    title="Delete blog post"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Blog Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-2xl border border-[#E8E1D0] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#FAF9F5] border-b border-[#E8E1D0] flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#9A7B16] font-heading">
                  Blog Editorial Studio
                </span>
                <h3 className="text-lg font-bold text-[#111111] font-heading">
                  {editingPost
                    ? `Edit Blog Article: ${editingPost.title}`
                    : "Create New Blog Article"}
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

            {/* Modal Body: Scrollable */}
            <form onSubmit={handleSavePost} className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Form: Content & Meta (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Complete Modern SEO Guide: Dominating Google Search"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
                    />
                  </div>

                  {/* Slug & Category */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. modern-seo-guide-google-rankings"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="Custom">+ Custom Category...</option>
                      </select>
                    </div>
                  </div>

                  {category === "Custom" && (
                    <div>
                      <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                        Enter Custom Category Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Growth Hacking & AI"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Cover Image Upload via DeviceImageUploader */}
                  <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E8E1D0] space-y-3">
                    <DeviceImageUploader
                      label="Cover Image (Upload from device or enter link) *"
                      value={imageUrl}
                      onChange={(val) => setImageUrl(val)}
                      recommendedSizeText="Upload banner from your device or paste URL (JPG, PNG, WebP up to 4MB)"
                      aspectRatioText="16:9 Landscape Banner"
                    />

                    {/* Image Presets */}
                    <div className="pt-2 border-t border-[#E8E1D0]/60">
                      <span className="text-xs text-[#777777] font-semibold block mb-1.5">
                        Or select from high-resolution verified presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {BLOG_IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImageUrl(preset.url)}
                            className={`text-xs px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                              imageUrl === preset.url
                                ? "bg-[#D4AF37] text-[#111111] font-bold border-[#D4AF37] shadow-xs"
                                : "bg-white text-[#555555] border-[#E8E1D0] hover:bg-[#FAF9F5]"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Excerpt Summary */}
                  <div>
                    <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                      Excerpt / Short Summary (Card Preview) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="A compelling 2-sentence summary describing what readers will gain from this article..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Content Paragraphs */}
                  <div>
                    <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                      Full Article Body (Separate paragraphs with double enter) *
                    </label>
                    <textarea
                      rows={6}
                      required
                      placeholder="Write your article body here. Separate paragraphs with an empty line..."
                      value={contentRaw}
                      onChange={(e) => setContentRaw(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none font-mono"
                    />
                  </div>

                  {/* Key Takeaways */}
                  <div>
                    <label className="block text-xs font-bold text-[#111111] font-heading uppercase tracking-wider mb-1">
                      Key Takeaways (One per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Key takeaway 1&#10;Key takeaway 2&#10;Key takeaway 3"
                      value={takeawaysRaw}
                      onChange={(e) => setTakeawaysRaw(e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-[#E8E1D0] focus:border-[#D4AF37] rounded-lg px-3.5 py-2 text-xs text-[#111111] focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Right Side: Author, Tags, Timing & Preview (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Author Card */}
                  <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E1D0] space-y-3">
                    <span className="text-xs uppercase font-bold text-[#9A7B16] font-heading block">
                      Author Attribution
                    </span>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full bg-white border border-[#E8E1D0] rounded-md px-2.5 py-1.5 text-xs text-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">
                        Author Title / Role
                      </label>
                      <input
                        type="text"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        className="w-full bg-white border border-[#E8E1D0] rounded-md px-2.5 py-1.5 text-xs text-[#111111]"
                      />
                    </div>

                    <div className="pt-1">
                      <DeviceImageUploader
                        label="Author Profile Picture"
                        value={authorAvatar}
                        onChange={(val) => setAuthorAvatar(val)}
                        recommendedSizeText="Device photo or link"
                        aspectRatioText="Square (1:1)"
                      />
                    </div>
                  </div>

                  {/* Metadata: Read Time, Date & Tags */}
                  <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E1D0] space-y-3">
                    <span className="text-xs uppercase font-bold text-[#9A7B16] font-heading block">
                      Publication Details
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-[#111111] mb-1">
                          Read Time
                        </label>
                        <input
                          type="text"
                          value={readTime}
                          onChange={(e) => setReadTime(e.target.value)}
                          className="w-full bg-white border border-[#E8E1D0] rounded-md px-2.5 py-1.5 text-xs text-[#111111]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#111111] mb-1">
                          Date
                        </label>
                        <input
                          type="text"
                          value={publishedDate}
                          onChange={(e) => setPublishedDate(e.target.value)}
                          className="w-full bg-white border border-[#E8E1D0] rounded-md px-2.5 py-1.5 text-xs text-[#111111]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">
                        Tags (Comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="#SEO, #GoogleRankings, #ROI"
                        value={tagsRaw}
                        onChange={(e) => setTagsRaw(e.target.value)}
                        className="w-full bg-white border border-[#E8E1D0] rounded-md px-2.5 py-1.5 text-xs text-[#111111]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#111111] mb-1">
                        Related Service CTA
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. SEO Dominance & GEO Search"
                        value={relatedService}
                        onChange={(e) => setRelatedService(e.target.value)}
                        className="w-full bg-white border border-[#E8E1D0] rounded-md px-2.5 py-1.5 text-xs text-[#111111]"
                      />
                    </div>
                  </div>

                  {/* Card Mini Preview */}
                  <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#D4AF37]/50">
                    <span className="text-xs uppercase font-bold text-[#9A7B16] font-heading block mb-2">
                      Card Preview
                    </span>
                    <div className="bg-white rounded-2xl border-2 border-[#D4AF37] overflow-hidden shadow-sm">
                      <div className="h-28 bg-gray-900 relative">
                        <img
                          src={imageUrl || BLOG_IMAGE_PRESETS[0].url}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = BLOG_IMAGE_PRESETS[0].url;
                          }}
                        />
                        <span className="absolute bottom-1.5 left-1.5 text-xs font-bold bg-[#D4AF37] text-[#111111] px-1.5 py-0.5 rounded">
                          {category === "Custom" ? customCategory || "General" : category}
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <h5 className="text-xs font-bold text-[#111111] line-clamp-1">
                          {title || "Article Title Preview"}
                        </h5>
                        <p className="text-xs text-[#666666] line-clamp-2">
                          {excerpt || "Excerpt summary preview will display here..."}
                        </p>
                      </div>
                    </div>
                  </div>
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
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-black text-white border border-[#D4AF37] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>{editingPost ? "Save Changes" : "Publish Article"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
