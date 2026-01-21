# Deployment Guide for My Vet Corner

This guide covers deploying the My Vet Corner application to Hostinger using GitHub Actions.

## Prerequisites

- GitHub account with repository access
- Hostinger hosting account
- FTP credentials for Hostinger

## GitHub Secrets Configuration

Before deployment can work, you must configure the following secrets in your GitHub repository:

1. Go to your repository: `https://github.com/milanpbd-design/mvcadmin`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of the following:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `REACT_APP_API_URL` | Production API URL | `https://myvetcorner.com/api` |
| `FTP_SERVER` | Hostinger FTP server | `ftp.myvetcorner.com` |
| `FTP_USERNAME` | FTP username | `your-ftp-username` |
| `FTP_PASSWORD` | FTP password | `your-ftp-password` |

## Automated Deployment (GitHub Actions)

Once secrets are configured, deployment happens automatically:

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. **Monitor deployment**:
   - Visit: `https://github.com/milanpbd-design/mvcadmin/actions`
   - Watch the workflow progress
   - Check for any errors

3. **Workflow steps**:
   - ✅ Checkout code
   - ✅ Setup Node.js 20
   - ✅ Install dependencies
   - ✅ Build React application
   - ✅ Deploy to Hostinger via FTP

## Manual Deployment

If you need to deploy manually:

### 1. Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates a `dist` folder with the production build.

### 2. Upload to Hostinger

**Option A: Via FTP Client (FileZilla, etc.)**
- Connect to your FTP server
- Navigate to `/domains/myvetcorner.com/public_html/`
- Upload all contents from the `dist` folder
- Upload the `.htaccess` file to the same directory

**Option B: Via Hostinger File Manager**
- Log into Hostinger control panel
- Open File Manager
- Navigate to `public_html`
- Upload the `dist` folder contents
- Upload the `.htaccess` file

### 3. Configure Environment Variables

Create a `.env` file on the server with production values:

```bash
# Copy from .env.example
API_PORT=5000
NODE_ENV=production
BUILD_PATH=.dist
JWT_SECRET=your-production-secret-key
ADMIN_PASSWORD=your-production-password
ADMIN_USERNAME=admin
NO_MONGO=true
```

**Important**: Use strong, unique values for `JWT_SECRET` and `ADMIN_PASSWORD` in production!

## Fresh Installation

If someone clones the repository for the first time:

```bash
# Clone the repository
git clone https://github.com/milanpbd-design/mvcadmin.git
cd mvcadmin

# Copy environment template
cp .env.example .env

# Edit .env with your values
# (Use your preferred text editor)

# Install dependencies
npm install

# Run development server
npm start

# Or build for production
npm run build
```

## Troubleshooting

### Build Fails with "cross-env not found"

**Solution**: Make sure you've run `npm install` to install all dependencies including `cross-env`.

### React Router Returns 404 on Page Refresh

**Solution**: Ensure `.htaccess` file is uploaded to the server's `public_html` directory.

### GitHub Actions Deployment Fails

**Check**:
1. All GitHub secrets are configured correctly
2. FTP credentials are valid
3. Server directory path is correct: `/domains/myvetcorner.com/public_html/`
4. View the Actions log for specific error messages

### API Requests Fail in Production

**Check**:
1. `REACT_APP_API_URL` secret is set correctly in GitHub
2. Server is running and accessible
3. CORS is configured properly on the backend

## Server Management

### Starting the Backend Server

If your hosting supports Node.js:

```bash
npm run start:prod
```

This starts the Express server on the configured `API_PORT` (default: 5000).

### Checking Server Status

Monitor server logs:
- Check `server.log` for general logs
- Check `server.err` for error logs

## Security Checklist

Before going live:

- [ ] Change default admin credentials
- [ ] Use strong JWT_SECRET (random 32+ character string)
- [ ] Verify `.env` is in `.gitignore` (never commit secrets)
- [ ] Enable HTTPS on Hostinger
- [ ] Test all admin panel functionality
- [ ] Verify file upload limits are appropriate

## Support

For issues:
1. Check GitHub Actions logs
2. Review Hostinger error logs
3. Verify all environment variables are set
4. Test build locally first: `npm run build`
