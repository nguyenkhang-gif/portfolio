"use client";
import { useEffect, useRef } from "react";

// Labels spread on a sphere, spun with CSS 3D transforms. Drag to rotate.
export default function SkillsGlobe({ items }: { items: string[] }) {
  const box = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const nodes = Array.from(el.children) as HTMLElement[];
    const n = nodes.length;
    const pts = nodes.map((_, i) => {
      const y = 1 - ((i + 0.5) * 2) / n;
      const r = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5)); // golden angle: even spread
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let R = 0, ax = 0.35, ay = 0, vx = 0, vy = 0.004, drag = false, lx = 0, ly = 0, raf = 0, visible = true;

    const draw = () => {
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      nodes.forEach((nd, i) => {
        const [x, y, z] = pts[i];
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
        const d = (z2 + 1) / 2; // 0 back, 1 front
        nd.style.transform = `translate(-50%,-50%) translate3d(${x1 * R}px,${y2 * R}px,${z2 * R}px) scale(${0.65 + 0.45 * d})`;
        nd.style.opacity = String(0.2 + 0.8 * d);
        nd.style.zIndex = String(Math.round(d * 100));
      });
    };
    const size = () => { R = el.clientWidth * 0.4; draw(); };
    const ro = new ResizeObserver(size);
    ro.observe(el);
    size();

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);

    const down = (e: PointerEvent) => { drag = true; lx = e.clientX; ly = e.clientY; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      vy = (e.clientX - lx) * 0.006; vx = -(e.clientY - ly) * 0.006;
      ay += vy; ax += vx; lx = e.clientX; ly = e.clientY;
      if (reduce) draw();
    };
    const up = () => { drag = false; };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || drag) return;
      vx *= 0.95;
      vy += (0.004 - vy) * 0.03; // ease back to the idle spin
      ax += vx; ay += vy;
      draw();
    };
    if (!reduce) tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <ul ref={box} aria-label="Skills" className="globe relative mx-auto aspect-square w-full max-w-[420px] cursor-grab select-none active:cursor-grabbing">
      {items.map((s) => (
        <li key={s} className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-sm text-slate-200 shadow-lg shadow-blue-950/40 backdrop-blur">
          {s}
        </li>
      ))}
    </ul>
  );
}
