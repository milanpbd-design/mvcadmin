# MyVetCorner Deployment Script
# This script builds the React app locally for deployment to Hostinger

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MyVetCorner Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
}

# Clean previous build
if (Test-Path ".dist") {
    Write-Host "Cleaning previous build..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".dist"
}

# Build the application
Write-Host "Building application..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Build Successful!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. The '.dist' folder contains your production files" -ForegroundColor White
Write-Host "2. Upload the CONTENTS of the '.dist' folder to:" -ForegroundColor White
Write-Host "   /home/u864946001/domains/myvetcorner.com/public_html/" -ForegroundColor Yellow
Write-Host "3. Make sure to upload the .htaccess file as well" -ForegroundColor White
Write-Host ""
Write-Host "You can use:" -ForegroundColor Cyan
Write-Host "- Hostinger File Manager (via hPanel)" -ForegroundColor White
Write-Host "- FTP client (FileZilla, WinSCP, etc.)" -ForegroundColor White
Write-Host "- Git deployment (if configured)" -ForegroundColor White
Write-Host ""
