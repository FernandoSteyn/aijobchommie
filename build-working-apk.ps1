# AI Job Chommie - FIXED APK Builder (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AI Job Chommie - FIXED APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\Users\user\aijobchommie-pwa\frontend"

Write-Host "[1/5] Building React frontend with fixes..." -ForegroundColor Yellow
npm run build:simple
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Frontend build complete!" -ForegroundColor Green

Write-Host "[2/5] Syncing with Capacitor..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Capacitor sync failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Capacitor sync complete!" -ForegroundColor Green

Write-Host "[3/5] Cleaning previous Android build..." -ForegroundColor Yellow
Set-Location android
if (Test-Path "app\build\outputs\apk") {
    Remove-Item -Recurse -Force "app\build\outputs\apk"
    Write-Host "✅ Cleaned old APKs" -ForegroundColor Green
}

Write-Host "[4/5] Building Android APK with network fixes..." -ForegroundColor Yellow
.\gradlew clean
.\gradlew assembleDebug
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: APK build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[5/5] APK Build Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "✅ SUCCESS! Your FIXED APK is ready at:" -ForegroundColor Green
Write-Host "   $((Get-Location).Path)\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 This APK includes fixes for:" -ForegroundColor Yellow
Write-Host "   - Network connectivity issues" -ForegroundColor White
Write-Host "   - Android permissions" -ForegroundColor White
Write-Host "   - Crash prevention" -ForegroundColor White
Write-Host "   - Modern device compatibility" -ForegroundColor White
Write-Host ""
Write-Host "📱 You can now install this APK on Android devices!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue"
