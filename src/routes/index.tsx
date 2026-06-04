import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { ValueStrip } from "@/components/site/ValueStrip";
import { WhyMe } from "@/components/site/WhyMe";
import { Projects } from "@/components/site/Projects";
import { Skills } from "@/components/site/Skills";
import { MultilingualBand } from "@/components/site/MultilingualBand";
import { Services } from "@/components/site/Services";
import { AgencyPartnership } from "@/components/site/AgencyPartnership";
import { Process } from "@/components/site/Process";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { Chatbot } from "@/components/site/Chatbot";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { CustomCursor } from "@/components/site/CustomCursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sepehr — Full-Stack Developer · Yerevan, Armenia" },
      {
        name: "description",
        content:
          "Sepehr — full-stack developer in Yerevan. Ship faster, pay less, no middlemen. Senior-level Next.js, React, Three.js and AI integrations for agencies and businesses.",
      },
      { property: "og:title", content: "Sepehr — Full-Stack Developer · Yerevan" },
      {
        property: "og:description",
        content:
          "One developer who handles design to deployment. Direct communication, fixed pricing, demos in days.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sepehr Jokanian",
          jobTitle: "Full-Stack Developer",
          url: "https://sepehr.am",
          email: "hello@sepehr.am",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Yerevan",
            addressCountry: "AM",
          },
          sameAs: [
            "https://github.com/sepehrjo",
            "https://www.linkedin.com/in/sepehr-jo/",
          ],
          knowsAbout: [
            "Next.js",
            "React",
            "TypeScript",
            "Three.js",
            "OpenAI API",
            "Framer Motion",
            "Full-Stack Development",
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
        <AgencyPartnership />
        <Process />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
