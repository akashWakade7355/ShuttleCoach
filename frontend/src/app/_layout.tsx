import { useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { WelcomeScreen } from '@/screens/WelcomeScreen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Welcome screen is shown as the first screen on app launch
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {showWelcome ? (
        <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
      ) : (
        <AppTabs />
      )}
    </ThemeProvider>
  );
}
