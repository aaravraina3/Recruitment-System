# Deploy Frontend to GitHub Pages

This guide shows you how to deploy your React frontend using GitHub Actions to GitHub Pages.

## 🚀 Quick Setup (5 Steps)

### Step 1: Enable GitHub Pages
1. Go to your GitHub repo: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Build and deployment":
   - **Source**: GitHub Actions
4. Save (it should say "GitHub Actions" as the source)

### Step 2: Add Secrets (Environment Variables)
1. Still in your repo, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** and add these two:

| Secret Name | Value |
|-------------|-------|
| `REACT_APP_API_URL` | Your backend URL (e.g., `https://your-backend.onrender.com` or leave as `http://localhost:8000` for now) |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | `pk_test_cG9zaXRpdmUtY2ljYWRhLTI4LmNsZXJrLmFjY291bnRzLmRldiQ` |

### Step 3: Push to GitHub
```bash
cd "/Users/aaravraina/Documents/Generate/Recruitment Systen/Recruitment-System"
git add .
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

### Step 4: Watch the Deployment
1. Go to your repo → **Actions** tab
2. You'll see "Deploy Frontend to GitHub Pages" running
3. Wait ~2-3 minutes for it to complete ✅

### Step 5: Visit Your Site
Your frontend will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

Example: `https://aaravraina.github.io/Recruitment-System/`

---

## 🔧 How It Works

1. **GitHub Actions** builds your React app (`npm run build`)
2. It takes the static files from `frontend/build/`
3. It deploys them to **GitHub Pages** (a free static hosting service)
4. Your frontend is now live 24/7!

---

## ⚠️ Important Notes

### Backend Still Needed
- GitHub Pages only hosts the **frontend** (HTML/CSS/JS)
- You still need to deploy the **backend** separately (Render, Railway, AWS, etc.)
- Update the `REACT_APP_API_URL` secret to point to your live backend

### Custom Domain (Optional)
If you want to use `recruitment.generatenu.com` instead of GitHub's URL:
1. Go to **Settings** → **Pages**
2. Add your custom domain
3. Update DNS in Cloudflare to point to GitHub Pages

### Clerk Redirect URL
After deploying, add your GitHub Pages URL to Clerk:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Your app → **Paths** → Add redirect URL: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

---

## 🐛 Troubleshooting

**Build fails?**
- Check **Actions** tab for error logs
- Common issues: missing secrets, wrong Node version

**404 on routes?**
- GitHub Pages doesn't support client-side routing by default
- Add a `404.html` that redirects to `index.html` (I can help with this if needed)

**Site loads but API calls fail?**
- Check if `REACT_APP_API_URL` secret is set correctly
- Make sure your backend is deployed and CORS allows your GitHub Pages domain

---

## 📦 What Was Added

1. **`.github/workflows/deploy-frontend.yml`**: Automated build & deploy
2. **`frontend/package.json`**: Added `"homepage": "."` for proper routing

That's it! Push to `main` and your site auto-deploys.

