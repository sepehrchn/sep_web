import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { TiltCard } from "./TiltCard";

interface Project {
  url: string;
  bgClass: string;
  centerText: string;
  category: string;
  title: string;
  description: string;
  highlights: string[];
  tags: string[];
  github: string;
  demo: string;
  screenshots?: { src: string; alt: string }[];
}

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-[var(--border)] bg-black/40 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
      <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
      <span className="h-3 w-3 rounded-full bg-[#28C840]" />
      <div className="ml-4 flex-1 rounded bg-black/40 px-3 py-1 font-mono-ui text-xs text-text-tertiary">{url}</div>
    </div>
  );
}

function LiveBadge() {
  return (
    <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-green-400/30 bg-black/60 px-3 py-1 backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative h-2 w-2 rounded-full bg-green-400" />
      </span>
      <span className="font-mono-ui text-xs font-semibold tracking-wider text-green-400">LIVE</span>
    </div>
  );
}

function ScreenshotCarousel({ shots }: { shots: { src: string; alt: string }[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % shots.length), 3500);
    return () => clearInterval(t);
  }, [shots.length]);
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.img
          key={idx}
          src={shots[idx].src}
          alt={shots[idx].alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {shots.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-white" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load projects:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="work" className="py-28">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="text-text-secondary">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="work" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">// selected work</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">Real Code. Real Demos.</h2>
          <p className="mt-4 text-base text-text-secondary md:text-lg">
            These aren't mockups. Click the links — they actually load.
          </p>
        </motion.div>

        <div className="mt-14 space-y-10" style={{ perspective: 1400 }}>
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <TiltCard max={4} className="group">
                <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-bg-card transition-all duration-300 group-hover:border-[var(--border-hover)] group-hover:shadow-[0_0_32px_var(--accent-glow)]">
                  {/* Browser mockup */}
                  <div className="relative">
                    <BrowserChrome url={p.url} />
                    <div className={`relative flex h-72 items-center justify-center overflow-hidden md:h-96 ${p.bgClass}`}>
                      <div className="absolute inset-0 dot-grid opacity-[0.06]" />
                      
                      {p.screenshots && p.screenshots.length > 0 ? (
                        <ScreenshotCarousel shots={p.screenshots} />
                      ) : (
                        <h3 className="font-display relative px-6 text-center text-3xl font-bold text-text-primary md:text-5xl">
                          {p.centerText}
                        </h3>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8 md:p-10">
                    <div className="font-mono-ui text-xs uppercase tracking-wider text-accent">{p.category}</div>
                    <h4 className="font-display mt-3 text-2xl font-semibold md:text-3xl">{p.title}</h4>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary md:text-base">{p.description}</p>

                    <ul className="mt-6 space-y-2">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-sm text-text-secondary">
                          <span className="text-accent">→</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[var(--border)] bg-black/30 px-3 py-1 font-mono-ui text-xs text-text-secondary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-bg-card px-4 py-2 text-sm transition-colors hover:border-[var(--border-hover)] hover:text-accent"
                      >
                        <Github size={16} /> GitHub
                      </a>
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm text-white shadow-[0_0_16px_var(--accent-glow)] transition-colors hover:bg-accent-hover"
                      >
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
