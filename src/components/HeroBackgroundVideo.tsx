import React, { useEffect, useRef, useState } from "react";

interface HeroBackgroundVideoProps {
  /** Optional poster / fallback image (also used while the video loads) */
  poster?: string;
  /** Optional public path to the webm fallback source */
  webmSrc?: string;
  /** Public path to the mp4 source */
  mp4Src: string;
  /** Extra classes for the <video> element */
  className?: string;
  /** Final opacity once the video is playing (0-1) */
  opacity?: number;
}

/**
 * Premium background video layer for Hero sections.
 * - Autoplays muted + looped, inline on iOS/Android
 * - Responds smoothly across desktop, tablet, and mobile
 * - Handles autoplay restrictions with user-gesture fallback
 * - Pauses when offscreen via IntersectionObserver for performance
 * - Smooth transition from poster image to playing video
 */
export const HeroBackgroundVideo: React.FC<HeroBackgroundVideoProps> = ({
  poster,
  webmSrc,
  mp4Src,
  className = "",
  opacity = 0.85,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    setHasVideoError(false);

    // Set autoplay-critical properties before every attempt for mobile browsers.
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");

    let isSubscribed = true;

    const attemptPlay = async () => {
      if (!isSubscribed || document.visibilityState === "hidden") return;

      try {
        el.muted = true;
        await el.play();
        if (isSubscribed) {
          setIsPlaying(true);
        }
      } catch {
        // User interaction and visibility listeners below will retry playback.
      }
    };

    const onReady = () => void attemptPlay();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void attemptPlay();
    };

    el.addEventListener("loadeddata", onReady);
    el.addEventListener("canplay", onReady);
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Start loading explicitly, then retry while the media engine initializes.
    el.load();
    void attemptPlay();
    const retryTimers = [250, 750, 1500].map((delay) =>
      window.setTimeout(() => void attemptPlay(), delay),
    );

    // Fallback on first user scroll / touch / click if policy blocked instant autoplay
    const onUserInteraction = () => {
      if (el.paused) {
        void attemptPlay();
      }
      window.removeEventListener("touchstart", onUserInteraction);
      window.removeEventListener("scroll", onUserInteraction);
      window.removeEventListener("click", onUserInteraction);
    };

    window.addEventListener("touchstart", onUserInteraction, { passive: true });
    window.addEventListener("scroll", onUserInteraction, { passive: true });
    window.addEventListener("click", onUserInteraction, { passive: true });

    // IntersectionObserver to pause when offscreen and resume when in view
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!el) return;
            if (entry.isIntersecting) {
              void attemptPlay();
            } else if (!el.paused) {
              el.pause();
            }
          });
        },
        { threshold: 0.05 },
      );
      observer.observe(el);
    }

    return () => {
      isSubscribed = false;
      retryTimers.forEach((timer) => window.clearTimeout(timer));
      el.removeEventListener("loadeddata", onReady);
      el.removeEventListener("canplay", onReady);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("touchstart", onUserInteraction);
      window.removeEventListener("scroll", onUserInteraction);
      window.removeEventListener("click", onUserInteraction);
      if (observer && el) {
        observer.unobserve(el);
        observer.disconnect();
      }
    };
  }, [mp4Src, webmSrc]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
      {/* 1. Instant Fallback Poster Image */}
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.04]"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
      )}

      {/* 2. Smooth Autoplaying Video Stream */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover object-center ${className}`}
        style={{
          opacity: hasVideoError ? 0 : opacity,
          willChange: isPlaying ? "transform" : "auto",
          transition: "opacity 500ms ease",
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster || undefined}
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
        onLoadedData={() => setIsPlaying(true)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setHasVideoError(true);
          setIsPlaying(false);
        }}
      >
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        <source src={mp4Src} type="video/mp4" />
      </video>
    </div>
  );
};

export default HeroBackgroundVideo;
