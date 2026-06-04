-- Migration: Seed projects table with existing portfolio data
-- Created: 2026-06-04

INSERT INTO projects (url, bg_class, center_text, category, title, description, highlights, tags, github, demo, screenshots, display_order, is_visible)
VALUES (
  'arianasepehr.vercel.app',
  'bg-gradient-to-br from-[#1a2030] via-[#0f1520] to-[#0a0e18]',
  'B2B Export Platform',
  'Full-Stack · Next.js · AI Integration',
  'Ariana Global Trade — B2B Export Portal',
  'A premium B2B showcase for an agricultural commodities exporter targeting international wholesale importers. Built with genuine engineering depth: multi-language support including full Persian RTL layout switching, a dynamic volume-based pricing calculator, and an OpenAI-powered pre-qualification chatbot that routes leads automatically.',
  '["RTL/LTR layout switching under 180ms (EN · FA · HY)","AI chat concierge with OpenAI API + graceful fallback handling","Volume-tier pricing calculator running entirely client-side","Responsive across 5 viewport breakpoints with sub-180ms page load"]',
  '["Next.js 14","TypeScript","Tailwind CSS","Framer Motion","OpenAI API","RTL Support","React 19","Vercel"]',
  'https://github.com/sepehrjo/ariana-b2b-export',
  'https://arianasepehr.vercel.app',
  '[{"src":"/assets/preview-en.png","alt":"Ariana homepage"},{"src":"/assets/languages-support.png","alt":"Multi-language support"},{"src":"/assets/chatbot-sensitivity.png","alt":"AI chatbot"},{"src":"/assets/quote-inquiry.png","alt":"Quote form"}]',
  1,
  1
);

INSERT INTO projects (url, bg_class, center_text, category, title, description, highlights, tags, github, demo, screenshots, display_order, is_visible)
VALUES (
  'adart-alpha.vercel.app',
  'bg-[#0B0B0B]',
  'Creative Agency Website',
  'Frontend · React 19 · Three.js · WebGL',
  'FORMA Studio — Art Direction & Advertising',
  'A premium showcase website for FORMA, an avant-garde art direction and advertising studio — built to demonstrate advanced frontend engineering. The centrepiece is a real-time Three.js WebGL scene in the hero that pauses GPU rendering via IntersectionObserver when off-screen, maintaining 60fps across all device tiers. The site is fully multilingual across four scripts — including dynamic Persian RTL — built entirely in CSS Modules.',
  '["Three.js WebGL 3D hero with IntersectionObserver render-pausing — zero GPU/CPU usage when scrolled out of view","Full RTL/LTR layout engine for EN · RU · FA · HY via i18next with mirrored grid, alignment, and absolute positioning","Zero-Tailwind CSS Modules architecture — fully scoped styles with no global override risk across every component"]',
  '["React 19","TypeScript","Three.js","@react-three/fiber","Framer Motion","i18next","RTL Support","CSS Modules","Vite"]',
  'https://github.com/sepehrjo/Ad_Art_Web',
  'https://adart-alpha.vercel.app',
  '[{"src":"/assets/hero_en.png","alt":"FORMA hero"},{"src":"/assets/portfolio.png","alt":"FORMA portfolio"},{"src":"/assets/journal.png","alt":"FORMA journal"},{"src":"/assets/contact.png","alt":"FORMA contact"}]',
  2,
  1
);
