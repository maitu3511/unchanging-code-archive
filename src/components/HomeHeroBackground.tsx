import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { TrendingUp, ShieldCheck, Zap, Search, Sparkles, Award, CheckCircle2 } from "lucide-react";

interface HeroParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
  waveOffset: number;
  life: number;
  maxLife: number;
}

interface HeroSpark {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  alpha: number;
  color: string;
}

// Strategic Digital Agency Growth Pillars (constellation network waypoints)
const agencyWaypoints = [
  { left: "14%", top: "32%", delay: 0, label: "SEO Dominance" },
  { left: "26%", top: "72%", delay: 1.1, label: "Web Velocity" },
  { left: "50%", top: "20%", delay: 2.2, label: "360° Scale" },
  { left: "74%", top: "75%", delay: 3.3, label: "High ROAS" },
  { left: "86%", top: "36%", delay: 4.4, label: "Market Leader" },
];

export const HomeHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Palette: DigiBasera Signature Luxury Gold, Warm Amber, Champagne, Emerald Growth
    const palette = [
      { r: 212, g: 175, b: 55 }, // DigiBasera Signature Gold
      { r: 245, g: 158, b: 11 }, // Warm Amber
      { r: 201, g: 162, b: 39 }, // Champagne Gold
      { r: 16, g: 185, b: 129 }, // Emerald Growth
      { r: 234, g: 179, b: 8 }, // Radiant Gold
    ];

    let particles: HeroParticle[] = [];
    let sparks: HeroSpark[] = [];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = width < 640 ? 26 : width < 1024 ? 40 : 54;
      particles = [];
      sparks = [];

      // Create gentle floating constellation nodes with harmonic wave drift
      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)];
        const maxLife = 6 + Math.random() * 6;
        const baseRadius = 1.4 + Math.random() * 2.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.2 - Math.random() * 0.3, // Upward ascending growth trajectory matching Pricing hero
          radius: baseRadius,
          baseRadius,
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          waveOffset: Math.random() * Math.PI * 2,
          life: Math.random() * maxLife,
          maxLife,
        });
      }

      // Create rising golden prosperity sparks (similar to pricing hero, with gentle horizontal drift)
      const sparkCount = width < 640 ? 12 : 22;
      for (let s = 0; s < sparkCount; s++) {
        sparks.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy: -0.35 - Math.random() * 0.45,
          vx: (Math.random() - 0.5) * 0.2,
          size: 1.2 + Math.random() * 1.8,
          alpha: 0.3 + Math.random() * 0.5,
          color: Math.random() > 0.4 ? "rgba(212, 175, 55," : "rgba(245, 158, 11,",
        });
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const maxDist = width < 640 ? 110 : 145;
      const mouse = mouseRef.current;

      // 1. Update and draw rising prosperity sparks with warm glowing bloom
      for (let s = 0; s < sparks.length; s++) {
        const sp = sparks[s];
        sp.y += sp.vy * (delta * 60);
        sp.x += sp.vx * (delta * 60);

        if (sp.y < -12) {
          sp.y = height + 10;
          sp.x = Math.random() * width;
        }
        if (sp.x < -10) sp.x = width + 10;
        else if (sp.x > width + 10) sp.x = -10;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = `${sp.color} ${sp.alpha})`;
        ctx.shadowColor = "rgba(212, 175, 55, 0.65)";
        ctx.shadowBlur = 7;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Update constellation particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.waveOffset += delta * 1.2;
        const waveX = Math.sin(p.waveOffset) * 0.15;

        p.x += (p.vx + waveX) * (delta * 60);
        p.y += p.vy * (delta * 60);
        p.pulsePhase += p.pulseSpeed;
        p.life += delta;

        // Subtle interactive mouse repulsion
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const distM = Math.sqrt(dxm * dxm + dym * dym);
        if (distM < 140 && distM > 0) {
          const force = (140 - distM) / 140;
          p.x += (dxm / distM) * force * 1.6;
          p.y += (dym / distM) * force * 1.6;
        }

        // Float wrap around bounds
        if (p.y < -15) {
          p.y = height + 10;
          p.x = Math.random() * width;
          p.life = 0;
        }
        if (p.x < -15) p.x = width + 10;
        else if (p.x > width + 15) p.x = -15;
      }

      // 3. Draw connection vectors between nearby nodes (Gradient Stroke)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.32;
            const grad = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y,
            );
            grad.addColorStop(0, `${particles[i].color}, ${alpha})`);
            grad.addColorStop(1, `${particles[j].color}, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.05;
            ctx.stroke();
          }
        }
      }

      // 4. Draw particle milestone nodes (Soft ambient aura + solid golden center)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = 0.85 + Math.sin(p.pulsePhase) * 0.35;
        const r = p.radius * pulse;

        // Outer soft radiant glow aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.3, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}, 0.20)`;
        ctx.fill();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}, 0.92)`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Light Luxury Gradient Canvas Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-[#FAF9F5]" />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-85" />

      {/* Upward Floating Ascending Constellation Canvas (matching Pricing Hero mechanism) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-90" />

      {/* Radiant Golden Glow Orbs with Breathing Pulse */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[720px] sm:w-[960px] h-[450px] bg-[#D4AF37]/15 rounded-full blur-[110px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute top-1/3 -left-20 w-[420px] h-[420px] bg-[#C9A227]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-[460px] h-[460px] bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Agency Growth Strategic Waypoint Nodes with Pulsing Radar Halos */}
      {agencyWaypoints.map((wp, idx) => (
        <div
          key={`home-hero-wp-${idx}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: wp.left, top: wp.top }}
        >
          {/* Glowing animated radar halo */}
          <motion.span
            className="absolute -inset-2.5 rounded-full bg-[#D4AF37]/25 blur-sm"
            animate={{
              scale: [1, 1.7, 1],
              opacity: [0.25, 0.75, 0.25],
            }}
            transition={{
              duration: 3.4,
              delay: wp.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Core golden marker node */}
          <span className="relative flex h-3 w-3 items-center justify-center rounded-full border border-white bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.9)]" />
        </div>
      ))}

      {/* Soft Center Scrim for Pristine Typography Contrast & Reading Clarity */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[65%] bg-radial from-white/90 via-white/50 to-transparent rounded-full blur-2xl pointer-events-none z-[1]" />

      {/* Floating Transparent Glassmorphic Agency Badges (Matching Pricing Hero Luxury Design) */}
      {/* 1. Google & Meta Partner - Top Left */}
      <motion.div
        animate={{
          y: [-7, 7, -7],
          x: [-3, 3, -3],
          rotate: [0, 1.5, -1.5, 0],
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[18%] left-[4%] hidden xl:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 border border-[#D4AF37]/45 shadow-xs backdrop-blur-md text-[#9A7B16] text-xs font-semibold"
      >
        <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <span className="font-fonarto text-[#111111]">Google & Meta Certified Partner</span>
      </motion.div>

      {/* 2. High ROAS Performance - Top Right */}
      <motion.div
        animate={{
          y: [7, -7, 7],
          x: [3, -3, 3],
          rotate: [0, -1.5, 1.5, 0],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        className="absolute top-[16%] right-[4%] hidden xl:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 border border-emerald-500/35 shadow-xs backdrop-blur-md text-emerald-800 text-xs font-semibold"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
        <span className="font-fonarto text-[#111111]">8.4x Verified Performance ROAS</span>
      </motion.div>

      {/* 3. 0.65s Fluid Web Speed - Bottom Left */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          x: [2, -2, 2],
        }}
        transition={{
          duration: 7.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute bottom-[20%] left-[5%] hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/95 border border-[#E8E1D0] shadow-xs backdrop-blur-xs text-[#1F2937] text-xs font-semibold"
      >
        <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span className="font-fonarto text-[#111111]">
          0.65s Fluid Load Speed • Core Web Vitals
        </span>
      </motion.div>

      {/* 4. Page 1 Google SEO Dominance - Bottom Right */}
      <motion.div
        animate={{
          y: [6, -6, 6],
          x: [-2, 2, -2],
        }}
        transition={{
          duration: 8.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.8,
        }}
        className="absolute bottom-[18%] right-[5%] hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/95 border border-[#E8E1D0] shadow-xs backdrop-blur-xs text-[#1F2937] text-xs font-semibold"
      >
        <Search className="w-3.5 h-3.5 text-[#0A66C2]" />
        <span className="font-fonarto text-[#111111]">Rank 1 Google Organic Rankings</span>
      </motion.div>
    </div>
  );
};
