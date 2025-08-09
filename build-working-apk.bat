@echo off
echo ========================================
echo   AI Job Chommie - FIXED APK Builder
echo ========================================
echo.

cd /d "C:\Users\user\aijobchommie-pwa\frontend"

echo [1/5] Building React frontend with fixes...
call npm run build:simple
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend build complete!

echo [2/5] Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Capacitor sync failed!
    pause
    exit /b 1
)
echo ✅ Capacitor sync complete!

echo [3/5] Cleaning previous Android build...
cd android
if exist "app\build\outputs\apk" (
    rmdir /s /q "app\build\outputs\apk"
    echo ✅ Cleaned old APKs
)

echo [4/5] Building Android APK with network fixes...
call gradlew clean
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: APK build failed!
    pause
    exit /b 1
)

echo [5/5] APK Build Complete!
echo.
echo ✅ SUCCESS! Your FIXED APK is ready at:
echo    %cd%\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 🔧 This APK includes fixes for:
echo    - Network connectivity issues
echo    - Android permissions
echo    - Crash prevention
echo    - Modern device compatibility
echo.
echo 📱 You can now install this APK on Android devices!
echo.
pause
