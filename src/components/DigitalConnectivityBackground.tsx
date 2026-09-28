import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Mail,
  MessageSquare,
  MessageCircle,
  Send,
  Share2,
  Globe,
  Wifi,
  Sparkles,
  Radio,
  AtSign,
} from "lucide-react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulseSpeed: number;
  pulsePhase: number;
}

interface Packet {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const DigitalConnectivityBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Palette with refined subtle gold, electric blue, and modern purple
    const nodeColors = [
      { r: 212, g: 175, b: 55 }, // Digibasera Signature Gold
      { r: 59, g: 130, b: 246 }, // Digital Connectivity Blue
      { r: 139, g: 92, b: 246 }, // Innovation Purple
      { r: 99, g: 102, b: 241 }, // Indigo Link
      { r: 229, g: 193, b: 88 }, // Light Gold
    ];

    let nodes: Node[] = [];
    let packets: Packet[] = [];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Density tuned for screen size
      const count = width < 640 ? 28 : width < 1024 ? 42 : 55;
      nodes = [];
      packets = [];

      for (let i = 0; i < count; i++) {
        const c = nodeColors[Math.floor(Math.random() * nodeColors.length)];
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: 1.5 + Math.random() * 2,
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulsePhase: Math.random() * Math.PI * 2,
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

      // Max connection distance
      const maxDist = width < 640 ? 110 : 150;
      const activeConnections: { i: number; j: number }[] = [];

      // Update node positions
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * (delta * 60);
        n.y += n.vy * (delta * 60);
        n.pulsePhase += n.pulseSpeed;

        // Wrap around boundaries smoothly with padding
        if (n.x < -10) n.x = width + 10;
        else if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        else if (n.y > height + 10) n.y = -10;
      }

      // Draw subtle connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            activeConnections.push({ i, j });
            const alpha = (1 - dist / maxDist) * 0.42; // clear vibrant opacity on light background

            // Linear gradient along connecting line
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `${nodes[i].color}, ${alpha})`);
            grad.addColorStop(1, `${nodes[j].color}, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.25;
            ctx.stroke();
          }
        }
      }

      // Manage data packets along connections
      if (activeConnections.length > 0 && packets.length < 12 && Math.random() < 0.08) {
        const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        packets.push({
          fromNode: conn.i,
          toNode: conn.j,
          progress: 0,
          speed: 0.012 + Math.random() * 0.018,
          color: Math.random() > 0.5 ? "rgba(212, 175, 55, 0.95)" : "rgba(59, 130, 246, 0.95)",
        });
      }

      // Draw and update packets
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

        // Packet glow
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes with subtle breathing halo
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const pulse = 0.85 + Math.sin(n.pulsePhase) * 0.35;
        const r = n.radius * pulse;

        // Outer soft glow halo
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}, 0.22)`;
        ctx.fill();

        // Node core
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
      {/* Light Clean Gradient Canvas Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F5] to-[#F5F2EA]" />

      {/* Subtle Luminous Radial Color Spots (Blue, Purple & Gold) */}
      <div className="absolute -top-10 left-1/4 w-[480px] h-[320px] bg-blue-400/15 rounded-full blur-[80px]" />
      <div className="absolute top-1/4 -right-12 w-[500px] h-[340px] bg-purple-400/15 rounded-full blur-[90px]" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[650px] h-[280px] bg-[#D4AF37]/18 rounded-full blur-[75px]" />

      {/* Dynamic Digital Mesh Lines Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Floating Communication & Connectivity Symbols */}
      {/* 1. Email / Message badge - Top Right */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          x: [-4, 4, -4],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-6 sm:top-10 right-[6%] sm:right-[12%] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-blue-200 shadow-md backdrop-blur-md"
      >
        <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
          <Mail className="w-3.2 h-3.2" />
        </div>
        <span className="text-xs font-bold tracking-wider text-blue-950 uppercase">
          Inquiries Active
        </span>
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      </motion.div>

      {/* 2. Chat / Dialogue badge - Positioned lower down for clear visibility */}
      <motion.div
        animate={{
          y: [6, -6, 6],
          x: [3, -4, 3],
          rotate: [0, -2, 2, 0],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        className="absolute bottom-4 sm:bottom-6 left-[3%] sm:left-[6%] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-purple-200 shadow-md backdrop-blur-md"
      >
        <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
          <MessageCircle className="w-3.2 h-3.2" />
        </div>
        <span className="text-xs font-bold tracking-wider text-purple-950 uppercase">
          Consult Desk
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </motion.div>

      {/* 3. Global Network Node - Bottom Right */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          x: [-3, 3, -3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute bottom-5 sm:bottom-8 right-[5%] sm:right-[10%] hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E8E1D0] shadow-md backdrop-blur-md"
      >
        <div className="w-5 h-5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#9A7B16]">
          <Globe className="w-3.2 h-3.2" />
        </div>
        <span className="text-xs font-bold tracking-wider text-[#9A7B16] uppercase">
          Multi-Channel Sync
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
      </motion.div>

      {/* 4. Instant Connection / Send icon - Top Left */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          x: [4, -4, 4],
        }}
        transition={{
          duration: 6.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.8,
        }}
        className="absolute top-6 left-[14%] hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white/95 border border-indigo-200 shadow-sm text-indigo-600 backdrop-blur-md"
        title="Direct Outreach"
      >
        <Send className="w-3.5 h-3.5" />
      </motion.div>

      {/* 5. Radio / Live Signal icon - Center Right */}
      <motion.div
        animate={{
          y: [6, -7, 6],
          rotate: [0, 6, -6, 0],
        }}
        transition={{
          duration: 7.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.9,
        }}
        className="absolute top-[38%] right-[4%] sm:right-[7%] hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white/95 border border-amber-200 shadow-sm text-[#D4AF37] backdrop-blur-md"
      >
        <Radio className="w-3.5 h-3.5" />
      </motion.div>

      {/* 6. Network / Connectivity icon - Mid Left */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          x: [-3, 3, -3],
        }}
        transition={{
          duration: 8.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.3,
        }}
        className="absolute top-[48%] left-[2%] sm:left-[3.5%] hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white/95 border border-purple-200 shadow-sm text-purple-600 backdrop-blur-md"
      >
        <Share2 className="w-3.5 h-3.5" />
      </motion.div>

      {/* Subtle top & bottom edge blend into the page */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#FAF9F5] to-transparent opacity-90" />
    </div>
  );
};
