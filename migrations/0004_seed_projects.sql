-- Migration: Seed projects table with updated portfolio data
-- Created: 2026-06-04

DELETE FROM projects;

INSERT INTO projects (url, bg_class, center_text, category, title, description, highlights, tags, github, demo, screenshots, display_order, is_visible)
VALUES (
  'shahmaghz.demo',
  'bg-gradient-to-br from-[#2D2A26] to-[#1E1C1A]',
  'ShahMaghz E-Commerce',
  'Full-Stack',
  'ShahMaghz E-Commerce Platform',
  'A high-performance, RTL-native agricultural e-commerce platform built with a 13-model Postgres schema, Zustand state, and Cloudinary media pipelines.',
  '["13-model relational schema with Prisma & PostgreSQL","Fully native RTL/LTR design system and theme selector","Optimized media processing and upload via Cloudinary","Predictable client-side state management using Zustand"]',
  '["Next.js 14","TypeScript","PostgreSQL","Prisma","Zustand","Zod","Tailwind v4","Cloudinary"]',
  'https://github.com/sepehrjo/shahmaghz',
  'https://shahmaghz.demo',
  '[]',
  1,
  1
);

INSERT INTO projects (url, bg_class, center_text, category, title, description, highlights, tags, github, demo, screenshots, display_order, is_visible)
VALUES (
  'cyberbullying-detector.local',
  'bg-gradient-to-br from-[#1C1D24] to-[#111216]',
  'NLP Classifier Dashboard',
  'AI/ML',
  'Cyberbullying Classification System',
  'An NLP text classification system combining BERT and BiLSTM models with human-in-the-loop retraining, wrapped in a Chrome extension and FastAPI dashboard. Graded A+.',
  '["Hybrid BERT + BiLSTM neural network built with PyTorch","Active learning loop utilizing moderator verification feedback","Chrome extension for real-time social platform monitoring","FastAPI backend and analytics dashboard with PostgreSQL"]',
  '["Python","FastAPI","PyTorch","Transformers","BERT","Chrome Extension","React","PostgreSQL"]',
  'https://github.com/sepehrjo/cyberbullying-detector',
  'https://cyberbullying-detector.local',
  '[]',
  2,
  1
);

INSERT INTO projects (url, bg_class, center_text, category, title, description, highlights, tags, github, demo, screenshots, display_order, is_visible)
VALUES (
  'arianasepehr.vercel.app',
  'bg-gradient-to-br from-[#24211D] to-[#161412]',
  'B2B Export Platform',
  'Full-Stack',
  'Ariana Global Trade',
  'A bilingual B2B platform prototype highlighting an advanced RTL layout engine and a local Knowledge Base chatbot running LLM fallbacks.',
  '["Bilingual (EN/FA) interface with micro-interaction state transitions","OpenAI-powered concierge bot with local KB context integration","Robust responsive grids matching 5 viewport breakpoints"]',
  '["Next.js 14","TypeScript","Tailwind CSS","Framer Motion","OpenAI API","RTL Support","React 19","Vercel"]',
  'https://github.com/sepehrjo/ariana-b2b-export',
  'https://arianasepehr.vercel.app',
  '[]',
  3,
  1
);

INSERT INTO projects (url, bg_class, center_text, category, title, description, highlights, tags, github, demo, screenshots, display_order, is_visible)
VALUES (
  'adart-alpha.vercel.app',
  'bg-[#0B0B0B]',
  'Creative Agency Website',
  'Full-Stack',
  'FORMA Studio Website',
  'A fictional design studio showcase highlighting a performance-conscious Three.js WebGL hero and 4-language i18n routing in CSS Modules.',
  '["Three.js WebGL rendering with off-screen GPU sleep mode","Custom CSS Modules design system with zero utilities dependency","Smooth framerate animation transitions using Framer Motion"]',
  '["React 19","TypeScript","Three.js","@react-three/fiber","Framer Motion","i18next","RTL Support","CSS Modules","Vite"]',
  'https://github.com/sepehrjo/Ad_Art_Web',
  'https://adart-alpha.vercel.app',
  '[]',
  4,
  1
);

INSERT INTO projects (url, bg_class, center_text, category, title, description, highlights, tags, github, demo, screenshots, display_order, is_visible)
VALUES (
  'telegram-bot.edge',
  'bg-gradient-to-br from-[#1E2530] to-[#12161E]',
  'Telegram AI Assistant',
  'AI/ML',
  'Telegram AI Assistant',
  'A Gemini-powered personal bot deployed on the edge, featuring ElevenLabs voice processing and live knowledge base syncing without redeploys.',
  '["Serverless execution using Cloudflare Workers, KV, and D1","Multimodal audio translation powered by ElevenLabs voice API","Dynamic context updating through real-time DB synchronization"]',
  '["Cloudflare Workers","D1 Database","KV Store","Gemini API","ElevenLabs API","TypeScript","Wrangler"]',
  'https://github.com/sepehrjo/telegram-ai-assistant',
  'https://telegram-bot.edge',
  '[]',
  5,
  1
);

INSERT INTO projects (url, bg_class, center_text, category, title, description, highlights, tags, github, demo, screenshots, display_order, is_visible)
VALUES (
  'n8n-automation.local',
  'bg-gradient-to-br from-[#201816] to-[#140F0E]',
  'Multi-Agent Outreach Workflow',
  'Automation',
  'Multi-Agent Outreach Automation',
  'A secure n8n automation pipeline conducting recursive site scraping, AI research, and automated draft synthesis with strict rate-limiting guardrails.',
  '["Orchestration of independent research and writing agents","Dynamic rate-limiting guardrails and manual approval gates","Real-time logging to spreadsheet databases and email triggers"]',
  '["n8n","AI Agents","Web Scraping","Google Sheets API","Email API","Workflow Automation"]',
  'https://github.com/sepehrjo/outreach-automation',
  'https://n8n-automation.local',
  '[]',
  6,
  1
);
