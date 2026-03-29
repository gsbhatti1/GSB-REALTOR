# GSB REALTOR PLATFORM
## Built for Gurpreet Bhatti | gsbrealtor.com

A modern, scalable real estate platform for Utah.
Next.js + Supabase + Vercel + WFRMLS API.

---

## 🚀 SETUP — DO THIS IN ORDER

### STEP 1: Install Node.js
Download from: https://nodejs.org (choose LTS version)

### STEP 2: Install dependencies
```bash
cd gsb-realtor
npm install
```

### STEP 3: Set up your accounts (all free to start)
- [ ] **Supabase**: https://supabase.com → Create new project
- [ ] **Mapbox**: https://mapbox.com → Get free token
- [ ] **Resend**: https://resend.com → Get API key
- [ ] **Cloudflare**: https://cloudflare.com → Add gsbrealtor.com

### STEP 4: Create environment file
```bash
cp .env.example .env.local
```
Then open `.env.local` and fill in every value.

**WFRMLS Token**: Log into https://vendor.utahrealestate.com
Go to Account Summary → copy your Bearer Token

### STEP 5: Set up Supabase database
1. Go to your Supabase project
2. Click SQL Editor → New Query
3. Copy and paste the contents of `supabase-schema.sql`
4. Click Run

### STEP 6: Run locally
```bash
npm run dev
```
Open http://localhost:3000 — your site is running!

### STEP 7: Deploy to Vercel
1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial GSB Realtor build"
git push
```
2. Go to https://vercel.com
3. Import your GitHub repo
4. Add all environment variables from `.env.local`
5. Click Deploy

**Your site is LIVE at your Vercel URL.**
Then point gsbrealtor.com DNS to Vercel in Cloudflare.

---

## 📁 FILE STRUCTURE

```
gsb-realtor/
├── app/
│   ├── layout.tsx          ← Root layout, fonts, SEO
│   ├── page.tsx            ← Homepage
│   ├── search/
│   │   └── page.tsx        ← Property search page
│   ├── listing/
│   │   └── [key]/page.tsx  ← Individual listing page
│   ├── contact/
│   │   └── page.tsx        ← Contact page
│   ├── investor/
│   │   └── page.tsx        ← Investor tools
│   └── api/
│       ├── search/route.ts ← MLS search API (server)
│       └── leads/route.ts  ← Lead capture API
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── listings/
│   │   └── PropertyCard.tsx
│   └── ui/
│       └── LeadForm.tsx
├── lib/
│   ├── mls.ts              ← WFRMLS API client
│   ├── supabase.ts         ← Database client
│   └── notifications.ts    ← Email + SMS alerts
├── styles/
│   └── globals.css         ← Design system
├── supabase-schema.sql     ← Run once in Supabase
├── .env.example            ← Copy to .env.local
└── .gitignore              ← NEVER commit .env.local
```

---

## 🔑 ENVIRONMENT VARIABLES CHECKLIST

| Variable | Where to get it |
|---|---|
| `WFRMLS_BEARER_TOKEN` | vendor.utahrealestate.com → Account Summary |
| `NEXT_PUBLIC_SUPABASE_URL` | supabase.com → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase.com → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | supabase.com → Project Settings → API |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | mapbox.com → Account → Tokens |
| `RESEND_API_KEY` | resend.com → API Keys |
| `TWILIO_ACCOUNT_SID` | twilio.com → Console Dashboard |
| `TWILIO_AUTH_TOKEN` | twilio.com → Console Dashboard |
| `TWILIO_PHONE_NUMBER` | twilio.com → Phone Numbers |

---

## 📞 SUPPORT

Built with Claude AI. Questions? Keep talking to Claude.
Gurpreet: 801.635.8462 | gsbhatti1@yahoo.com
