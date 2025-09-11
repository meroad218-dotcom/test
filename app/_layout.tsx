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
        <Stack
          screenOptions={{ 
            headerShown: false,
          }}
          initialRouteName="splash"
        >
          <Stack.Screen name="splash" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="post/[id]" />
          <Stack.Screen name="chat-room/[id]" />
          <Stack.Screen name="qr-payment" />
          <Stack.Screen name="qr-return" />
          <Stack.Screen name="qr-generate" />
          <Stack.Screen name="account-history" />
          <Stack.Screen name="my-rentals" />
          <Stack.Screen name="my-listings" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ChatProvider>
    </UserProvider>
  );
}