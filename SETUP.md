# Supabase Auth Setup Guide

## 1. Create a Supabase Project
Go to https://supabase.com → New project.

## 2. Add environment variables
Copy `.env.local.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
Find these in: Supabase Dashboard → Settings → API.

## 3. Enable OAuth providers (optional)
Supabase Dashboard → Authentication → Providers:
- **Google**: Enable, add Client ID + Secret from Google Cloud Console
- **GitHub**: Enable, add Client ID + Secret from GitHub OAuth Apps

For each provider, set the callback URL to:
`https://your-project-ref.supabase.co/auth/v1/callback`

## 4. Configure redirect URLs
Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `http://localhost:3000` (dev) or your production URL
- Redirect URLs: add `http://localhost:3000/auth/callback`

## 5. Install dependencies
```bash
npm install
```

## 6. Run the app
```bash
npm run dev
```

## What's included
- ✅ Email/password sign up & sign in
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Password reset via email
- ✅ Auth callback route handler
- ✅ Middleware: protects /dashboard, redirects logged-in users away from /login + /signup
- ✅ Server-side user session in dashboard layout
- ✅ Real user name + initials in sidebar and header
- ✅ Profile update (name, password) in Settings
- ✅ Sign out button in sidebar
