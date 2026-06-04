# Sepehr's Portfolio Website

My personal portfolio and contact management system. Built to be fast, modern, and easy to manage.

## What's Inside

- **Portfolio site** – Showcases my work, skills, and services
- **Contact form** – Lets potential clients reach out directly
- **Admin panel** – Private dashboard to manage inquiries
- **AI chatbot** – Answers questions about my work (powered by OpenAI)

## Tech Stack

- **Framework**: TanStack Start (React-based)
- **Database**: Cloudflare D1 (SQLite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Cloudflare Workers

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repo
git clone https://github.com/sepehrchn/sep_web.git
cd sep_web

# Install dependencies
npm install

# Set up the local database
npx wrangler d1 create sep-web-db

# Copy the database ID from the output and update wrangler.toml

# Run migrations
npx wrangler d1 execute sep-web-db --local --file=migrations/0001_create_contacts.sql
npx wrangler d1 execute sep-web-db --local --file=migrations/0002_create_admin.sql
npx wrangler d1 execute sep-web-db --local --file=migrations/0003_create_projects.sql
npx wrangler d1 execute sep-web-db --local --file=migrations/0004_seed_projects.sql

# Start the dev server
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
```

Visit `http://localhost:8080` to see the site.

### Admin Panel

Access the admin dashboard at `http://localhost:8080/admin/login`

**Default credentials:**
- Username: `admin`
- Password: `changeme123`

⚠️ **Change these before deploying to production!**

## Project Structure

```
sep_web/
├── src/
│   ├── routes/           # Pages and API endpoints
│   │   ├── index.tsx     # Homepage
│   │   ├── admin/        # Admin dashboard
│   │   └── api/          # API routes (contact, chat, etc.)
│   ├── components/       # React components
│   │   └── site/         # Site-specific components
│   └── lib/              # Utilities and database logic
├── migrations/           # Database migrations
├── public/               # Static assets (images, etc.)
└── wrangler.toml        # Cloudflare config
```

## Features

### Contact Form
- Real-time validation
- Duplicate submission protection (1 hour cooldown per email)
- Saves to database automatically
- Success confirmation message

### Admin Dashboard
- View all contact submissions
- Filter by status (new, contacted, in progress, completed, archived)
- Update status with dropdown
- Expandable rows for full details
- Real-time stats

### Custom Cursor
- Animated cursor with glow effect
- Follows mouse movement across the site

### AI Chatbot
- Answers questions about my work and skills
- Powered by OpenAI GPT-4
- Contextual responses based on portfolio content

## Environment Variables

Create a `.dev.vars` file for local development:

```env
OPENAI_API_KEY=your_openai_api_key_here
RESEND_API_KEY=your_resend_api_key_here
```

## Database Schema

### contacts
- `id` – Auto-increment primary key
- `name` – Client name
- `email` – Contact email
- `company` – Company name (optional)
- `project` – Project description
- `budget` – Budget range
- `status` – new | contacted | in_progress | completed | archived
- `created_at` / `updated_at` – Timestamps

### admin_users
- `id` – Auto-increment primary key
- `username` – Admin username
- `password_hash` – SHA-256 hashed password
- `created_at` – Timestamp

### projects
- Portfolio projects with screenshots, descriptions, tags, etc.

## Deployment

This project is designed to run on Cloudflare Workers.

```bash
# Deploy to production
npm run deploy
```

Make sure to:
1. Set up your production D1 database in Cloudflare dashboard
2. Run migrations on production database
3. Set environment variables in Cloudflare Workers settings

## Security Notes

- Admin passwords are hashed with SHA-256
- Session-based authentication with HttpOnly cookies
- Origin validation on API endpoints
- Request size limits to prevent abuse
- Duplicate submission protection

## License

Personal project – feel free to reference, but please don't clone the entire thing.

## Contact

For inquiries: hello@sepehr.am

---

Built with ❤️ in Yerevan, Armenia
