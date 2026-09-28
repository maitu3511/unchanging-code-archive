import React, { useEffect, useRef, useState } from "react";

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

/**
 * Premium animated digital-growth background for the About page.
 * Purely decorative: pointer-events none, sits behind all page content,
 * respects prefers-reduced-motion, and scales density by viewport.
 */
export const AboutPremiumBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let width = 0;
    let height = 0;
    let visible = true;

    const palette = [
      { r: 212, g: 175, b: 55 }, // signature gold
      { r: 154, g: 123, b: 22 }, // deep gold
      { r: 120, g: 130, b: 150 }, // graphite blue-grey
      { r: 229, g: 193, b: 88 }, // light gold
    ];

    let nodes: Node[] = [];
    let packets: Packet[] = [];

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = Math.min(rect.height, 2600);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Density tuned per device: mobile minimal, tablet reduced, desktop full
      const base = width < 640 ? 18 : width < 1024 ? 34 : 60;
      const count = reduced ? Math.round(base * 0.5) : base;
      const speed = reduced ? 0.12 : width < 640 ? 0.18 : 0.35;

      nodes = [];
      packets = [];
      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)];
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: 1.1 + Math.random() * 1.6,
          color: `rgba(${c.r}, ${c.g}, ${c.b}`,
          pulseSpeed: 0.012 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
    });
    io.observe(canvas);

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!visible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const maxDist = width < 640 ? 105 : width < 1024 ? 135 : 165;
      const activeConnections: { i: number; j: number }[] = [];
      const lineAlphaScale = reduced ? 0.5 : 1;

      for (const n of nodes) {
        n.x += n.vx * (delta * 60);
        n.y += n.vy * (delta * 60);
        n.pulsePhase += n.pulseSpeed;
        if (n.x < -12) n.x = width + 12;
        else if (n.x > width + 12) n.x = -12;
        if (n.y < -12) n.y = height + 12;
        else if (n.y > height + 12) n.y = -12;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            activeConnections.push({ i, j });
            const alpha = (1 - dist / maxDist) * 0.3 * lineAlphaScale;
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `${nodes[i].color}, ${alpha})`);
            grad.addColorStop(1, `${nodes[j].color}, ${alpha})`);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      const maxPackets = reduced ? 0 : width < 640 ? 3 : width < 1024 ? 6 : 10;
      if (activeConnections.length > 0 && packets.length < maxPackets && Math.random() < 0.05) {
        const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        packets.push({
          fromNode: conn.i,
          toNode: conn.j,
          progress: 0,
          speed: 0.006 + Math.random() * 0.01,
          color: Math.random() > 0.4 ? "rgba(212, 175, 55, 0.5)" : "rgba(154, 123, 22, 0.45)",
        });
      }

      for (let p = packets.length - 1; p >= 0; p--) {
        const pk = packets[p];
        pk.progress += pk.speed;
        if (pk.progress >= 1 || !nodes[pk.fromNode] || !nodes[pk.toNode]) {
          packets.splice(p, 1);
          continue;
        }
        const a = nodes[pk.fromNode];
        const b = nodes[pk.toNode];
        const px = a.x + (b.x - a.x) * pk.progress;
        const py = a.y + (b.y - a.y) * pk.progress;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = pk.color;
        ctx.shadowColor = pk.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const n of nodes) {
        const pulse = reduced ? 1 : 0.85 + Math.sin(n.pulsePhase) * 0.3;
        const r = n.radius * pulse;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}, 0.14)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}, 0.7)`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* Soft luminous ambience — gold & graphite, kept very light for readability */}
      <div className="absolute -top-24 left-1/4 w-[520px] h-[340px] bg-[#D4AF37]/8 rounded-full blur-[110px]" />
      <div className="absolute top-1/3 -right-24 w-[560px] h-[380px] bg-[#9A7B16]/6 rounded-full blur-[120px] hidden sm:block" />
      <div className="absolute bottom-1/4 -left-20 w-[520px] h-[360px] bg-[#788296]/6 rounded-full blur-[120px] hidden md:block" />

      {/* Faint technical grid */}
      <div
        className="absolute inset-0 opacity-[0.35] hidden sm:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(17,17,17,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.035) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 85%)",
        }}
      />

      {/* Animated network / data-flow mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
