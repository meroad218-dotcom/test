import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Theme';
import Logo from '@/components/Logo';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    // 실제 로그인 로직 없이 바로 메인으로 이동
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고 */}
        <View style={styles.logoContainer}>
          <Logo size={100} variant="blue" />
          <Text style={styles.appName}>대여해영</Text>
          <Text style={styles.appSubtitle}>이웃과 함께하는 스마트 대여</Text>
        </View>

        {/* 로그인 섹션 */}
        <View style={styles.loginSection}>
          <Text style={styles.welcomeText}>환영합니다!</Text>
          <Text style={styles.descriptionText}>
            가까운 이웃과 함께{'\n'}
            필요한 물건을 빌리고 빌려주세요
          </Text>

          {/* 로그인 버튼 */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>시작하기</Text>
          </TouchableOpacity>

          {/* 소셜 로그인 버튼들 */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} onPress={handleLogin}>
              <Text style={styles.socialButtonText}>📱 카카오톡으로 시작</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleLogin}
            >
              <Text style={styles.socialButtonText}>🌐 구글로 시작</Text>
            </TouchableOpacity>
          </View>

          {/* 게스트 로그인 */}
          <TouchableOpacity style={styles.guestButton} onPress={handleLogin}>
            <Text style={styles.guestButtonText}>둘러보기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 하단 텍스트 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          계속 진행하면 서비스 이용약관과{'\n'}
          개인정보처리방침에 동의하는 것으로 간주됩니다
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333333',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -1,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '300',
  },
  loginSection: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  socialButtons: {
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: '#f8f9fa',
    width: '100%',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  googleButton: {
    backgroundColor: '#ffffff',
  },
  socialButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
  },
  guestButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  guestButtonText: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
