import Image from "next/image";
import StackExperience from "@/components/StackExperience";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import SkillsGlobe from "@/components/SkillsGlobe";
import MobileMenu from "@/components/MobileMenu";
import velaShot from "@/assets/vela-one.jpg";
import { experience, featured, links, projects, skills, stats, story } from "@/data";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function Heading({ n, title, id }: { n: string; title: string; id: string }) {
  return (
    <Reveal>
      <p className="eyebrow">{n}</p>
      <h2 id={id} className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">{title}</h2>
    </Reveal>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300">{s}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-page/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="font-display text-lg font-bold tracking-tight text-white">
            KN<span className="text-accent-text">.</span>
          </a>
          <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            <a href="#what" className="hover:text-white">What I do</a>
            <a href="#work" className="hover:text-white">Work</a>
            <a href="#experience" className="hover:text-white">Experience</a>
            <a href="#skills" className="hover:text-white">Skills</a>
            <a href="#about" className="hover:text-white">About</a>
          </div>
          <div className="flex items-center gap-2">
            <a href={links.upwork} {...ext} className="btn-primary !px-4 !py-2 text-sm">Hire me</a>
            <MobileMenu />
          </div>
        </nav>
      </header>

      <main id="top">
        <StackExperience>
        {/* Hero */}
        <section data-stop className="hero relative flex min-h-[100svh] items-end overflow-hidden md:items-center">
          <div className="hero-shade pointer-events-none absolute inset-0" />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-[40svh] md:pb-0 md:pt-24">
            <div className="max-w-2xl">
              <p className="eyebrow fade-up">Khang Nguyen · Full-stack developer</p>
              <h1 className="fade-up mt-5 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-white md:text-7xl" style={{ animationDelay: "80ms" }}>
                Websites people want to <span className="text-gradient">explore</span>, not just scroll.
              </h1>
              <p className="fade-up mt-6 max-w-xl text-lg leading-relaxed text-slate-300" style={{ animationDelay: "160ms" }}>
                I build interactive 3D web experiences with Three.js, and the full-stack apps behind them.
                Right now I work on browser-based 3D viewers for shipbuilding and industrial-plant engineering.
              </p>
              <div className="fade-up mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
                <a href="#work" className="btn-primary">View my work</a>
                <a href={links.upwork} {...ext} className="btn-ghost">Hire me on Upwork ↗</a>
              </div>
              <p className="fade-up mt-10 flex items-center gap-2 text-sm text-slate-400" style={{ animationDelay: "320ms" }}>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                Available for freelance · Ho Chi Minh City (UTC+7)
              </p>
            </div>
          </div>
          <a href="#what" aria-label="Scroll to what I do" className="scroll-cue absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block" />
        </section>

        {/* What I do: each step drives a pose of the 3D stack */}
        <div id="what" className="relative">
          {story.map((st, i) => (
            <section key={st.title} data-stop aria-labelledby={`step-${i}`} className="flex min-h-[100svh] items-end md:items-center">
              <div className="mx-auto w-full max-w-6xl px-5 pb-10 md:pb-0">
                <Reveal className="story-card max-w-md md:max-w-lg">
                  <p className="eyebrow">What I do · {String(i + 1).padStart(2, "0")} / {String(story.length).padStart(2, "0")}</p>
                  <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-accent-text">{st.label}</p>
                  <h2 id={`step-${i}`} className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">{st.title}</h2>
                  <p className="mt-5 text-lg leading-relaxed text-slate-300">{st.body}</p>
                  <div className="mt-6"><Chips items={st.tags} /></div>
                  {i === story.length - 1 && (
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a href="#work" className="btn-primary">See the work</a>
                      <a href={links.upwork} {...ext} className="btn-ghost">Hire me ↗</a>
                    </div>
                  )}
                </Reveal>
              </div>
            </section>
          ))}
        </div>
        </StackExperience>

        {/* Stats */}
        <section className="border-y border-white/5 bg-white/[0.015]">
          <div className="mx-auto grid max-w-6xl gap-px px-5 md:grid-cols-3">
            {stats.map((s, i) => (
              <Reveal key={s.value} delay={i * 80} className="py-8 md:px-6 md:first:pl-0">
                <p className="font-display text-4xl font-semibold text-white">{s.value}</p>
                <p className="mt-1 text-sm text-slate-400">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Work */}
        <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <Heading n="01 — Selected work" title="Things I've built" id="work" />

          <Reveal className="mt-12">
            <TiltCard max={5} className="card grid gap-8 p-5 md:grid-cols-[1.25fr_1fr] md:p-8">
              <a href={links.vela} {...ext} className="pop group block">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl shadow-blue-950/50">
                  <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                    <span className="ml-3 truncate text-xs text-slate-500">vela-one-sand.vercel.app</span>
                  </div>
                  <Image src={velaShot} alt="Vela One landing page hero with a 3D headphone model" placeholder="blur"
                    sizes="(min-width: 768px) 600px, 100vw" className="w-full transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
              </a>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-text">{featured.tag}</p>
                <h3 className="mt-3 font-display text-3xl font-semibold text-white">{featured.name}</h3>
                <p className="mt-4 leading-relaxed text-slate-300">{featured.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-400">
                  {featured.highlights.map((h) => (
                    <li key={h} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-text" />{h}</li>
                  ))}
                </ul>
                <div className="mt-6"><Chips items={featured.stack} /></div>
                <div className="mt-7"><a href={links.vela} {...ext} className="btn-primary">Open live demo ↗</a></div>
              </div>
            </TiltCard>
          </Reveal>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.name} delay={i * 100}>
                <TiltCard className="card flex h-full flex-col p-7">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-text">{p.tag}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-white">{p.name}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-slate-400">{p.description}</p>
                  <div className="mt-5"><Chips items={p.stack} /></div>
                  <a href={p.link.url} {...ext} className="mt-6 text-sm font-medium text-accent-text hover:text-white">{p.link.label} ↗</a>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <Heading n="02 — Experience" title="Where I've worked" id="experience" />
          <ol className="mt-14 space-y-4">
            {experience.map((e, i) => (
              <Reveal key={e.company} delay={i * 80}>
                <li className="card grid gap-6 p-7 md:grid-cols-[200px_1fr] md:p-9">
                  <div>
                    <p className="font-mono text-sm text-slate-500">{e.period}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">
                      {e.role} <span className="text-accent-text">· {e.company}</span>
                    </h3>
                    <p className="mt-2 text-slate-300">{e.summary}</p>
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-400">
                      {e.points.map((p) => (
                        <li key={p} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" />{p}</li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <Chips items={e.stack} />
                      {e.links.map((l) => (
                        <a key={l.url} href={l.url} {...ext} className="text-sm text-accent-text hover:text-white">{l.label} ↗</a>
                      ))}
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Skills */}
        <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <Heading n="03 — Skills" title="Tools I reach for" id="skills" />
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <SkillsGlobe items={skills.flatMap((g) => g.items)} />
            <p className="mt-2 text-center text-xs text-slate-500">Drag to spin</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((g, i) => (
              <Reveal key={g.group} delay={i * 80}>
                <TiltCard className="card h-full p-6">
                  <h3 className="font-display font-semibold text-white">{g.group}</h3>
                  <div className="mt-4"><Chips items={g.items} /></div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          </div>
        </section>

        {/* About */}
        <section className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <Heading n="04 — About" title="A bit about me" id="about" />
          <div className="mt-14 grid gap-6 md:grid-cols-[1.4fr_1fr]">
            <Reveal className="card p-8 text-lg leading-relaxed text-slate-300">
              <p>
                I&apos;m a full-stack developer who cares most about the moment someone first sees a product on screen.
                Three.js and WebGL let me turn that moment into something people can turn over, take apart and play with.
              </p>
              <p className="mt-5">
                Behind the 3D I write the same production code any product needs: typed front-ends in React and Vue,
                Node.js and NestJS back-ends, and real-time data over WebSocket, MQTT and SSE.
              </p>
            </Reveal>
            <Reveal delay={100} className="card p-8">
              <p className="eyebrow">Education</p>
              <p className="mt-3 font-display text-lg font-semibold text-white">Ho Chi Minh City University of Education</p>
              <p className="text-slate-400">Software Engineering · 2021 – 2025</p>
              <p className="eyebrow mt-8">Languages</p>
              <p className="mt-3 text-slate-300">Vietnamese (native) · English (TOEIC 815)</p>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="px-5 pb-24">
          <Reveal className="cta relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 px-6 py-16 text-center md:py-24">
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Have a product that deserves more than a flat page?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-slate-300">Let&apos;s talk about what it could look like in 3D.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={links.upwork} {...ext} className="btn-primary">Work with me on Upwork ↗</a>
              <a href={links.linkedin} {...ext} className="btn-ghost">LinkedIn</a>
              <a href={links.github} {...ext} className="btn-ghost">GitHub</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Khang Nguyen · Built with Next.js and Three.js
      </footer>
    </>
  );
}
