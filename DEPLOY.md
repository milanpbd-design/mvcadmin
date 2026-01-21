# Deployment Guide

This guide explains how to build and deploy the My Vet Corner application to Hostinger.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Hostinger hosting account with Node.js support

## Local Development

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   npm start
   ```

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `.dist` folder containing the static assets and optimized React application.

## Deploying to Hostinger

### Step 1: Prepare Your Files

1. **Build the application locally:**
   ```bash
   npm run build
   ```

2. **Files to upload to Hostinger:**
   - `.dist/` folder (entire contents)
   - `server/` folder (entire directory)
   - `content/` folder (if it exists, contains your data)
   - `public/research-papers/` folder (if it exists, contains uploaded PDFs)
   - `package.json`
   - `package-lock.json`
   - `.env` file (create separately, DO NOT commit to git)

### Step 2: Upload Files via FTP/File Manager

1. Log in to Hostinger control panel (hPanel)
2. Go to **File Manager**
3. Navigate to `public_html` or your domain's root directory
4. Upload all the files listed above
5. Ensure the directory structure is maintained

### Step 3: Configure Environment Variables

1. Create a `.env` file in your project root on the server with:
   ```ini
   API_PORT=5000
   NODE_ENV=production
   BUILD_PATH=.dist
   JWT_SECRET=your-secure-random-secret-here
   ADMIN_PASSWORD=your-secure-password-here
   ADMIN_USERNAME=admin
   NO_MONGO=true
   ```

2. **IMPORTANT:** Use strong, unique values for `JWT_SECRET` and `ADMIN_PASSWORD`

### Step 4: Install Dependencies on Server

1. In Hostinger control panel, go to **Advanced** → **Terminal** or use SSH
2. Navigate to your project directory:
   ```bash
   cd public_html
   ```
3. Install Node.js dependencies:
   ```bash
   npm install --production
   ```

### Step 5: Set Up Node.js Application

1. In Hostinger control panel, go to **Advanced** → **Node.js**
2. Click **Create Application**
3. Configure:
   - **Application mode:** Production
   - **Application root:** Your project directory (e.g., `public_html`)
   - **Application URL:** Your domain
   - **Application startup file:** `server/index.js`
   - **Node.js version:** 14.x or higher
4. Click **Create**

### Step 6: Set Directory Permissions

Ensure the following directories are writable:

```bash
chmod 755 content
chmod 755 public/research-papers
chmod 755 .dist
```

### Step 7: Start the Application

1. In the Node.js section of hPanel, click **Start** on your application
2. The server will start on the configured port (default: 5000)

### Step 8: Configure Domain (if needed)

If you want to use a custom domain:

1. In hPanel, go to **Domains**
2. Point your domain to the Node.js application
3. Hostinger will handle the reverse proxy automatically

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `API_PORT` | Port for the API server | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `BUILD_PATH` | Build output directory | `.dist` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-random-secret` |
| `ADMIN_PASSWORD` | Admin login password | `SecurePass123!` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `NO_MONGO` | Use file-based storage | `true` |

## Troubleshooting

### Build Fails with "Permission denied"

**Solution:** The build script has been updated to use `node node_modules/react-scripts/bin/react-scripts.js build` which directly runs the JavaScript entry point, avoiding permission issues on Linux servers and working cross-platform.

This approach:
- ✅ Works on Windows (your local machine)
- ✅ Works on Linux (Hostinger server)
- ✅ Bypasses shell script permission issues
- ✅ Outputs to `.dist` folder automatically

If you still encounter permission issues on the server, you can manually fix permissions via SSH:

```bash
chmod +x node_modules/.bin/*
npm run build
```

### Application Won't Start

1. Check Node.js version: `node -v` (should be 14.x or higher)
2. Verify all dependencies are installed: `npm install`
3. Check `.env` file exists and has correct values
4. Review application logs in Hostinger control panel

### Routes Return 404 Errors

The `.htaccess` file in the `public` folder should handle React Router. If issues persist:

1. Verify `.htaccess` was uploaded to `.dist/` folder
2. Ensure Apache `mod_rewrite` is enabled (usually enabled by default on Hostinger)

### File Uploads Not Working

1. Verify `public/research-papers/` directory exists
2. Check directory permissions: `chmod 755 public/research-papers`
3. Ensure the directory is writable by the Node.js process

### Data Not Persisting

1. Verify `content/` directory exists and is writable
2. Check permissions: `chmod 755 content`
3. Review server logs for storage errors

## Maintenance

### Backups

Regularly backup these directories:
- `content/` - All your articles, categories, users, etc.
- `public/research-papers/` - Uploaded PDF files
- `.env` - Your environment configuration

### Updates

To update the application:

1. Build locally: `npm run build`
2. Upload new `.dist/` folder
3. Upload updated `server/` folder (if changed)
4. Restart the Node.js application in hPanel

### Monitoring

- Check application logs in Hostinger control panel regularly
- Monitor disk space usage (especially `content/backups/`)
- The system keeps the last 10 backups automatically

## Security Checklist

- ✅ Changed default `ADMIN_PASSWORD`
- ✅ Set strong `JWT_SECRET` (random string, 32+ characters)
- ✅ `.env` file is NOT committed to git
- ✅ Using HTTPS (Hostinger provides free SSL)
- ✅ Regular backups configured

## Support

For Hostinger-specific issues:
- Hostinger Knowledge Base: https://support.hostinger.com
- Hostinger Support: Available 24/7 via live chat

For application issues:
- Check server logs in `content/` directory
- Review Node.js application logs in hPanel
