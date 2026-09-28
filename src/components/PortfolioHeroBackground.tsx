import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Layers, Sparkles, TrendingUp, Smartphone, CheckCircle2, Zap } from "lucide-react";

interface PortfolioNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulsePhase: number;
  pulseSpeed: number;
}

interface CreativeFacet {
  i: number;
  j: number;
  k: number;
  alpha: number;
}

interface PortfolioPacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const PortfolioHeroBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Palette: Gold, Emerald Growth, Tech Cyan & Royal Blue
    const palette = [
      { r: 212, g: 175, b: 55 }, // DigiBasera Gold
      { r: 16, g: 185, b: 129 }, // Verified Emerald Growth
      { r: 6, g: 182, b: 212 }, // Tech Cyan
      { r: 59, g: 130, b: 246 }, // Digital Blue
      { r: 245, g: 158, b: 11 }, // Amber Glow
    ];

    let nodes: PortfolioNode[] = [];
    let packets: PortfolioPacket[] = [];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const count = width < 640 ? 28 : width < 1024 ? 40 : 54;
      nodes = [];
      packets = [];

      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)];
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: 1.5 + Math.random() * 2,
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
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
      const activeConnections: { i: number; j: number }[] = [];
      const triangles: CreativeFacet[] = [];

      // Update positions
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * (delta * 60);
        n.y += n.vy * (delta * 60);
        n.pulsePhase += n.pulseSpeed;

        if (n.x < -10) n.x = width + 10;
        else if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        else if (n.y > height + 10) n.y = -10;
      }

      // Draw connection lines and detect triangular facets (Creative Wireframe)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            activeConnections.push({ i, j });
            const alpha = (1 - dist / maxDist) * 0.4;

            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `${nodes[i].color}, ${alpha})`);
            grad.addColorStop(1, `${nodes[j].color}, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.15;
            ctx.stroke();

            // Check for third node to form a creative wireframe polygon facet
            if (triangles.length < 8 && dist < maxDist * 0.75) {
              for (let k = j + 1; k < nodes.length; k++) {
                const dx2 = nodes[j].x - nodes[k].x;
                const dy2 = nodes[j].y - nodes[k].y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                const dx3 = nodes[i].x - nodes[k].x;
                const dy3 = nodes[i].y - nodes[k].y;
                const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

                if (dist2 < maxDist * 0.75 && dist3 < maxDist * 0.75) {
                  triangles.push({
                    i,
                    j,
                    k,
                    alpha: 0.045,
                  });
                  break;
                }
              }
            }
          }
        }
      }

      // Draw creative polygon facets (Subtle 3D Wireframe Glass Fill)
      for (let t = 0; t < triangles.length; t++) {
        const tri = triangles[t];
        ctx.beginPath();
        ctx.moveTo(nodes[tri.i].x, nodes[tri.i].y);
        ctx.lineTo(nodes[tri.j].x, nodes[tri.j].y);
        ctx.lineTo(nodes[tri.k].x, nodes[tri.k].y);
        ctx.closePath();
        ctx.fillStyle = `rgba(212, 175, 55, ${tri.alpha})`;
        ctx.fill();
      }

      // Data packets / creative sparks
      if (activeConnections.length > 0 && packets.length < 12 && Math.random() < 0.08) {
        const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        packets.push({
          fromNode: conn.i,
          toNode: conn.j,
          progress: 0,
          speed: 0.012 + Math.random() * 0.016,
          color: Math.random() > 0.5 ? "rgba(212, 175, 55, 0.95)" : "rgba(16, 185, 129, 0.95)",
        });
      }

      // Render packets
      for (let pIdx = packets.length - 1; pIdx >= 0; pIdx--) {
        const p = packets[pIdx];
        p.progress += p.speed;

        if (p.progress >= 1 || !nodes[p.fromNode] || !nodes[p.toNode]) {
          packets.splice(pIdx, 1);
          continue;
        }

        const x1 = nodes[p.fromNode].x;
        const y1 = nodes[p.fromNode].y;
        const x2 = nodes[p.toNode].x;
        const y2 = nodes[p.toNode].y;
        const px = x1 + (x2 - x1) * p.progress;
        const py = y1 + (y2 - y1) * p.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.75, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = 0.85 + Math.sin(n.pulsePhase) * 0.35;
        const r = n.radius * pulse;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.3, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}, 0.22)`;
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
      {/* Light Clean Canvas Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#F5F2EA]" />

      {/* Emerald Growth & Radiant Gold Ambient Color Fields */}
      <div className="absolute -top-8 left-1/4 w-[480px] h-[320px] bg-emerald-400/12 rounded-full blur-[80px]" />
      <div className="absolute top-1/3 -right-12 w-[500px] h-[340px] bg-cyan-400/12 rounded-full blur-[90px]" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[650px] h-[280px] bg-[#D4AF37]/18 rounded-full blur-[75px]" />

      {/* Dynamic Portfolio Canvas Mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Floating Creative Showcase Badges */}
      {/* 1. UI/UX Prototype Architecture - Top Left */}
      <motion.div
        animate={{
          y: [-7, 7, -7],
          x: [-3, 3, -3],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] left-[4%] hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 border border-emerald-500/35 shadow-xs backdrop-blur-md text-emerald-800 text-xs font-semibold"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <span>Bespoke UI / UX Architecture</span>
      </motion.div>

      {/* 2. Verified Commercial Growth - Top Right */}
      <motion.div
        animate={{
          y: [7, -7, 7],
          x: [3, -3, 3],
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        className="absolute top-[18%] right-[4%] hidden lg:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/90 border border-[#D4AF37]/45 shadow-xs backdrop-blur-md text-[#9A7B16] text-xs font-semibold"
      >
        <div className="w-6 h-6 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
          <TrendingUp className="w-3.5 h-3.5" />
        </div>
        <span>Verified Client Performance</span>
      </motion.div>
    </div>
  );
};
