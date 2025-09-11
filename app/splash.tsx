import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Theme';
import Logo from '@/components/Logo';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // 애니메이션 시작
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // 3초 후 메인 화면으로 이동
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 로고 */}
        <View style={styles.logoIcon}>
          <Logo size={120} variant="blue" />
        </View>

        {/* 앱 이름 */}
        <Text style={styles.appName}>대여해영</Text>
        <Text style={styles.appSubtitle}>이웃과 함께하는 스마트 대여</Text>
      </Animated.View>

      {/* 하단 텍스트 */}
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
        <Text style={styles.bottomText}>
          필요한 것은 빌리고, 남는 것은 빌려주고
        </Text>
        <Text style={styles.versionText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoIcon: {
    marginBottom: 40,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1.5,
  },
  appSubtitle: {
    fontSize: 17,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 16,
  },
  versionText: {
    fontSize: 12,
    color: '#BBBBBB',
  },
});
