"use client";
import { useRef } from "react";

const items = [["#work", "Work"], ["#experience", "Experience"], ["#skills", "Skills"], ["#about", "About"]];

export default function MobileMenu() {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute("open");
  return (
    <details ref={ref} className="menu relative md:hidden">
      <summary aria-label="Menu" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-white/15">
        <span className="menu-icon" />
      </summary>
      <div className="absolute right-0 mt-3 flex w-48 flex-col rounded-2xl border border-white/10 bg-slate-950/95 p-2 text-sm shadow-2xl backdrop-blur-xl">
        {items.map(([href, label]) => (
          <a key={href} href={href} onClick={close} className="rounded-xl px-4 py-3 text-slate-200 hover:bg-white/5">{label}</a>
        ))}
      </div>
    </details>
  );
}
