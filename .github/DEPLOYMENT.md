# Automated Deployment Guide

## Overview

This project uses **GitHub Actions** to automatically build and deploy to Hostinger whenever you push code to the `main` branch.

---

## Initial Setup

### 1. Create GitHub Repository (if not already done)

```bash
cd "C:\Users\Vet MKRM\Desktop\Web Development\MVC\myvetcorner"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/myvetcorner.git
git push -u origin main
```

### 2. Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

#### Required Secrets

| Secret Name | Value | Where to Find |
|------------|-------|---------------|
| `FTP_SERVER` | Your FTP hostname | Hostinger hPanel → **FTP Accounts** → Server/Host |
| `FTP_USERNAME` | Your FTP username | Hostinger hPanel → **FTP Accounts** → Username |
| `FTP_PASSWORD` | Your FTP password | The password you set for FTP access |

#### Optional Secrets

| Secret Name | Value | Description |
|------------|-------|-------------|
| `REACT_APP_API_URL` | `https://myvetcorner.com/api` | Backend API URL (if using environment variables) |

---

## How to Find FTP Credentials on Hostinger

1. Log in to **Hostinger hPanel**
2. Go to **Files** → **FTP Accounts**
3. You'll see:
   - **Server/Host**: This is your `FTP_SERVER` (e.g., `ftp.myvetcorner.com`)
   - **Username**: This is your `FTP_USERNAME` (e.g., `u864946001`)
   - **Password**: Click "Change Password" if you need to reset it

---

## How Deployment Works

### Automatic Deployment

1. You make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. GitHub Actions automatically:
   - Installs dependencies
   - Builds the React app
   - Deploys to Hostinger via FTP
4. Your site is live! 🎉

### Manual Deployment Trigger

You can also trigger deployment manually:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Deploy to Hostinger** workflow
4. Click **Run workflow** → **Run workflow**

---

## Monitoring Deployments

### View Deployment Status

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You'll see all deployment runs with their status (✅ success, ❌ failed, 🟡 in progress)

### View Deployment Logs

1. Click on any workflow run
2. Click on the **build-and-deploy** job
3. Expand any step to see detailed logs

---

## Troubleshooting

### Deployment Failed

**Check the logs:**
1. Go to **Actions** tab in GitHub
2. Click on the failed workflow run
3. Check which step failed

**Common issues:**

| Error | Solution |
|-------|----------|
| FTP connection failed | Verify FTP credentials in GitHub Secrets |
| Build failed | Check for syntax errors in your code |
| Permission denied | Ensure FTP user has write permissions |
| Files not updating | Check `server-dir` path in workflow file |

### Site Not Updating

1. **Clear browser cache** (Ctrl + Shift + Delete)
2. **Hard refresh** (Ctrl + F5)
3. **Check deployment logs** to ensure files were uploaded
4. **Verify FTP path** is correct in workflow file

### Environment Variables Not Working

1. Ensure secrets are added in GitHub repository settings
2. Check that secret names match exactly in the workflow file
3. Remember: Environment variables are baked into the build

---

## Workflow Configuration

The deployment workflow is located at:
```
.github/workflows/deploy.yml
```

### Key Settings

- **Trigger**: Runs on push to `main` branch
- **Node Version**: 20.x
- **Build Output**: `.dist` folder
- **Deploy Target**: `/domains/myvetcorner.com/public_html/`
- **Clean Deploy**: `dangerous-clean-slate: true` (removes old files before uploading)

### Customization

To change deployment settings, edit `.github/workflows/deploy.yml`:

```yaml
# Change target directory
server-dir: /domains/myvetcorner.com/public_html/

# Change branch that triggers deployment
branches:
  - main  # Change to 'production' or other branch

# Disable clean slate (keep old files)
dangerous-clean-slate: false
```

---

## Manual Deployment (Fallback)

If GitHub Actions is unavailable, you can still deploy manually:

### Option 1: Build Locally & Upload via FTP

```powershell
npm run build
# Then upload .dist folder contents via FileZilla or Hostinger File Manager
```

### Option 2: Use Deployment Script

```powershell
.\deploy.ps1
# Follow on-screen instructions to upload
```

---

## Security Best Practices

✅ **DO:**
- Store FTP credentials in GitHub Secrets (never in code)
- Use strong FTP passwords
- Regularly update dependencies
- Review deployment logs

❌ **DON'T:**
- Commit `.env` files with sensitive data
- Share FTP credentials
- Disable `dangerous-clean-slate` unless necessary (may leave old files)

---

## Support

### Deployment Issues
- Check GitHub Actions logs
- Verify FTP credentials
- Contact Hostinger support for server issues

### Build Issues
- Run `npm run build` locally to test
- Check for syntax errors
- Ensure all dependencies are installed

---

## Quick Reference

### Deploy Now
```bash
git add .
git commit -m "Update"
git push
```

### Test Build Locally
```bash
npm run build
```

### View Deployment Status
GitHub → Actions tab → Latest workflow run
