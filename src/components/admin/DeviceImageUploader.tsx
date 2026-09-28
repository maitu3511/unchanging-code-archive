import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, X, Link, Check, RefreshCw } from "lucide-react";

interface DeviceImageUploaderProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  recommendedSizeText?: string;
  aspectRatioText?: string;
  presetUrls?: string[];
  shape?: "square" | "cover" | "avatar";
}

export const DeviceImageUploader: React.FC<DeviceImageUploaderProps> = ({
  label,
  value,
  onChange,
  recommendedSizeText = "JPG, PNG, WebP up to 4MB",
  aspectRatioText = "16:9 Landscape or Square",
  presetUrls = [],
  shape = "cover",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [fileError, setFileError] = useState("");
  const [isDeviceFile, setIsDeviceFile] = useState(() => value?.startsWith("data:"));

  const handleFileProcess = (file: File) => {
    setFileError("");
    if (!file.type.startsWith("image/")) {
      setFileError("Please select a valid image file (JPG, PNG, WebP, etc.).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFileError("File is too large (max 4MB). Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        onChange(result);
        setIsDeviceFile(true);
      }
    };
    reader.onerror = () => {
      setFileError("Failed to read image file from device. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setIsDeviceFile(false);
      setUrlDraft("");
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    setIsDeviceFile(false);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isSquareOrAvatar = shape === "square" || shape === "avatar";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
        <span className="text-xs text-neutral-400">{aspectRatioText}</span>
      </div>

      {fileError && (
        <div className="p-2 rounded bg-red-950/80 border border-red-500/50 text-red-300 text-xs flex items-center justify-between">
          <span>{fileError}</span>
          <button
            type="button"
            onClick={() => setFileError("")}
            className="text-red-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {value ? (
        /* Image Preview State */
        <div className="p-3 bg-neutral-900 rounded-xl border border-[#D4AF37]/30 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`relative overflow-hidden border-2 border-[#D4AF37] bg-black shrink-0 shadow-md ${
                isSquareOrAvatar ? "w-20 h-20 rounded-full" : "w-32 h-20 rounded-2xl"
              }`}
            >
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                  {isDeviceFile ? "Device Image Ready" : "Image Connected"}
                </span>
              </div>
              <p className="text-xs text-neutral-300 truncate">
                {isDeviceFile
                  ? "Local image loaded from your device"
                  : value.startsWith("http")
                    ? value
                    : "Custom image attached"}
              </p>
              <p className="text-xs text-neutral-400">Ready to save with changes.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#D4AF37]" />
              <span>Change Photo from Device</span>
            </button>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-950/80 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Remove</span>
            </button>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="ml-auto text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
            >
              <Link className="w-3 h-3" />
              <span>{showUrlInput ? "Hide Link Input" : "Paste URL Instead"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all text-center space-y-2 ${
            isDragging
              ? "border-[#D4AF37] bg-[#D4AF37]/10"
              : "border-white/15 bg-neutral-900/60 hover:border-[#D4AF37]/60 hover:bg-neutral-900"
          }`}
        >
          <div className="w-10 h-10 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Click to upload photo from your device
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">or drag and drop your image file here</p>
          </div>
          <div className="pt-1 flex items-center justify-center gap-2 text-xs text-neutral-400">
            <ImageIcon className="w-3 h-3 text-[#D4AF37]" />
            <span>{recommendedSizeText}</span>
          </div>
        </div>
      )}

      {/* Optional URL Input Dropdown */}
      {(!value || showUrlInput) && (
        <div className="pt-1">
          {!value && !showUrlInput ? (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-xs text-neutral-400 hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors"
            >
              <Link className="w-3 h-3" />
              <span>Or click to paste an external web image link</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3 py-1.5 bg-black border border-white/15 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Apply Link
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="p-1.5 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preset thumbnails if provided */}
      {presetUrls.length > 0 && (
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
            Or choose sample preset:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {presetUrls.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset);
                  setIsDeviceFile(false);
                }}
                className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  value === preset
                    ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-md"
                    : "border-white/20 hover:border-[#D4AF37]/60 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={preset}
                  alt={`Preset ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
