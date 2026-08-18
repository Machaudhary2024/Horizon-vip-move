<<<<<<< HEAD
# Horizon-VIP-Move

Premium VIP passenger transportation website and installable PWA for travel between Saudi Arabia and Bahrain.

## Features

- Bilingual (English / Arabic) with RTL support
- Responsive luxury black & gold design
- Online trip booking with multi-step form
- Customer dashboard with booking status tracker
- Admin dashboard for booking management
- Installable PWA for mobile devices
- Email notifications (configurable via SMTP)

## Quick Start

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin login:** `admin@vip-move.online` / `admin123` (change in production)

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite (`file:./dev.db`) or PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for NextAuth |
| `NEXTAUTH_URL` | App URL |
| `ADMIN_EMAIL` | Admin account email |
| `ADMIN_PASSWORD` | Admin account password |
| `SMTP_*` | Email notification settings (optional) |

## Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables from `.env.example`
4. Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for PostgreSQL
5. Connect domain `www.vip-move.online`

## Project Structure

- `app/[locale]/` — Public pages (EN/AR)
- `app/admin/` — Admin dashboard
- `app/api/` — Booking & auth APIs
- `components/` — UI components
- `messages/` — i18n translations
- `prisma/` — Database schema & seed
=======
# Horizon-vip-move
>>>>>>> 273677e99465b9a8717610d6922203c6b8dda74b
