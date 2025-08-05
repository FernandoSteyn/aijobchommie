# 🔧 Fix APK Signing Issues

## Problem
Your release APK is unsigned and cannot be installed on Android devices.

## Solution 1: Generate Signed Release APK

### Create a keystore (one-time setup):
```bash
cd frontend/android
keytool -genkey -v -keystore ai-job-chommie.keystore -alias aijobchommie -keyalg RSA -keysize 2048 -validity 10000
```

### Configure signing in app/build.gradle:
Add this to `frontend/android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('ai-job-chommie.keystore')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'aijobchommie'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Build signed release:
```bash
cd frontend/android
./gradlew assembleRelease
```

## Solution 2: Quick Fix - Use Debug Key for Testing

```bash
cd frontend/android
./gradlew assembleDebug
```
The debug APK will work for testing but not for Play Store.

## Verification
Check if APK is signed:
```bash
jarsigner -verify -verbose -certs app-release.apk
```
