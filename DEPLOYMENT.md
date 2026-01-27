# Deployment Guide - My Vet Corner (Static App)

This guide covers deploying the My Vet Corner static React application.

## Architecture Overview

My Vet Corner is a **100% static React application** with no backend server required. All data is served from static JSON files.

## Deployment to GitHub Pages (Recommended)

### Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`

2. **Configure GitHub Actions**:
   
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '20'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
         
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./.dist
   ```

3. **Push to main**:
   ```bash
   git add .
   git commit -m "Deploy static app"
   git push origin main
   ```

Your site will be available at: `https://yourusername.github.io/repository-name/`

## Deployment to Netlify

1. **Connect Repository**:
   - Log into Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.dist`

3. **Deploy**:
   - Click "Deploy site"
   - Automatic deploys on every push to main

## Deployment to Vercel

1. **Import Project**:
   - Log into Vercel
   - Click "Add New Project"
   - Import your repository

2. **Configure**:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `.dist`

3. **Deploy**:
   - Click "Deploy"
   - Get automatic deployments on push

## Deployment to Traditional Hosting (FTP)

### Via GitHub Actions

Update `.github/workflows/deploy.yml`:

```yaml
name: Deploy via FTP

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install and Build
        run: |
          npm ci
          npm run build
      
      - name: FTP Deploy
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./.dist/
          server-dir: /public_html/
```

**Required Secrets** (Settings → Secrets → Actions):
- `FTP_SERVER`: Your FTP server address
- `FTP_USERNAME`: FTP username
- `FTP_PASSWORD`: FTP password

### Manual FTP Upload

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload via FTP client** (FileZilla, etc.):
   - Connect to your server
   - Navigate to `public_html` or your web root
   - Upload all files from `.dist/` folder
   - Upload `public/.htaccess` file (for React Router)

## Environment Configuration

No backend environment variables needed! The app configures itself from:

- `/public/content/site-config.json` - Site settings, admin password
- Other JSON files in `/public/content/` - Content data

### Changing Admin Password

Edit `/public/content/site-config.json`:
```json
{
  "adminPassword": "your-new-password",
  ...
}
```

Then rebuild and deploy.

## Content Management

### Method 1: Via Admin Panel (Recommended)

1. Navigate to `/admin/login`
2. Login with password from `site-config.json`
3. Make changes in admin panel
4. Changes save to `localStorage` immediately
5. Use GitHub integration to push changes to repository
6. Redeploy triggers automatically (if using CI/CD)

### Method 2: Direct JSON Editing

1. Edit JSON files in `/public/content/`
2. Commit and push to repository
3. Deployment happens automatically

## Important Notes

### Data Persistence

- **Admin changes** are stored in browser `localStorage`
- Changes are **NOT automatically deployed**
- Use GitHub integration in admin panel to persist changes
- Or manually export and commit JSON files

### React Router Setup

For client-side routing to work, ensure:

**Apache (.htaccess)**:
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx**:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Troubleshooting

### 404 on Page Refresh

**Cause**: Server doesn't know to serve `index.html` for all routes

**Solution**: Upload `.htaccess` (Apache) or configure Nginx as shown above

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Admin Panel Login Not Working

Check `/public/content/site-config.json` has correct `adminPassword`

### Changes Not Persisting

Remember: Admin panel changes are in `localStorage` only!
- Export data via GitHub integration
- Or manually download and commit JSON files

## Performance Optimization

The build is already optimized for production:
- ✅ Minified JavaScript
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Hashed filenames for caching

## Security Checklist

- ✅ Static files only - no backend to secure
- ✅ Admin password in JSON (client-side only)
- ⚠️ For sensitive content, consider adding authentication service
- ✅ HTTPS recommended (free with GitHub Pages, Netlify, Vercel)

## Monitoring

Static sites need minimal monitoring:
- Check hosting provider's uptime
- Monitor build/deploy status in CI/CD
- No server logs to watch

## Support

For deployment issues:
1. Check build locally: `npm run build`
2. Test built files: `npx serve .dist`
3. Review GitHub Actions logs
4. Verify hosting configuration

---

**Note**: This application requires NO server setup, NO database, and NO backend configuration!
