# Sep Web Portfolio

A modern portfolio and agency website with a complete admin panel for managing projects, services, and client inquiries.

## Features

- Professional portfolio showcase with project gallery
- Admin panel for content management
- Contact form with inquiry management
- Chatbot integration for client support
- Responsive design for all devices
- Multi-language support
- Real-time project updates
- Secure authentication system

## Tech Stack

- Frontend: React with TypeScript
- Framework: TanStack Start
- Database: Cloudflare D1 with SQLite
- Styling: Tailwind CSS
- Deployment: Cloudflare Workers

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
git clone https://github.com/sepehrchn/sep_web.git
cd sep_web
npm install
npm run dev
```

### Database Setup

Run migrations to set up the database:

```bash
npx wrangler d1 execute sep-web-db --local --file=migrations/0001_create_contacts.sql
npx wrangler d1 execute sep-web-db --local --file=migrations/0002_create_admin.sql
npx wrangler d1 execute sep-web-db --local --file=migrations/0003_create_projects.sql
npx wrangler d1 execute sep-web-db --local --file=migrations/0004_seed_projects.sql
```

## Development

Start the development server:

```bash
npm run dev
```

Access the application at http://localhost:5173

The admin panel is available at http://localhost:5173/admin

## Building and Deployment

Build for production:

```bash
npm run build
```

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Project Structure

- `src/components` - UI components for the site and reusable elements
- `src/routes` - Application routes and pages
- `src/lib` - Utilities, database queries, and helpers
- `migrations` - Database migration scripts
- `src/styles` - Global styling

## License

Proprietary - All rights reserved

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

For inquiries: sepehrjokanian99@gmail.com

---

Built with ❤️ in Yerevan, Armenia
