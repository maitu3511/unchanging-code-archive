import React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import aboutHeroWebp from "../assets/about-agency-reference-clean.webp";
import aboutHeroJpg from "../assets/about-agency-reference-clean.jpg";

const ambientParticles = [
  { left: "18%", top: "68%", delay: 0 },
  { left: "32%", top: "35%", delay: 2.1 },
  { left: "62%", top: "72%", delay: 1.4 },
  { left: "78%", top: "42%", delay: 3.6 },
  { left: "88%", top: "60%", delay: 2.8 },
];

export const AboutHeroVisual: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 40, damping: 26, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 40, damping: 26, mass: 0.7 });
  const imageX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const imageY = useTransform(smoothY, [-1, 1], [-8, 8]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {/* Dynamic Animated Image Layer with mouse parallax & cinematic zoom */}
      <motion.div
        className="absolute -inset-4 origin-center will-change-transform"
        style={reduceMotion ? undefined : { x: imageX, y: imageY }}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1.02, 1.06, 1.02],
                rotate: [0, 0.4, 0],
              }
        }
        transition={{
          duration: 16,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <picture>
          <source srcSet={aboutHeroWebp} type="image/webp" />
          <img
            src={aboutHeroJpg}
            alt="About DigiBasera Headquarters"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="h-full w-full object-cover object-center opacity-85 sm:opacity-90 filter contrast-[1.07] brightness-[1.02] saturate-[1.06]"
          />
        </picture>
      </motion.div>

      {/* Luminous Light Flare Sweep Animation */}
      {!reduceMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent skew-x-[-22deg] pointer-events-none"
          initial={{ x: "-120%" }}
          animate={{ x: "220%" }}
          transition={{
            duration: 8.5,
            repeat: Infinity,
            repeatDelay: 3.5,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Subtle read-friendly scrim: maintains high visual sharpness while preserving text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-[#FAF9F5]/40 to-[#FAF9F5]/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/35 to-white/70" />

      {/* Ambient Gold Radial Core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[340px] bg-[#D4AF37]/16 rounded-full blur-[100px] pointer-events-none" />

      {/* Floating Ambient Gold Sparks */}
      {!reduceMotion &&
        ambientParticles.map((particle, idx) => (
          <motion.span
            key={`about-particle-${idx}`}
            className="absolute h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.8)] pointer-events-none"
            style={{ left: particle.left, top: particle.top }}
            animate={{
              y: [0, -22, -45],
              opacity: [0, 0.85, 0],
              scale: [0.8, 1.25, 0.8],
            }}
            transition={{
              duration: 6,
              delay: particle.delay,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        ))}
    </div>
  );
};
