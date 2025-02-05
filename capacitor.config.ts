    import type { CapacitorConfig } from '@capacitor/cli';
    

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'gkapp',
  webDir: 'www',
  server: {
    androidScheme: 'https',  // Asegura que en Android use HTTPS
    cleartext: false
  }
};

export default config;
