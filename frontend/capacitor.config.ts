import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aijobchommie.app',
  appName: 'AI Job Chommie',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#00ffff"
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#000000"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#00ffff"
    },
    Keyboard: {
      resize: "body",
      style: "dark"
    },
    App: {
      backButtonBehavior: "exit"
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    buildOptions: {
      sourceCompatibility: 'VERSION_17',
      targetCompatibility: 'VERSION_17',
      javaVersion: '17'
    }
  }
};

export default config;
