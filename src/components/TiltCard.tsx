"use client";
import { useRef } from "react";

export default function TiltCard({ children, className = "", max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const set = (rx: number, ry: number, gx: number, gy: number) => {
    const s = ref.current?.style;
    if (!s) return;
    s.setProperty("--rx", `${rx}deg`);
    s.setProperty("--ry", `${ry}deg`);
    s.setProperty("--gx", `${gx}%`);
    s.setProperty("--gy", `${gy}%`);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    set((0.5 - y) * max, (x - 0.5) * max, x * 100, y * 100);
  };
  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={() => set(0, 0, 50, 50)} className={`tilt ${className}`}>
      {children}
      <span aria-hidden className="tilt-glare" />
    </div>
  );
}
