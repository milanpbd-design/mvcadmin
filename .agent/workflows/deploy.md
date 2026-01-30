---
description: Deploy to GitHub and Hostinger
---

# Deploy to GitHub and Hostinger

This workflow pushes your code to GitHub, which automatically triggers deployment to Hostinger via GitHub Actions.

## Quick Deploy Command

Run this to stage, commit, and deploy in one go:

```bash
git add . && git commit -m "Deploy: Supabase migration complete" && git push origin main
```

---

## Step-by-Step Deployment

### 1. Check what changed
```bash
git status
```

// turbo
### 2. Stage all changes
```bash
git add .
```

### 3. Commit with message
```bash
git commit -m "Deploy: Supabase integration complete"
```

// turbo
### 4. Push to GitHub (triggers auto-deploy)
```bash
git push origin main
```

### 5. Monitor deployment
- Visit: https://github.com/YOUR_USERNAME/myvetcorner/actions
- Click latest workflow run
- Watch build logs (takes ~3-5 minutes)

### 6. Verify live site
- Visit: https://www.myvetcorner.com
- Hard refresh: `Ctrl + F5` to clear cache

---

## Important Note: Supabase Environment Variables

⚠️ **Before deploying**, ensure your Supabase credentials are added to GitHub Secrets:

1. Go to: GitHub Repository → Settings → Secrets → Actions
2. Add these secrets:
   - `REACT_APP_SUPABASE_URL` = `https://yxgzdekvzwfnxebkhawq.supabase.co`
   - `REACT_APP_SUPABASE_ANON_KEY` = `your_anon_key_from_.env`

Without these, the app will build but won't connect to Supabase in production.

---

## What Happens Automatically

When you push to GitHub:
1. ✅ GitHub Actions triggers
2. ✅ Installs dependencies (`npm ci`)
3. ✅ Builds React app (`npm run build`)
4. ✅ Uploads `.dist` folder to Hostinger via FTP
5. ✅ Site is live at www.myvetcorner.com

---

## Troubleshooting

### Build fails
- Check Actions logs for errors
- Test locally: `npm run build`
- Verify package.json has no errors

### Deployment fails
- Verify FTP credentials in GitHub Secrets
- Check `.github/workflows/deploy.yml` exists
- Confirm FTP_SERVER, FTP_USERNAME, FTP_PASSWORD are set

### Site doesn't update
- Clear browser cache (`Ctrl + Shift + Delete`)
- Hard refresh (`Ctrl + F5`)
- Check Hostinger File Manager for uploaded files
- Wait 2-3 minutes for FTP cache to clear

### Manual fallback
```bash
npm run build
# Upload .dist folder contents to Hostinger via FileZilla
```

---

## Full Documentation

See `.github/DEPLOYMENT.md` for complete deployment guide with FTP setup instructions.
