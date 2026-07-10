import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { WaveDivider } from "./WaveDivider";
import { useTranslation } from "@/hooks/useTranslation";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const onChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || formData.name.length < 2) { setApiError(t('contact.validation.name')); return; }
    if (!formData.phone || formData.phone.length < 6) { setApiError(t('contact.validation.phone')); return; }
    if (!formData.message) { setApiError(t('contact.validation.message')); return; }

    setStatus("submitting");
    setApiError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name.trim(), email: formData.email.trim() || undefined, phone: formData.phone.trim(), company: formData.company.trim() || undefined, project: formData.message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors);
        else setApiError(data.error || t('contact.errorMessage'));
        setStatus("error");
      } else {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setApiError(t('contact.errorMessage'));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section id="contact" className="relative bg-bg py-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-xl rounded-2xl border border-[var(--accent)]/20 bg-white p-10 text-center shadow-md">
            <CheckCircle2 size={40} className="mx-auto text-[var(--accent)]" />
            <h2 className="font-display mt-6 text-3xl font-bold text-[var(--primary)]">{t('contact.title')}</h2>
            <p className="mt-3 text-text-secondary">{t('contact.successMessage')}</p>
            <button onClick={() => setStatus("idle")} className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm text-text-secondary transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]">
              {t('contact.formLabels.submit')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative bg-bg py-28 overflow-hidden">
      {/* Wavy top divider */}
      <div className="absolute top-0 left-0 right-0">
        <WaveDivider color="#EDE6D8" height={60} flip />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="label-mono">{t('contact.label')}</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl text-[var(--primary)]">{t('contact.title')}</h2>
          <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">{t('contact.description')}</p>
        </motion.div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
              {/* Left */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="label-mono">{t('footer.contact')}</div>
                <div className="mt-6 space-y-5">
                  {[
                    { Icon: Mail, label: "Email", value: t('footer.email') || "sepehrjokanian99@gmail.com", href: `mailto:${t('footer.email') || 'sepehrjokanian99@gmail.com'}` },
                    { Icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/sepehr-jo", href: "https://www.linkedin.com/in/sepehr-jo/" },
                    { Icon: Github, label: "GitHub", value: "github.com/sepehrjo", href: "https://github.com/sepehrjo" },
                  ].map((c) => (
                    <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined} className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-white p-4 transition-all hover:border-[var(--accent)] hover:shadow-[var(--shadow-glow)]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                        <c.Icon size={18} />
                      </div>
                      <div>
                        <div className="font-mono-ui text-xs text-text-tertiary">{c.label}</div>
                        <div className="text-sm text-text-primary group-hover:text-[var(--accent)] transition-colors">{c.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>

          {/* Right form */}
          <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-2xl border border-[var(--border)] bg-white p-6 md:p-8 shadow-sm">
            <div className="space-y-4">
              <Field label={t('contact.formLabels.name')} name="name" value={formData.name} onChange={onChange} required error={fieldErrors.name} />
              <Field label={t('contact.formLabels.email')} name="email" type="email" value={formData.email} onChange={onChange} error={fieldErrors.email} />
              <Field label={t('contact.formLabels.phone')} name="phone" type="tel" value={formData.phone} onChange={onChange} required error={fieldErrors.phone} />
              <Field label={t('contact.formLabels.company')} name="company" value={formData.company} onChange={onChange} error={fieldErrors.company} />
              <div>
                <label className="font-mono-ui text-xs text-text-tertiary font-medium">{t('contact.formLabels.message')}{" *"}</label>
                <textarea name="message" required rows={5} value={formData.message} onChange={(e) => onChange("message", e.target.value)} placeholder={t('contact.formLabels.message')} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-[var(--accent)]/40 focus:bg-[var(--bg-elevated)]" />
                {fieldErrors.message && <p className="mt-1 text-xs text-[var(--c-danger)]">{fieldErrors.message}</p>}
              </div>
            </div>
            {apiError && (
              <div className="mt-4 rounded-lg border border-[var(--c-danger)]/30 bg-[var(--c-danger)]/10 px-3 py-2 text-sm text-[var(--c-danger)]">{apiError}</div>
            )}
            <div className="mt-6">
              <MagneticButton type="submit" disabled={status === "submitting"} className="w-full rounded-lg bg-[var(--accent)] px-6 py-3 text-center text-sm font-medium text-white shadow-[var(--shadow-glow)] transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_24px_var(--accent-glow)] disabled:opacity-50 disabled:cursor-not-allowed block">
                {status === "submitting" ? <span className="flex items-center justify-center gap-2"><span className="animate-spin">⏳</span> {t('contact.formLabels.sending')}</span> : t('contact.formLabels.submit')}
              </MagneticButton>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", required, value, onChange, error }: { label: string; name: string; type?: string; required?: boolean; value: string; onChange: (name: string, value: string) => void; error?: string; }) {
  return (
    <div>
      <label className="font-mono-ui text-xs text-text-tertiary font-medium">{label}{required ? " *" : ""}</label>
      <input type={type} name={name} required={required} maxLength={200} value={value} onChange={(e) => onChange(name, e.target.value)} className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-[var(--accent)]/40 focus:bg-[var(--bg-elevated)]" />
      {error && <p className="mt-1 text-xs text-[var(--c-danger)]">{error}</p>}
    </div>
  );
}