import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { TrendingUp, ShieldCheck, Zap, CheckCircle2, Sparkles, Award } from "lucide-react";

interface PricingParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
  life: number;
  maxLife: number;
}

interface PricingSpark {
  x: number;
  y: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

// Ascending value milestone waypoints along the growth curve
const valueMilestones = [
  { left: "22%", top: "78%", delay: 0 },
  { left: "38%", top: "62%", delay: 1.2 },
  { left: "55%", top: "46%", delay: 2.4 },
  { left: "74%", top: "28%", delay: 3.6 },
  { left: "88%", top: "18%", delay: 4.8 },
];

export const PricingHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Palette: DigiBasera Luxury Gold, Warm Amber, Success Emerald, Champagne
    const palette = [
      { r: 212, g: 175, b: 55 }, // Signature Gold
      { r: 245, g: 158, b: 11 }, // Amber Prosperity
      { r: 16, g: 185, b: 129 }, // Success Emerald
      { r: 201, g: 162, b: 39 }, // Warm Champagne
      { r: 234, g: 179, b: 8 }, // Gold Ray
    ];

    let particles: PricingParticle[] = [];
    let sparks: PricingSpark[] = [];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = width < 640 ? 24 : width < 1024 ? 36 : 48;
      particles = [];
      sparks = [];

      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)];
        const maxLife = 4 + Math.random() * 4;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.25 - Math.random() * 0.35, // Consistent upward ascending growth drift
          radius: 1.5 + Math.random() * 2,
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          life: Math.random() * maxLife,
          maxLife,
        });
      }

      // Initial rising prosperity sparks
      for (let s = 0; s < 18; s++) {
        sparks.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vy: -0.4 - Math.random() * 0.5,
          size: 1.2 + Math.random() * 1.8,
          alpha: 0.3 + Math.random() * 0.5,
          color: Math.random() > 0.5 ? "rgba(212, 175, 55," : "rgba(245, 158, 11,",
        });
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const maxDist = width < 640 ? 110 : 145;

      // Update particles (upward trajectory)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * (delta * 60);
        p.y += p.vy * (delta * 60);
        p.pulsePhase += p.pulseSpeed;
        p.life += delta;

        // Reset if float out of top bound
        if (p.y < -15) {
          p.y = height + 10;
          p.x = Math.random() * width;
          p.life = 0;
        }
        if (p.x < -15) p.x = width + 10;
        else if (p.x > width + 15) p.x = -15;
      }

      // Update rising sparks
      for (let s = 0; s < sparks.length; s++) {
        const sp = sparks[s];
        sp.y += sp.vy * (delta * 60);
        if (sp.y < -10) {
          sp.y = height + 10;
          sp.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = `${sp.color} ${sp.alpha})`;
        ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw connection vectors between ascending nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.38;

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
            ctx.lineWidth = 1.15;
            ctx.stroke();
          }
        }
      }

      // Draw particle milestone nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const pulse = 0.85 + Math.sin(p.pulsePhase) * 0.3;
        const r = p.radius * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}, 0.22)`;
        ctx.fill();

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
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Upward Floating Ascending Mesh Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block opacity-85" />

      {/* Ascending Milestone Waypoints */}
      {valueMilestones.map((ms, idx) => (
        <div
          key={`pricing-ms-${idx}`}
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

      {/* Floating Transparent Financial Value Tokens */}
      {/* 1. Transparent Pricing & Zero Hidden Fees - Top Left */}
      <motion.div
        animate={{
          y: [-7, 7, -7],
          x: [-3, 3, -3],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] left-[4%] hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 border border-[#D4AF37]/45 shadow-xs backdrop-blur-md text-[#9A7B16] text-xs font-semibold"
      >
        <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <span>100% Upfront Transparent Quotes</span>
      </motion.div>

      {/* 2. High ROAS & Commercial Return - Top Right */}
      <motion.div
        animate={{
          y: [7, -7, 7],
          x: [3, -3, 3],
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        className="absolute top-[18%] right-[4%] hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 border border-emerald-500/35 shadow-xs backdrop-blur-md text-emerald-800 text-xs font-semibold"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
        <span>ROI Target • 4.8x - 6.5x Returns</span>
      </motion.div>

      {/* 3. Milestone Escrow Protection - Bottom Left */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          x: [2, -2, 2],
        }}
        transition={{
          duration: 7.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute bottom-[20%] left-[6%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/85 border border-[#E8E1D0] shadow-xs backdrop-blur-xs text-[#555555] text-xs font-medium"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
        <span>Milestone-Based Secure Delivery</span>
      </motion.div>

      {/* 4. Verified Pan-India SLA Support - Bottom Right */}
      <motion.div
        animate={{
          y: [6, -6, 6],
          x: [-2, 2, -2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.8,
        }}
        className="absolute bottom-[18%] right-[6%] hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/85 border border-[#E8E1D0] shadow-xs backdrop-blur-xs text-[#555555] text-xs font-medium"
      >
        <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Pan-India Retainer Support</span>
      </motion.div>
    </div>
  );
};
