import React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import careerGrowthJourneyWebp from "../assets/heroes/careers-growth-journey.webp";
import careerGrowthJourneyJpg from "../assets/heroes/careers-growth-journey.jpg";

// Ascending career milestone waypoints along the growth curve
const careerMilestones = [
  { left: "22%", top: "78%", label: "Foundation", delay: 0 },
  { left: "38%", top: "62%", label: "Mastery", delay: 1.2 },
  { left: "55%", top: "46%", label: "Leadership", delay: 2.4 },
  { left: "74%", top: "28%", label: "Impact", delay: 3.6 },
  { left: "88%", top: "18%", label: "Zenith", delay: 4.8 },
];

// Upward rising career ambition spark particles
const risingSparks = [
  { left: "20%", top: "82%", size: 6, delay: 0, dur: 4.5 },
  { left: "32%", top: "70%", size: 5, delay: 1.1, dur: 5.2 },
  { left: "45%", top: "58%", size: 7, delay: 2.3, dur: 4.8 },
  { left: "60%", top: "48%", size: 6, delay: 0.7, dur: 5.6 },
  { left: "72%", top: "36%", size: 5, delay: 2.9, dur: 4.2 },
  { left: "84%", top: "25%", size: 7, delay: 1.8, dur: 5.0 },
];

export const CareerGrowthHeroVisual: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 28, mass: 0.75 });
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 28, mass: 0.75 });
  const imageX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const imageY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const rotateX = useTransform(smoothY, [-1, 1], [1, -1]);
  const rotateY = useTransform(smoothX, [-1, 1], [-1.2, 1.2]);

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
      {/* Dynamic Animated Growth Journey Image Layer */}
      <motion.div
        className="absolute -inset-4 origin-center will-change-transform"
        style={reduceMotion ? undefined : { x: imageX, y: imageY, rotateX, rotateY }}
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1.02, 1.06, 1.02],
                y: [0, -4, 0],
              }
        }
        transition={{
          duration: 14,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <picture>
          <source srcSet={careerGrowthJourneyWebp} type="image/webp" />
          <img
            src={careerGrowthJourneyJpg}
            alt="Career Growth Trajectory"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="h-full w-full object-cover object-center opacity-85 sm:opacity-90 filter contrast-[1.08] brightness-[1.02] saturate-[1.06]"
          />
        </picture>
      </motion.div>

      {/* Atmospheric read-friendly gradient overlays (keeps text crisp while showcasing the visual) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-[#FAF9F5]/45 to-[#FAF9F5]/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/30 to-white/70" />

      {/* SVG Ascending Career Growth Trajectory Vectors */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="career-path-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#F5D77F" stopOpacity="0.95" />
          </linearGradient>
          <filter id="career-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Underlying continuous upward growth trajectory curve */}
        <path
          d="M 50 560 Q 280 500 420 370 T 820 180 T 960 90"
          fill="none"
          stroke="url(#career-path-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 6"
          className="opacity-70"
        />

        {/* 2. Secondary parallel momentum streamline */}
        <path
          d="M 120 580 Q 320 520 460 390 T 860 200 T 980 110"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="2 4"
          className="opacity-40"
        />

        {/* 3. Fast animated energy pulses climbing up the trajectory */}
        {!reduceMotion && (
          <>
            <circle r="4.5" fill="#D4AF37" filter="url(#career-glow)" className="opacity-95">
              <animateMotion
                path="M 50 560 Q 280 500 420 370 T 820 180 T 960 90"
                dur="4.8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="3.5" fill="#FFF2B2" filter="url(#career-glow)" className="opacity-85">
              <animateMotion
                path="M 50 560 Q 280 500 420 370 T 820 180 T 960 90"
                dur="4.8s"
                begin="2.4s"
                repeatCount="indefinite"
              />
            </circle>
          </>
        )}
      </svg>

      {/* Ascending Career Milestone Waypoints (Aligned with growth trajectory) */}
      {!reduceMotion &&
        careerMilestones.map((ms, idx) => (
          <div
            key={`career-ms-${idx}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: ms.left, top: ms.top }}
          >
            {/* Glowing animated halo */}
            <motion.span
              className="absolute -inset-2.5 rounded-full bg-[#D4AF37]/25 blur-sm"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.3, 0.75, 0.3],
              }}
              transition={{
                duration: 3.2,
                delay: ms.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Core golden marker node */}
            <span className="relative flex h-3 w-3 items-center justify-center rounded-full border border-white bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
          </div>
        ))}

      {/* Ascending Ambition Sparks (Rising upward like sparks of success) */}
      {!reduceMotion &&
        risingSparks.map((spark, idx) => (
          <motion.span
            key={`spark-${idx}`}
            className="absolute rounded-full bg-gradient-to-t from-[#D4AF37] to-[#FFF2B2] shadow-[0_0_8px_rgba(212,175,55,0.8)] pointer-events-none"
            style={{
              left: spark.left,
              top: spark.top,
              width: spark.size,
              height: spark.size,
            }}
            animate={{
              y: [0, -35, -75],
              x: [0, 10, 20],
              opacity: [0, 0.9, 0],
              scale: [0.7, 1.2, 0.6],
            }}
            transition={{
              duration: spark.dur,
              delay: spark.delay,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        ))}

      {/* Ambient warm radial golden glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[740px] h-[340px] bg-[#D4AF37]/16 rounded-full blur-[110px] pointer-events-none" />
    </div>
  );
};
