import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { ValueStrip } from "@/components/site/ValueStrip";
import { WhyMe } from "@/components/site/WhyMe";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";
import { MultilingualBand } from "@/components/site/MultilingualBand";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Chatbot } from "@/components/site/Chatbot";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CustomCursor } from "@/components/site/CustomCursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سپهر — توسعه‌دهنده فول‌استک و مهندس هوش مصنوعی" },
      {
        name: "description",
        content:
          "سپهر — توسعه‌دهنده فول‌استک و مهندس هوش مصنوعی. طراحی و پیاده‌سازی محصولات هوشمند، سیستم‌های یادگیری ماشین، برنامه‌های وب مدرن و خودکارسازی فرآیندها.",
      },
      { property: "og:title", content: "سپهر — توسعه‌دهنده فول‌استک و مهندس هوش مصنوعی" },
      {
        property: "og:description",
        content:
          "طراحی و توسعه محصولات هوشمند، وب‌اپلیکیشن‌های پیشرفته و خودکارسازی گردش کار.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sepehr Jokanian",
          jobTitle: "Full-Stack Developer & AI Engineer",
          url: "https://sepehr.am",
          email: "sepehrjokanian99@gmail.com",
          sameAs: [
            "https://github.com/sepehrjo",
            "https://www.linkedin.com/in/sepehr-jo/",
          ],
          knowsAbout: [
            "Next.js",
            "React",
            "TypeScript",
            "Three.js",
            "Python",
            "PyTorch",
            "FastAPI",
            "n8n",
            "Cloudflare Workers",
            "PostgreSQL",
            "Prisma",
            "Full-Stack Development",
            "Artificial Intelligence",
            "Machine Learning",
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative bg-bg text-text-primary">
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <main id="main-content">
        <Hero />
        <ValueStrip />
        <WhyMe />
        <Projects />
        <About />
        <Skills />
        <MultilingualBand />
        <Services />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
