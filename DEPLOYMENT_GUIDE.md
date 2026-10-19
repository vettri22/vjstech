# VJS TECH — Production Deployment & Google Publishing Guide

This guide details how to securely deploy **VJS TECH** permanently to the cloud and publish it on Google Search Console with zero credential leaks.

---

## 1. Security & Git Hygiene (Zero Credential Leaks)

### What Was Secured:
- **No Hardcoded Passwords:** All initial admin credentials have been migrated entirely to environment variables (`ADMIN_INITIAL_EMAIL` and `ADMIN_INITIAL_PASSWORD`).
- **`.env` Protected:** `.env` files are ignored in `.gitignore` and removed from git tracking. A safe `.env.example` template is provided instead.
- **Database Files Excluded:** SQLite database files (`*.db`) and dynamic user uploads are excluded from Git to prevent exposing client records or data.
- **Dependencies Cleaned:** All `node_modules` folders were removed from git tracking.

### Pushing Cleanly to GitHub:
To ensure GitHub never exposes previous commits containing credentials, replace the commit with a clean, secure initial commit:

```bash
# 1. Stage all clean files and updated gitignore rules
git add .

# 2. Amend the commit cleanly
git commit --amend -m "chore: production release with secured credentials, zero secrets, and deployment config"

# 3. Force push cleanly to your GitHub repository
git push --force origin main
```
> **Note:** Force pushing (`--force`) rewrites the commit history on GitHub, ensuring old commits containing passwords or `.env` files are completely deleted from GitHub's history.

---

## 2. Permanent Free Cloud Hosting Options

### Option A: Render (Full-Stack 1-Click Deployment — Recommended)
Render allows hosting both the React frontend and Express backend together under a single URL (e.g., `https://vjstech.onrender.com` or custom domain `https://vjstech.in`).

1. Log in to [Render.com](https://render.com) and click **New +** > **Web Service**.
2. Connect your GitHub repository: `https://github.com/vettri22/vjstech`.
3. Configure settings:
   - **Name:** `vjstech`
   - **Environment:** `Node`
   - **Build Command:** `npm run install:all && npm run build`
   - **Start Command:** `npm run start`
4. In **Environment Variables**, add:
   - `
   - `ALLOWED_ORIGINS`: `https://vjstech.in,https://vjstech.onrender.com`
5. Click **Deploy Web Service**. Render will automatically build the client and serve the full platform.

---

### Option B: Vercel (Frontend) + Render (Backend API)
If you prefer Vercel for fast global CDN edge delivery:

1. **Deploy Backend (Render or Railway):**
   - Follow Option A for the `server` directory.
   - Note the backend URL (e.g. `https://vjstech-api.onrender.com`).
2. **Deploy Frontend (Vercel):**
   - Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
   - Select your `vjstech` GitHub repo.
   - Set **Root Directory** to `client`.
   - In Environment Variables, set `VITE_API_URL` to your backend URL.
   - Click **Deploy**. Your frontend is live at `https://vjstech.vercel.app`.

---

## 3. Publishing to Google (Google Search Console & SEO)

The codebase has been engineered with full Google SEO compliance:
- **Canonical URLs:** Configured for `https://vjstech.in/` across all routes.
- **Dynamic XML Sitemap:** Automatically accessible at `/sitemap.xml`, synced with all database portfolio projects.
- **Robots.txt:** Accessible at `/robots.txt`, directing crawlers to the sitemap while shielding private admin routes (`/admin`, `/portal`, `/api/`).
- **Server-Side Rendered SEO Tags:** Injects dynamic `<title>`, `<meta description>`, Open Graph tags, and Schema.org JSON-LD structured data.

### Submitting to Google Search Console:
1. Visit [Google Search Console](https://search.google.com/search-console).
2. Choose **URL prefix** and enter your live website URL (e.g., `https://vjstech.in` or `https://vjstech.onrender.com`).
3. Under **Verification method**, select **HTML tag**:
   - Copy the verification token (e.g., `google-site-verification=abcdef123456`).
4. Set the token in your hosting provider's Environment Variables:
   - Key: `GOOGLE_SITE_VERIFICATION`
   - Value: `abcdef123456`
5. Click **Verify** in Google Search Console.
6. Once verified, go to **Sitemaps** on the left menu, enter `sitemap.xml`, and click **Submit**. Google's crawlers will begin indexing all pages permanently!
