import { Tabs } from 'expo-router';
import { Chrome as Home, MessageCircle, CirclePlus as PlusCircle, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { ComponentColors } from '@/constants/Theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ComponentColors.tabBar.active,
        tabBarInactiveTintColor: ComponentColors.tabBar.inactive,
        tabBarStyle: {
          backgroundColor: ComponentColors.tabBar.background,
          borderTopWidth: 1,
          borderTopColor: ComponentColors.tabBar.border,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          tabBarIcon: ({ size, color }) => (
            <MessageCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="write"
        options={{
          title: '글쓰기',
          tabBarIcon: ({ size, color }) => (
            <PlusCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}