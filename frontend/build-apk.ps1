# AI Job Chommie - APK Build Script
# Builds the React PWA into an Android APK
# Compatible with Node.js 24.5.0 and npm 11.5.2

Write-Host "🚀 AI Job Chommie - APK Build Process" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    try { 
        Get-Command $cmdname -ErrorAction Stop 
        return $true
    }
    catch { 
        return $false 
    }
}

# Check prerequisites
Write-Host "📋 Checking Prerequisites..." -ForegroundColor Blue
Write-Host ""

# Check Node.js
$nodeVersion = node --version
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

# Check npm
$npmVersion = npm --version
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green

# Check if Java is installed
if (Test-Command "java") {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java found: $javaVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Java not found - required for Android builds" -ForegroundColor Red
    Write-Host "   Please install Java 17 or higher" -ForegroundColor Yellow
    exit 1
}

# Step 1: Clean previous build
Write-Host ""
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Blue
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "✅ Cleaned build directory" -ForegroundColor Green
}

# Step 2: Build React app
Write-Host ""
Write-Host "⚛️  Building React application..." -ForegroundColor Blue
Write-Host "   This may take 30-60 seconds..." -ForegroundColor Yellow

try {
    $env:CI = "false"
    & npm run build:simple
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ React build completed successfully" -ForegroundColor Green
    } else {
        throw "Build failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ React build failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Trying alternative build method..." -ForegroundColor Yellow
    
    try {
        & npx react-scripts build
        Write-Host "✅ Alternative build method succeeded" -ForegroundColor Green
    } catch {
        Write-Host "❌ Both build methods failed" -ForegroundColor Red
        exit 1
    }
}

# Step 3: Sync with Capacitor
Write-Host ""
Write-Host "📱 Syncing with Capacitor Android..." -ForegroundColor Blue

try {
    & npx cap sync android
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Capacitor sync completed successfully" -ForegroundColor Green
    } else {
        throw "Capacitor sync failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "❌ Capacitor sync failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Check Android project structure
Write-Host ""
Write-Host "🔍 Verifying Android project structure..." -ForegroundColor Blue

$androidPath = "android"
if (Test-Path $androidPath) {
    Write-Host "✅ Android project directory exists" -ForegroundColor Green
    
    # Check for gradlew
    if (Test-Path "$androidPath/gradlew.bat") {
        Write-Host "✅ Gradle wrapper found" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Gradle wrapper not found" -ForegroundColor Yellow
    }
    
    # Check for app module
    if (Test-Path "$androidPath/app") {
        Write-Host "✅ App module exists" -ForegroundColor Green
    } else {
        Write-Host "❌ App module missing" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Android project directory not found" -ForegroundColor Red
    Write-Host "   Running 'npx cap add android' to create Android project..." -ForegroundColor Yellow
    
    try {
        & npx cap add android
        Write-Host "✅ Android project created" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to create Android project" -ForegroundColor Red
        exit 1
    }
}

# Step 5: Build APK
Write-Host ""
Write-Host "🏗️  Building Android APK..." -ForegroundColor Blue
Write-Host "   This process may take 2-5 minutes..." -ForegroundColor Yellow

try {
    Set-Location $androidPath
    
    # Build debug APK using gradlew
    & ./gradlew.bat assembleDebug
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ APK build completed successfully!" -ForegroundColor Green
        
        # Find the APK file
        $apkPath = "app/build/outputs/apk/debug/app-debug.apk"
        if (Test-Path $apkPath) {
            $fullPath = Resolve-Path $apkPath
            Write-Host ""
            Write-Host "🎉 APK Successfully Built!" -ForegroundColor Green
            Write-Host "📍 Location: $fullPath" -ForegroundColor Cyan
            
            # Get file size
            $fileSize = (Get-Item $apkPath).Length / 1MB
            Write-Host "📏 Size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
            
            # Copy to root directory for easy access
            $rootApkPath = "../../aijobchommie-debug.apk"
            Copy-Item $apkPath $rootApkPath -Force
            Write-Host "📋 Copied to: $rootApkPath" -ForegroundColor Cyan
        } else {
            Write-Host "⚠️  APK file not found in expected location" -ForegroundColor Yellow
        }
    } else {
        throw "Gradle build failed with exit code $LASTEXITCODE"
    }
}
catch {
    Write-Host "❌ APK build failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Ensure Android SDK is installed" -ForegroundColor White
    Write-Host "2. Check ANDROID_HOME environment variable" -ForegroundColor White
    Write-Host "3. Verify Java 17+ is installed" -ForegroundColor White
    Write-Host "4. Run 'npx cap doctor' for diagnosis" -ForegroundColor White
} finally {
    Set-Location ..
}

# Step 6: Open Android Studio (optional)
Write-Host ""
Write-Host "📱 APK Build Process Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "• Install the APK on your Android device" -ForegroundColor White
Write-Host "• Test all PWA features in mobile environment" -ForegroundColor White
Write-Host "• To open Android Studio: npm run apk:dev" -ForegroundColor White
Write-Host ""

$response = Read-Host "Would you like to open Android Studio now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "🚀 Opening Android Studio..." -ForegroundColor Blue
    try {
        & npx cap open android
    } catch {
        Write-Host "❌ Could not open Android Studio automatically" -ForegroundColor Red
        Write-Host "   Please open Android Studio manually and import the android folder" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✨ APK build script completed!" -ForegroundColor Green
