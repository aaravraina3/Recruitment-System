# GitHub Actions & Pages Setup Guide (Step-by-Step)

## 🎯 Part 1: Push Your Code First

Open your **Mac Terminal** (not Cursor) and run:

```bash
cd "/Users/aaravraina/Documents/Generate/Recruitment Systen/Recruitment-System"
git push origin main
```

If it asks for username/password, use your GitHub username and a **Personal Access Token** (not your password).

**Don't have a token?** 
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Check the `repo` box
4. Generate and copy it
5. Use it as your password when pushing

---

## 🎯 Part 2: Enable GitHub Pages

### Step 1: Go to Your Repo Settings
1. Open your browser and go to: `https://github.com/aaravraina3/Recruitment-System`
2. Click the **"Settings"** tab (top right, next to "Insights")

### Step 2: Navigate to Pages
1. In the left sidebar, scroll down and click **"Pages"** (under "Code and automation")
2. You'll see a page titled "GitHub Pages"

### Step 3: Configure the Source
Look for a section called **"Build and deployment"**

You'll see a dropdown that says **"Source"**. It might currently say:
- "Deploy from a branch" ❌ (wrong)

**Change it to:**
- Click the dropdown
- Select **"GitHub Actions"** ✅

That's it! No need to select a branch. Just "GitHub Actions" as the source.

Click **Save** if there's a button.

---

## 🎯 Part 3: Add Environment Secrets

### Step 1: Go to Secrets Settings
1. Still in your repo, click **"Settings"** (top tab)
2. In the left sidebar, find **"Secrets and variables"** → Click **"Actions"**

### Step 2: Add Your First Secret
1. Click the green **"New repository secret"** button
2. Fill in:
   - **Name**: `REACT_APP_API_URL`
   - **Secret**: `http://localhost:8000` (or your backend URL if deployed)
3. Click **"Add secret"**

### Step 3: Add Your Second Secret
1. Click **"New repository secret"** again
2. Fill in:
   - **Name**: `REACT_APP_CLERK_PUBLISHABLE_KEY`
   - **Secret**: `pk_test_cG9zaXRpdmUtY2ljYWRhLTI4LmNsZXJrLmFjY291bnRzLmRldiQ`
3. Click **"Add secret"**

---

## 🎯 Part 4: Trigger the Deployment

### Option A: Push Again (Automatic)
```bash
cd "/Users/aaravraina/Documents/Generate/Recruitment Systen/Recruitment-System"
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

### Option B: Manual Trigger
1. Go to your repo → Click **"Actions"** tab (top)
2. On the left, click **"Deploy Frontend to GitHub Pages"**
3. Click the **"Run workflow"** button (right side)
4. Click the green **"Run workflow"** in the dropdown

---

## 🎯 Part 5: Watch It Deploy

1. You're now on the **Actions** tab
2. You'll see a yellow circle 🟡 next to your workflow run
3. Click on it to see live logs
4. Wait 2-3 minutes
5. It will turn green ✅ when done

---

## 🎯 Part 6: Find Your Live Website

### After deployment completes:

1. Go back to **Settings** → **Pages**
2. At the top, you'll see:
   ```
   Your site is live at https://aaravraina3.github.io/Recruitment-System/
   ```
3. Click that link!

**Bookmark this URL** - this is your live site.

---

## 🆘 Troubleshooting

### "I don't see the Actions tab"
- Make sure you pushed the code first
- Check that `.github/workflows/deploy-frontend.yml` exists in your repo

### "The workflow failed"
- Click on the failed run to see the error
- Common issue: Missing secrets (go back to Part 3)

### "Pages tab says 'Upgrade to GitHub Pro'"
- Ignore that, scroll down
- The "Build and deployment" section should still be there

### "My site shows 404"
- Wait 5 minutes after the first deployment
- Clear your browser cache (Cmd+Shift+R)
- Check that the workflow succeeded (green checkmark in Actions tab)

---

## 📱 Need Visual Help?

If you're still stuck, take a screenshot of what you see and I can guide you from there. The key things to check:

1. ✅ Code is pushed to GitHub (check: does `https://github.com/aaravraina3/Recruitment-System` show your recent commit?)
2. ✅ Settings → Pages → Source is set to "GitHub Actions"
3. ✅ Settings → Secrets → Actions has both secrets added
4. ✅ Actions tab shows the workflow ran successfully (green checkmark)

Once all 4 are checked, your site is live! 🚀

