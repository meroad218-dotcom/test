import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { UserProvider } from '@/hooks/UserContext';
import { ChatProvider } from '@/hooks/ChatContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <UserProvider>
      <ChatProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ChatProvider>
    </UserProvider>
  );
}
