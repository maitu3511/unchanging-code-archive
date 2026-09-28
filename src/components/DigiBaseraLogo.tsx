import React from "react";
import monogramWebp from "../assets/digibasera-monogram-clean.webp";
import monogramPng from "../assets/digibasera-monogram-clean.png";
import wordmarkWebp from "../assets/digibasera-wordmark.webp";
import wordmarkPng from "../assets/digibasera-wordmark.png";
import wordmarkTitleWebp from "../assets/digibasera-wordmark-title.webp";
import wordmarkTitlePng from "../assets/digibasera-wordmark-title.png";

interface DigiBaseraLogoProps {
  variant?: "light" | "dark" | "full-gold";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  layout?: "horizontal" | "vertical" | "mark-only";
}

export const DigiBaseraLogo: React.FC<DigiBaseraLogoProps> = ({
  variant = "light",
  size = "md",
  showTagline = true,
  className = "",
  layout = "horizontal",
}) => {
  // Dimension and scale profiles for perfectly crisp emblem + wordmark
  // Full wordmark (wordmarkWebp/Png) has native 438x150 aspect ratio (2.92:1)
  // Title-only (wordmarkTitleWebp/Png) has native 438x105 aspect ratio (4.17:1)
  const sizeMap = {
    sm: {
      markH: 34,
      markW: 29,
      wmH: showTagline ? 30 : 22,
      wmW: showTagline ? 88 : 92,
      gap: "gap-2.5",
    },
    md: {
      markH: 42,
      markW: 36,
      wmH: showTagline ? 38 : 26,
      wmW: showTagline ? 111 : 108,
      gap: "gap-2.5",
    },
    lg: {
      markH: 52,
      markW: 44,
      wmH: showTagline ? 46 : 32,
      wmW: showTagline ? 134 : 133,
      gap: "gap-3",
    },
    xl: {
      markH: 68,
      markW: 58,
      wmH: showTagline ? 60 : 42,
      wmW: showTagline ? 175 : 175,
      gap: "gap-3.5",
    },
  };

  const currentSize = sizeMap[size];
  const isDark = variant === "dark";

  return (
    <div
      className={`inline-flex ${
        layout === "vertical" ? "flex-col items-center text-center" : "items-center"
      } ${currentSize.gap} select-none ${className}`}
      id="digibasera-official-logo"
    >
      {/* Official DigiBasera Monogram (DB Mark) */}
      <div className="relative shrink-0 flex items-center justify-center">
        <picture>
          <source type="image/webp" srcSet={monogramWebp} />
          <img
            src={monogramPng}
            alt="DigiBasera Emblem"
            width={currentSize.markW}
            height={currentSize.markH}
            loading="eager"
            decoding="async"
            style={{ width: `${currentSize.markW}px`, height: `${currentSize.markH}px` }}
            className={`object-contain max-w-full drop-shadow-xs transition-transform duration-300 group-hover:scale-105 ${
              isDark ? "filter drop-shadow-[0_2px_6px_rgba(212,175,55,0.35)]" : ""
            }`}
          />
        </picture>
      </div>

      {/* Official DigiBasera Wordmark in signature brand typography matching reference identity */}
      {layout !== "mark-only" && (
        <div
          className={`flex flex-col justify-center leading-none ${
            layout === "vertical" ? "items-center text-center" : "items-start text-left"
          }`}
        >
          {showTagline ? (
            /* Full Signature Brand Identity Wordmark with luxury typography & "— MARKETING AGENCY —" */
            <picture>
              <source type="image/webp" srcSet={wordmarkWebp} />
              <img
                src={wordmarkPng}
                alt="DigiBasera - Marketing Agency"
                width={currentSize.wmW}
                height={currentSize.wmH}
                loading="eager"
                decoding="async"
                style={{
                  width: `${currentSize.wmW}px`,
                  height: `${currentSize.wmH}px`,
                }}
                className={`object-contain max-w-full transition-opacity duration-200 group-hover:opacity-95 ${
                  isDark
                    ? "filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)] brightness-110"
                    : "filter drop-shadow-xs"
                }`}
              />
            </picture>
          ) : (
            /* Brand Title Only: DigiBasera */
            <picture>
              <source type="image/webp" srcSet={wordmarkTitleWebp} />
              <img
                src={wordmarkTitlePng}
                alt="DigiBasera"
                width={currentSize.wmW}
                height={currentSize.wmH}
                loading="eager"
                decoding="async"
                style={{
                  width: `${currentSize.wmW}px`,
                  height: `${currentSize.wmH}px`,
                }}
                className={`object-contain max-w-full transition-opacity duration-200 group-hover:opacity-95 ${
                  isDark
                    ? "filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.35)] brightness-105"
                    : "filter drop-shadow-xs"
                }`}
              />
            </picture>
          )}
        </div>
      )}
    </div>
  );
};
