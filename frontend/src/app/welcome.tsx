import React from 'react';
import { useRouter } from 'expo-router';
import { WelcomeScreen } from '@/screens/WelcomeScreen';

export default function WelcomeRoute() {
  const router = useRouter();

  const handleGetStarted = () => {
    // Placeholder navigation action: navigate into the main app dashboard
    router.navigate('/');
  };

  return <WelcomeScreen onGetStarted={handleGetStarted} />;
}

