# AI Job Chommie - Development Startup Script
# Run this to start the frontend development environment

Write-Host "🚀 Starting AI Job Chommie Development Environment" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Running health checks..." -ForegroundColor Yellow
node health-check.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎯 Starting frontend development server..." -ForegroundColor Green
    Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Green
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location frontend
    npm start
} else {
    Write-Host "❌ Health checks failed. Please fix the issues above." -ForegroundColor Red
    exit 1
}
