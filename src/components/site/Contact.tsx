import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { MagneticButton } from "./MagneticButton";

type FormStatus = "idle" | "submitting" | "success" | "error";

const contacts = [
  { Icon: Mail, label: "Email", value: "hello@sepehr.am", href: "mailto:hello@sepehr.am" },
  { Icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/sepehr-jo", href: "https://www.linkedin.com/in/sepehr-jo/" },
  { Icon: Github, label: "GitHub", value: "github.com/sepehrjo", href: "https://github.com/sepehrjo" },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    budget: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const onChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log("Form submitted - current data:", formData);
    
    // Basic validation
    if (!formData.name || formData.name.length < 2) {
      setApiError("Name must be at least 2 characters");
      return;
    }
    if (!formData.email || !formData.email.includes("@")) {
      setApiError("Please enter a valid email");
      return;
    }
    if (!formData.message || formData.message.length < 20) {
      setApiError("Please describe your project (at least 20 characters)");
      return;
    }
    
    setStatus("submitting");
    setApiError("");
    setFieldErrors({});

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      company: formData.company.trim() || undefined,
      project: formData.message.trim(),
      budget: formData.budget || undefined,
    };

    console.log("Sending payload:", payload);

    try {
      console.log("Submitting contact form:", payload);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("API response:", { status: res.status, data });
      
      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors);
        else setApiError(data.error || "Failed to send. Please try again.");
        setStatus("error");
      } else {
        console.log("Contact form submitted successfully!");
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "", budget: "" });
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setApiError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section id="contact" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-xl rounded-xl border border-accent/30 bg-bg-card p-10 text-center">
            <CheckCircle2 size={40} className="mx-auto text-accent" />
            <h2 className="font-display mt-6 text-3xl font-bold">Got it.</h2>
            <p className="mt-3 text-text-secondary">
              I'll review your brief and respond within 24 hours. If it sounds like a good fit, I'll suggest a time for a quick call.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 rounded-md border border-[var(--border)] bg-bg px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              Send another inquiry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono-ui text-sm text-accent">// let's talk</div>
          <h2 className="font-display mt-4 text-4xl font-bold md:text-5xl">Ready to Build Something?</h2>
          <p className="mt-4 max-w-2xl text-base text-text-secondary md:text-lg">
            Whether you're an agency looking for a reliable subcontractor or a company that needs a better product —
            I respond to every message within 24 hours.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-mono-ui text-xs uppercase tracking-wider text-text-tertiary">
              Contact me directly:
            </div>
            <div className="mt-6 space-y-5">
              {contacts.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-4 rounded-lg border border-[var(--border)] bg-bg-card p-4 transition-all hover:border-[var(--border-hover)] hover:shadow-[0_0_16px_var(--accent-glow)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                    <c.Icon size={18} />
                  </div>
                  <div>
                    <div className="font-mono-ui text-xs text-text-tertiary">{c.label}</div>
                    <div className="text-sm text-text-primary group-hover:text-accent">{c.value}</div>
                  </div>
                </a>
              ))}

              <a
                href="https://calendly.com/sepehrjo/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-accent/40 bg-accent/5 px-4 py-3 text-sm text-text-primary transition-colors hover:bg-accent/10"
              >
                <Calendar size={16} className="text-accent" />
                Book a free 30-min call
              </a>
            </div>

            <p className="mt-6 text-xs text-text-tertiary">
              "I check messages personally — not a bot, not a VA."
            </p>
          </motion.div>

          {/* Right form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-xl border border-[var(--border)] bg-bg-card p-6 md:p-8"
          >
            <div className="space-y-4">
              <Field label="Your name" name="name" value={formData.name} onChange={onChange} required error={fieldErrors.name} />
              <Field label="Email" name="email" type="email" value={formData.email} onChange={onChange} required error={fieldErrors.email} />
              <Field label="Company / Agency name" name="company" value={formData.company} onChange={onChange} error={fieldErrors.company} />
              <div>
                <label className="font-mono-ui text-xs text-text-tertiary">
                  About your project *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  value={formData.message}
                  onChange={(e) => onChange("message", e.target.value)}
                  placeholder="What are you building? What's the challenge? What's the deadline?"
                  className="mt-2 w-full rounded-md border border-[var(--border)] bg-bg px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
                />
                {fieldErrors.message && <p className="mt-1 text-xs text-red-400">{fieldErrors.message}</p>}
              </div>
              <div>
                <label className="font-mono-ui text-xs text-text-tertiary">Budget range</label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={(e) => onChange("budget", e.target.value)}
                  className="mt-2 w-full rounded-md border border-[var(--border)] bg-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                >
                  <option value="">Not sure yet</option>
                  <option value="under_8k">Under $8K</option>
                  <option value="8_20k">$8K–$20K</option>
                  <option value="20_50k">$20K–$50K</option>
                  <option value="over_50k">Over $50K</option>
                </select>
                {fieldErrors.budget && <p className="mt-1 text-xs text-red-400">{fieldErrors.budget}</p>}
              </div>
            </div>

            {apiError && (
              <div className="mt-4 rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
                {apiError}
              </div>
            )}

            <div className="mt-6">
              <MagneticButton
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-md bg-accent px-6 py-3 text-center text-sm font-medium text-white shadow-[0_0_24px_var(--accent-glow)] transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed block"
              >
                {status === "submitting" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Sending…
                  </span>
                ) : (
                  "Send Message →"
                )}
              </MagneticButton>
            </div>

            <div className="mt-8 space-y-2 border-t border-[var(--border)] pt-6 text-sm text-text-secondary">
              <div><span className="text-accent">1.</span> I review your brief and reply within 24 hours.</div>
              <div><span className="text-accent">2.</span> If it's a good fit, we schedule a free 30-min scoping call.</div>
              <div><span className="text-accent">3.</span> You receive a written, fixed-price proposal within 3 days.</div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", required, value, onChange, error,
}: {
  label: string; name: string; type?: string; required?: boolean;
  value: string; onChange: (name: string, value: string) => void; error?: string;
}) {
  return (
    <div>
      <label className="font-mono-ui text-xs text-text-tertiary">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        maxLength={200}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="mt-2 w-full rounded-md border border-[var(--border)] bg-bg px-3 py-2 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
