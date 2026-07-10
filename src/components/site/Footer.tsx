import { Linkedin, Github, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const baseLinks = [
  { labelKey: "nav.links.0.label", href: "#work" },
  { labelKey: "nav.links.1.label", href: "#skills" },
  { labelKey: "nav.links.2.label", href: "#about" },
  { labelKey: "nav.links.4.label", href: "#contact" },
];

export function Footer() {
  const { t } = useTranslation();

  const links = baseLinks.map(l => ({
    ...l,
    label: t(l.labelKey)
  }));

  return (
    <footer className="relative bg-[var(--primary)] text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3 md:items-center">
          <div>
            <a href="#" className="inline-block group">
              <div className="relative h-10 w-10">
                <div className="absolute inset-0 rounded-full border-2 border-[var(--accent)] transition-all group-hover:border-[var(--accent-hover)]" />
                <div className="absolute inset-[3px] rounded-full overflow-hidden">
                  <img src="/assets/logo.webp" alt="Sepehr" className="h-full w-full object-cover" />
                </div>
              </div>
            </a>
            <p className="mt-2 text-sm text-white/70">{t('footer.description')}</p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-6 md:justify-center">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-white/80 hover:text-[var(--accent)] transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 md:justify-end">
            {[
              { Icon: Linkedin, href: "https://www.linkedin.com/in/sepehr-jo/", label: "LinkedIn" },
              { Icon: Github, href: "https://github.com/sepehrjo", label: "GitHub" },
              { Icon: Mail, href: "mailto:sepehrjokanian99@gmail.com", label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/60">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}