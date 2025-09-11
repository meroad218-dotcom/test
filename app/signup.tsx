import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/Theme';

export default function SignupScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const steps = [
    {
      id: 1,
      title: '이메일 등록',
      description: '계정 생성을 위한 이메일을 입력해주세요',
    },
    {
      id: 2,
      title: '전화번호 인증',
      description: '본인 확인을 위한 전화번호 인증',
    },
    { id: 3, title: '계좌 등록', description: '안전한 거래를 위한 계좌 정보' },
    {
      id: 4,
      title: '1원 송금 인증',
      description: '계좌 확인을 위한 1원 송금 인증',
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // 회원가입 완료 후 로그인 페이지로
      router.replace('/login');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>이메일 주소를 입력해주세요</Text>
            <Text style={styles.stepDescription}>
              로그인 시 사용할 이메일 주소를 입력해주세요
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPlaceholder}>example@email.com</Text>
            </View>
            <Text style={styles.helperText}>
              • 올바른 이메일 형식으로 입력해주세요{'\n'}• 이메일 인증 메일이
              발송됩니다
            </Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>전화번호를 입력해주세요</Text>
            <Text style={styles.stepDescription}>
              본인 확인을 위한 휴대폰 번호를 입력해주세요
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPlaceholder}>010-1234-5678</Text>
            </View>
            <TouchableOpacity style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>인증번호 발송</Text>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <Text style={styles.inputPlaceholder}>인증번호 6자리</Text>
            </View>
            <Text style={styles.helperText}>
              • SMS로 인증번호가 발송됩니다{'\n'}• 3분 내에 입력해주세요
            </Text>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>계좌 정보를 입력해주세요</Text>
            <Text style={styles.stepDescription}>
              안전한 거래를 위한 본인 명의 계좌를 등록해주세요
            </Text>
            <View style={styles.bankSection}>
              <Text style={styles.sectionLabel}>은행 선택</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPlaceholder}>은행을 선택해주세요</Text>
              </View>
            </View>
            <View style={styles.bankSection}>
              <Text style={styles.sectionLabel}>계좌번호</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPlaceholder}>
                  계좌번호를 입력해주세요
                </Text>
              </View>
            </View>
            <View style={styles.bankSection}>
              <Text style={styles.sectionLabel}>예금주명</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPlaceholder}>
                  예금주명을 입력해주세요
                </Text>
              </View>
            </View>
            <Text style={styles.helperText}>
              • 본인 명의 계좌만 등록 가능합니다{'\n'}• 입력한 정보는 암호화되어
              안전하게 보관됩니다
            </Text>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>1원 송금 인증</Text>
            <Text style={styles.stepDescription}>
              계좌 확인을 위해 1원을 송금해드렸습니다
            </Text>
            <View style={styles.verificationCard}>
              <CheckCircle size={48} color={Colors.primary} />
              <Text style={styles.verificationTitle}>송금 완료!</Text>
              <Text style={styles.verificationText}>
                입력하신 계좌로 1원을 송금했습니다.{'\n'}
                입금자명을 확인해주세요.
              </Text>
            </View>
            <View style={styles.bankSection}>
              <Text style={styles.sectionLabel}>입금자명</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPlaceholder}>
                  입금자명을 입력해주세요
                </Text>
              </View>
            </View>
            <Text style={styles.helperText}>
              • 통장 또는 앱에서 입금자명을 확인해주세요{'\n'}• 인증 완료 후
              1원은 자동 환불됩니다
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ChevronLeft size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>회원가입</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 진행률 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / totalSteps) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep} / {totalSteps}
        </Text>
      </View>

      {/* 단계 정보 */}
      <View style={styles.stepInfo}>
        <Text style={styles.stepNumber}>STEP {currentStep}</Text>
        <Text style={styles.stepTitleMain}>{steps[currentStep - 1].title}</Text>
        <Text style={styles.stepDescriptionMain}>
          {steps[currentStep - 1].description}
        </Text>
      </View>

      {/* 컨텐츠 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? '회원가입 완료' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  stepInfo: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  stepTitleMain: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  stepDescriptionMain: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  inputPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bankSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  verificationCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 12,
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  helperText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
    marginTop: 8,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
