import React, { useEffect, useRef } from "react";
import {
  Code2,
  TrendingUp,
  Search,
  Sparkles,
  Smartphone,
  Share2,
  Palette,
  ShieldCheck,
} from "lucide-react";

interface ServiceConstellationNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
}

interface ServiceIconNode {
  id: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  phaseX: number;
  phaseY: number;
  pulsePhase: number;
}

interface ServicePacket {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
  color: string;
}

const SERVICE_ROUND_ICONS = [
  { id: "web-dev", label: "Web Dev", Icon: Code2 },
  { id: "seo-rank", label: "SEO Growth", Icon: Search },
  { id: "mobile-app", label: "Mobile Apps", Icon: Smartphone },
  { id: "perf-ads", label: "Ad ROAS", Icon: TrendingUp },
  { id: "branding", label: "UI / UX", Icon: Palette },
  { id: "social-media", label: "Social", Icon: Share2 },
  { id: "creative-ai", label: "Creative Media", Icon: Sparkles },
  { id: "cyber-security", label: "Security", Icon: ShieldCheck },
];

export const ServicesHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const iconDomRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Palette: DigiBasera Luxury Gold, Electric Sapphire, Champagne, Warm Amber
    const palette = [
      { r: 212, g: 175, b: 55 }, // DigiBasera Signature Gold
      { r: 201, g: 162, b: 39 }, // Warm Champagne Gold
      { r: 79, g: 70, b: 229 }, // Tech Indigo
      { r: 234, g: 179, b: 8 }, // Amber Accent
      { r: 16, g: 185, b: 129 }, // Success Emerald
    ];

    let constellationNodes: ServiceConstellationNode[] = [];
    let iconNodes: ServiceIconNode[] = [];
    let packets: ServicePacket[] = [];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = width < 640 ? 26 : width < 1024 ? 38 : 50;
      constellationNodes = [];
      packets = [];

      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)];
        constellationNodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: 1.5 + Math.random() * 2,
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }

      // Explicitly placed in clear zones so:
      // 1. The 2 icons under search bar sit cleanly below it in the lower clearing
      // 2. The icon under "systems" (UI/UX) is positioned lower, completely unobstructed
      // 3. Flanks are balanced and open
      const isMobile = width < 768;

      const iconConfigs = [
        // 1. Web Dev (Top Left Flank)
        {
          id: "web-dev",
          label: "Web Dev",
          Icon: Code2,
          xPct: isMobile ? 0.12 : 0.09,
          yPct: isMobile ? 0.18 : 0.2,
        },
        // 2. SEO Growth (Top Right Flank)
        {
          id: "seo-rank",
          label: "SEO Growth",
          Icon: Search,
          xPct: isMobile ? 0.88 : 0.91,
          yPct: isMobile ? 0.18 : 0.2,
        },
        // 3. Mobile Apps (Mid Left Flank)
        {
          id: "mobile-app",
          label: "Mobile Apps",
          Icon: Smartphone,
          xPct: isMobile ? 0.09 : 0.08,
          yPct: isMobile ? 0.48 : 0.5,
        },
        // 4. Ad ROAS (Mid Right Flank)
        {
          id: "perf-ads",
          label: "Ad ROAS",
          Icon: TrendingUp,
          xPct: isMobile ? 0.91 : 0.92,
          yPct: isMobile ? 0.48 : 0.5,
        },
        // 5. UI / UX (Below "systems" text in paragraph, positioned comfortably lower)
        {
          id: "branding",
          label: "UI / UX",
          Icon: Palette,
          xPct: isMobile ? 0.18 : 0.22,
          yPct: isMobile ? 0.86 : 0.86,
        },
        // 6. Social Media (Directly below search bar - Left side, placed lower for crystal clear view)
        {
          id: "social-media",
          label: "Social",
          Icon: Share2,
          xPct: isMobile ? 0.39 : 0.41,
          yPct: isMobile ? 0.88 : 0.88,
        },
        // 7. Creative Media (Directly below search bar - Right side, placed lower for crystal clear view)
        {
          id: "creative-ai",
          label: "Creative Media",
          Icon: Sparkles,
          xPct: isMobile ? 0.61 : 0.59,
          yPct: isMobile ? 0.88 : 0.88,
        },
        // 8. Cyber Security (Lower Right Clearing)
        {
          id: "cyber-security",
          label: "Security",
          Icon: ShieldCheck,
          xPct: isMobile ? 0.82 : 0.78,
          yPct: isMobile ? 0.86 : 0.86,
        },
      ];

      iconNodes = iconConfigs.map((cfg, idx) => {
        const baseX = Math.max(30, Math.min(width - 30, width * cfg.xPct));
        const baseY = Math.max(30, Math.min(height - 30, height * cfg.yPct));
        return {
          id: cfg.id,
          label: cfg.label,
          Icon: cfg.Icon,
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          phaseX: idx * 1.35,
          phaseY: idx * 1.65 + 0.8,
          pulsePhase: idx * 0.9,
        };
      });
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const maxDist = width < 640 ? 115 : 155;
      const activeConnections: { x1: number; y1: number; x2: number; y2: number }[] = [];
      const centerX = width / 2;
      const centerY = height * 0.42;
      const corridorRadiusX = width * 0.34;
      const corridorRadiusY = height * 0.32;

      // 1. Update Constellation Nodes
      for (let i = 0; i < constellationNodes.length; i++) {
        const n = constellationNodes[i];
        n.x += n.vx * (delta * 60);
        n.y += n.vy * (delta * 60);
        n.pulsePhase += n.pulseSpeed;

        if (n.x < -10) n.x = width + 10;
        else if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        else if (n.y > height + 10) n.y = -10;
      }

      // 2. Update Round Icon Nodes (Harmonic organic floating around designated anchor positions)
      for (let k = 0; k < iconNodes.length; k++) {
        const iconNode = iconNodes[k];
        const floatX =
          Math.sin(time * 0.0013 + iconNode.phaseX) * 9 +
          Math.cos(time * 0.0008 + iconNode.phaseY) * 5;
        const floatY =
          Math.cos(time * 0.0015 + iconNode.phaseY) * 7 +
          Math.sin(time * 0.0011 + iconNode.phaseX) * 4;

        iconNode.x = iconNode.baseX + floatX;
        iconNode.y = iconNode.baseY + floatY;
        iconNode.pulsePhase += 0.03;

        // Sync corresponding Round Icon DOM element position
        const domEl = iconDomRefs.current[k];
        if (domEl) {
          domEl.style.transform = `translate3d(${iconNode.x - 22}px, ${iconNode.y - 22}px, 0)`;
        }
      }

      // 3. Draw Connection Lines between Constellation Nodes
      for (let i = 0; i < constellationNodes.length; i++) {
        for (let j = i + 1; j < constellationNodes.length; j++) {
          const dx = constellationNodes[i].x - constellationNodes[j].x;
          const dy = constellationNodes[i].y - constellationNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            activeConnections.push({
              x1: constellationNodes[i].x,
              y1: constellationNodes[i].y,
              x2: constellationNodes[j].x,
              y2: constellationNodes[j].y,
            });

            // Subtle center corridor text masking factor
            const midX = (constellationNodes[i].x + constellationNodes[j].x) / 2;
            const midY = (constellationNodes[i].y + constellationNodes[j].y) / 2;
            const normX = Math.abs(midX - centerX) / corridorRadiusX;
            const normY = Math.abs(midY - centerY) / corridorRadiusY;
            const centerDist = Math.sqrt(normX * normX + normY * normY);

            const centerFactor = Math.min(Math.max(centerDist - 0.25, 0.15), 1);
            const baseAlpha = (1 - dist / maxDist) * 0.42;
            const alpha = baseAlpha * centerFactor;

            const grad = ctx.createLinearGradient(
              constellationNodes[i].x,
              constellationNodes[i].y,
              constellationNodes[j].x,
              constellationNodes[j].y,
            );
            grad.addColorStop(0, `${constellationNodes[i].color}, ${alpha})`);
            grad.addColorStop(1, `${constellationNodes[j].color}, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(constellationNodes[i].x, constellationNodes[i].y);
            ctx.lineTo(constellationNodes[j].x, constellationNodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.15;
            ctx.stroke();
          }
        }
      }

      // 4. Draw Connection Lines between Round Icon Nodes and Constellation Nodes
      for (let k = 0; k < iconNodes.length; k++) {
        const iconNode = iconNodes[k];

        // Connect to nearby regular nodes
        for (let i = 0; i < constellationNodes.length; i++) {
          const dx = iconNode.x - constellationNodes[i].x;
          const dy = iconNode.y - constellationNodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist * 1.25) {
            activeConnections.push({
              x1: iconNode.x,
              y1: iconNode.y,
              x2: constellationNodes[i].x,
              y2: constellationNodes[i].y,
            });

            const alpha = (1 - dist / (maxDist * 1.25)) * 0.48;
            const grad = ctx.createLinearGradient(
              iconNode.x,
              iconNode.y,
              constellationNodes[i].x,
              constellationNodes[i].y,
            );
            grad.addColorStop(0, `rgba(212, 175, 55, ${alpha})`);
            grad.addColorStop(1, `${constellationNodes[i].color}, ${alpha * 0.6})`);

            ctx.beginPath();
            ctx.moveTo(iconNode.x, iconNode.y);
            ctx.lineTo(constellationNodes[i].x, constellationNodes[i].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }

        // Connect to other nearby Round Icon Nodes in the same cluster
        for (let m = k + 1; m < iconNodes.length; m++) {
          const otherIcon = iconNodes[m];
          const dx = iconNode.x - otherIcon.x;
          const dy = iconNode.y - otherIcon.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist * 1.5) {
            activeConnections.push({
              x1: iconNode.x,
              y1: iconNode.y,
              x2: otherIcon.x,
              y2: otherIcon.y,
            });

            const alpha = (1 - dist / (maxDist * 1.5)) * 0.42;
            ctx.beginPath();
            ctx.moveTo(iconNode.x, iconNode.y);
            ctx.lineTo(otherIcon.x, otherIcon.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 1.35;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // 5. Draw Glowing Aura Rings on Canvas for Round Icon Nodes
      for (let k = 0; k < iconNodes.length; k++) {
        const iconNode = iconNodes[k];
        const pulse = Math.sin(iconNode.pulsePhase);
        const ringRadius = 24 + pulse * 3.5;

        // Outer ambient glow ring
        ctx.beginPath();
        ctx.arc(iconNode.x, iconNode.y, ringRadius + 4, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(212, 175, 55, 0.32)";
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // Inner soft highlight halo
        ctx.beginPath();
        ctx.arc(iconNode.x, iconNode.y, ringRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212, 175, 55, 0.09)";
        ctx.fill();
      }

      // 6. Spawn and Animate Energy Data Packets
      if (activeConnections.length > 0 && packets.length < 16 && Math.random() < 0.12) {
        const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        packets.push({
          fromX: conn.x1,
          fromY: conn.y1,
          toX: conn.x2,
          toY: conn.y2,
          progress: 0,
          speed: 0.014 + Math.random() * 0.018,
          color: Math.random() > 0.4 ? "rgba(212, 175, 55, 0.95)" : "rgba(79, 70, 229, 0.9)",
        });
      }

      for (let pIdx = packets.length - 1; pIdx >= 0; pIdx--) {
        const p = packets[pIdx];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(pIdx, 1);
          continue;
        }

        const px = p.fromX + (p.toX - p.fromX) * p.progress;
        const py = p.fromY + (p.toY - p.fromY) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 7. Draw Standard Constellation Nodes
      for (let i = 0; i < constellationNodes.length; i++) {
        const n = constellationNodes[i];
        const pulse = 0.85 + Math.sin(n.pulsePhase) * 0.3;
        const r = n.radius * pulse;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}, 0.2)`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}, 0.92)`;
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
      {/* Light Luxury Gradient Canvas Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FAF9F5] to-white" />

      {/* Luminous Warm Gold & Indigo Ambient Radiance */}
      <div className="absolute -top-8 left-1/4 w-[500px] h-[320px] bg-[#D4AF37]/15 rounded-full blur-[85px]" />
      <div className="absolute top-1/3 -right-10 w-[520px] h-[340px] bg-indigo-400/12 rounded-full blur-[95px]" />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[650px] h-[280px] bg-amber-400/15 rounded-full blur-[80px]" />

      {/* Fluid Dynamic Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* Center Reading Field Soft Scrim positioned gently behind text heading only (z-[1]) */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[60%] bg-radial from-white/90 via-white/50 to-transparent rounded-full blur-xl pointer-events-none z-[1]" />

      {/* Round Animated Service Icon Spheres (Attached & Synchronized to Network Movement, on top z-[2]) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
        {SERVICE_ROUND_ICONS.map((item, idx) => {
          const Icon = item.Icon;
          return (
            <div
              key={item.id}
              ref={(el) => {
                iconDomRefs.current[idx] = el;
              }}
              style={{
                willChange: "transform",
                transform: "translate3d(-100px, -100px, 0)",
              }}
              className="absolute top-0 left-0 w-11 h-11 rounded-full bg-white border-2 border-[#D4AF37] shadow-[0_4px_18px_rgba(212,175,55,0.38)] flex items-center justify-center text-[#9A7B16] backdrop-blur-md transition-shadow group pointer-events-auto cursor-pointer hover:scale-115 hover:shadow-[0_4px_24px_rgba(212,175,55,0.65)] hover:border-[#9A7B16]"
              title={item.label}
            >
              {/* Outer pulsing ring */}
              <span className="absolute inset-0 rounded-full border border-[#D4AF37]/50 animate-ping opacity-25 pointer-events-none" />

              {/* Service Icon inside the Round Sphere */}
              <Icon className="w-5 h-5 text-[#9A7B16] group-hover:scale-110 group-hover:text-[#D4AF37] transition-all" />

              {/* Mini Label Badge under the round sphere */}
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full bg-white/95 border border-[#E8E1D0] text-xs font-bold text-[#9A7B16] whitespace-nowrap shadow-xs opacity-85 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-mono">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
