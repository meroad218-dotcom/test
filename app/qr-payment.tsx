import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { QrCode, FileText, Check, Calendar, DollarSign, Clock } from 'lucide-react-native';
import SignatureCapture from 'react-native-signature-canvas';
import Colors from '@/constants/Theme';
import BackButton from '@/components/BackButton';

interface RentalQRData {
  itemId: string;
  itemTitle: string;
  itemImage: string;
  ownerName: string;
  rentalFee: string;
  returnDate: string;
  lateFee: string;
  renterName: string;
}

export default function QRPaymentScreen() {
  const params = useLocalSearchParams();
  const { postId, itemTitle, itemImage, ownerName, chatRoomId } = params;
  const router = useRouter();
  
  // 판매자인지 구매자인지 구분 (실제로는 사용자 정보로 판단)
  const [userRole, setUserRole] = useState<'seller' | 'buyer'>('seller');
  const [step, setStep] = useState<'qr-generate' | 'qr-display' | 'qr-scan' | 'signature' | 'complete'>('qr-generate');
  const [showSignature, setShowSignature] = useState(false);
  const [signatureSvg, setSignatureSvg] = useState<string>('');
  const [qrToken, setQrToken] = useState<string>('');
  const [tokenExpiry, setTokenExpiry] = useState<number>(0);
  const [rentalData, setRentalData] = useState<RentalQRData>({
    itemId: postId as string || '1',
    itemTitle: itemTitle as string || '캠핑 텐트 대여 (4인용)',
    itemImage: itemImage as string || '',
    ownerName: ownerName as string || '김철수',
    rentalFee: '',
    returnDate: '',
    lateFee: '',
    renterName: '',
  });

  const signatureRef = useRef<any>(null);

  // 1단계: QR 생성 조건 입력 (판매자)
  const handleGenerateQR = () => {
    if (!rentalData.returnDate) {
      Alert.alert('알림', '반납 예정일을 입력해주세요.');
      return;
    }

    // JWT 토큰 생성 시뮬레이션 (실제로는 서버 API 호출)
    const mockJWTPayload = {
      act: 'PICKUP',
      itemId: rentalData.itemId,
      returnDate: rentalData.returnDate,
      lateFee: rentalData.lateFee,
      rentalFee: rentalData.rentalFee,
      exp: Math.floor(Date.now() / 1000) + 180, // 3분 후 만료
      jti: `qr_${Date.now()}` // 고유 ID
    };
    
    const mockToken = btoa(JSON.stringify(mockJWTPayload));
    setQrToken(mockToken);
    setTokenExpiry(180); // 3분 = 180초
    
    // 타이머 시작
    const timer = setInterval(() => {
      setTokenExpiry(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert('QR 만료', 'QR 코드가 만료되었습니다. 새로 생성해주세요.');
          setStep('qr-generate');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setStep('qr-display');
  };

  // 2단계: QR 스캔 (구매자)
  const handleQRScan = () => {
    // QR 스캔 시뮬레이션 - 바로 전자서명 단계로 이동
    setUserRole('buyer');
    setStep('signature');
  };

  // 3단계: 전자서명 완료
  const handleSignature = (signature: string) => {
    setSignatureSvg(signature);
    setShowSignature(false);
    // 바로 완료 페이지로 이동
    setTimeout(() => {
      setStep('complete');
    }, 100);
  };

  // 완료
  const handleComplete = () => {
    // 메인 페이지(홈 탭)로 이동
    router.push('/(tabs)');
  };

  // QR 생성 조건 입력 단계 (판매자)
  const renderQRGenerateStep = () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.stepContainer}>
      <Text style={styles.stepTitle}>대여 조건 설정</Text>
      <Text style={styles.stepSubtitle}>QR 코드 생성을 위한 대여 조건을 입력하세요</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.itemTitle}>{rentalData.itemTitle}</Text>
        <Text style={styles.ownerInfo}>대여자: {rentalData.ownerName}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Calendar size={16} color={Colors.primary} />
            <Text style={styles.label}>반납 예정일 *</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="예: 2024-01-20"
            value={rentalData.returnDate}
            onChangeText={(text) => setRentalData(prev => ({ ...prev, returnDate: text }))}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateQR}>
        <QrCode size={20} color="white" />
        <Text style={styles.primaryButtonText}>QR 코드 생성</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // QR 코드 표시 단계 (판매자)
  const renderQRDisplayStep = () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.stepContainer}>
      <Text style={styles.stepTitle}>QR 코드 생성 완료</Text>
      <Text style={styles.stepSubtitle}>대여자가 이 QR 코드를 스캔하면 대여가 시작됩니다</Text>
      
      <View style={styles.qrContainer}>
        <View style={styles.qrCodeBox}>
          <QrCode size={120} color={Colors.primary} />
          <Text style={styles.qrToken}>Token: {qrToken.slice(-8)}</Text>
        </View>
        
        <View style={styles.timerContainer}>
          <Clock size={16} color={Colors.warning} />
          <Text style={styles.timerText}>유효시간: {Math.floor(tokenExpiry / 60)}분 {tokenExpiry % 60}초</Text>
        </View>
        
        <View style={styles.rentalSummary}>
          <Text style={styles.summaryTitle}>설정된 대여 조건</Text>
          <Text style={styles.summaryItem}>• 반납일: {rentalData.returnDate}</Text>
        </View>
      </View>
      
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep('qr-generate')}>
          <Text style={styles.secondaryButtonText}>조건 수정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleQRScan}>
          <Text style={styles.primaryButtonText}>QR 스캔 시뮬레이션</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // 전자서명 단계 (양쪽 모두)
  const renderSignatureStep = () => (
    <View style={styles.signatureStepContainer}>
      <Text style={styles.stepTitle}>전자서명</Text>
      <Text style={styles.stepSubtitle}>대여 계약서에 서명해주세요</Text>
      
      <ScrollView style={styles.contractScrollView}>
        <View style={styles.contractSummary}>
          <Text style={styles.contractTitle}>📋 대여 계약서</Text>
          <View style={styles.contractDetails}>
            <Text style={styles.contractItem}>• 대여 물품: {rentalData.itemTitle}</Text>
            <Text style={styles.contractItem}>• 대여자: {rentalData.ownerName}</Text>
            <Text style={styles.contractItem}>• 반납 예정일: {rentalData.returnDate}</Text>
            <Text style={styles.contractItem}>• 총 대여료: 15,000원/일</Text>
          </View>
          
          <View style={styles.agreementBox}>
            <Text style={styles.agreementTitle}>📌 대여 약관 및 조건</Text>
            <Text style={styles.agreementText}>
              1. 대여료 및 결제{'\n'}
              • 대여료는 안전거래 시스템을 통해 홀딩됩니다{'\n'}
              • 반납 완료 확인 후 대여자에게 자동 정산됩니다{'\n'}
              • 추가 비용 발생 시 별도 정산이 진행됩니다{'\n\n'}
              
              2. 반납 및 연체{'\n'}
              • 약속된 반납일까지 반드시 반납해야 합니다{'\n'}
              • 반납 지연 시 일일 연체료가 자동 부과됩니다{'\n'}
              • 3일 이상 연체 시 분실로 간주될 수 있습니다{'\n\n'}
              
              3. 손상 및 분실{'\n'}
              • 정상적인 사용으로 인한 마모는 인정됩니다{'\n'}
              • 고의적 손상이나 분실 시 시세 기준으로 보상합니다{'\n'}
              • 수리 가능한 손상은 수리비만 청구됩니다{'\n\n'}
              
              4. 기타 사항{'\n'}
              • 본 계약은 전자서명으로 법적 효력을 갖습니다{'\n'}
              • 분쟁 발생 시 플랫폼 중재를 통해 해결합니다{'\n'}
              • 약관 위반 시 향후 서비스 이용이 제한될 수 있습니다
            </Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.signatureSection}>
        <Text style={styles.signatureSectionTitle}>전자서명</Text>
        <Text style={styles.signatureSectionSubtitle}>
          위 약관에 동의하며 아래에 서명해주세요
        </Text>
        
        <TouchableOpacity 
          style={styles.signatureButton} 
          onPress={() => setShowSignature(true)}
        >
          <FileText size={20} color={Colors.primary} />
          <Text style={styles.signatureButtonText}>서명하기</Text>
        </TouchableOpacity>
        
        {signatureSvg ? (
          <View style={styles.signaturePreview}>
            <Text style={styles.signaturePreviewText}>✓ 서명 완료</Text>
          </View>
        ) : null}
      </View>
      
      {signatureSvg && (
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => setStep('complete')}
        >
          <Text style={styles.primaryButtonText}>계약 완료</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showSignature} animationType="slide">
        <SafeAreaView style={styles.signatureModal} edges={['top', 'bottom']}>
          <View style={styles.signatureHeader}>
            <TouchableOpacity 
              onPress={() => setShowSignature(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.signatureTitle}>전자서명</Text>
            <TouchableOpacity 
              onPress={() => signatureRef.current?.clearSignature()}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>지우기</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.signatureContainer}>
            <Text style={styles.signatureInstruction}>
              아래 영역에 서명해주세요
            </Text>
            <SignatureCapture
              ref={signatureRef}
              style={styles.signatureCanvas}
              onOK={handleSignature}
              onEmpty={() => Alert.alert('알림', '서명을 해주세요.')}
              descriptionText=""
              clearText="지우기"
              confirmText="완료"
              webStyle={`
                .m-signature-pad {
                  box-shadow: none;
                  border: 2px dashed #E5E7EB;
                  border-radius: 8px;
                }
                .m-signature-pad--body {
                  border: none;
                }
                .m-signature-pad--footer {
                  display: none;
                }
              `}
            />
          </View>

          <TouchableOpacity 
            style={styles.confirmSignatureButton}
            onPress={() => {
              setShowSignature(false);
              setTimeout(() => {
                setStep('complete');
              }, 100);
            }}
          >
            <Text style={styles.confirmSignatureButtonText}>서명 완료</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );

  // 완료 단계
  const renderCompleteStep = () => (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.stepContainer}>
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Check size={40} color="white" />
        </View>
        <Text style={styles.successTitle}>계약 체결 완료!</Text>
        <Text style={styles.successSubtitle}>
          전자서명이 완료되어 대여 계약이 성공적으로 체결되었습니다
        </Text>
      </View>

      <View style={styles.completeSummary}>
        <Text style={styles.summaryTitle}>✅ 계약 정보</Text>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryItem}>물건: {rentalData.itemTitle}</Text>
          <Text style={styles.summaryItem}>반납일: {rentalData.returnDate}</Text>
          <Text style={styles.summaryItem}>총 대여료: 15,000원/일</Text>
        </View>
        
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>💳 안전거래 홀딩</Text>
          <Text style={styles.paymentText}>• 대여료가 안전거래로 홀딩되었습니다</Text>
          <Text style={styles.paymentText}>• 반납 완료 시 자동 정산됩니다</Text>
          <Text style={styles.paymentText}>• 연체료는 반납 시 추가 정산됩니다</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
        <Text style={styles.primaryButtonText}>닫기</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const getCurrentStepContent = () => {
    switch (step) {
      case 'qr-generate':
        return renderQRGenerateStep();
      case 'qr-display':
        return renderQRDisplayStep();
      case 'signature':
        return renderSignatureStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderQRGenerateStep();
    }
  };

  const getStepIndex = () => {
    const steps = ['qr-generate', 'qr-display', 'signature', 'complete'];
    return steps.indexOf(step);
  };

  const getStepNames = () => {
    return ['조건설정', 'QR생성', '전자서명', '완료'];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>QR 대여 계약</Text>
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.progressContainer}>
        {getStepNames().map((stepName, index) => (
          <View key={stepName} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              index <= getStepIndex() && styles.progressDotActive
            ]}>
              <Text style={[
                styles.progressNumber,
                index <= getStepIndex() && styles.progressNumberActive
              ]}>
                {index + 1}
              </Text>
            </View>
            <Text style={styles.progressLabel}>{stepName}</Text>
          </View>
        ))}
      </View>

      {getCurrentStepContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginLeft: -40,
  },
  headerRight: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressNumberActive: {
    color: 'white',
  },
  progressLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  stepContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  ownerInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  qrToken: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    fontFamily: 'monospace',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  timerText: {
    fontSize: 12,
    color: '#92400E',
    marginLeft: 4,
    fontWeight: '500',
  },
  rentalSummary: {
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    width: '100%',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  signatureStepContainer: {
    flex: 1,
    padding: 16,
  },
  contractScrollView: {
    flex: 1,
    marginBottom: 16,
  },
  contractSummary: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
  },
  contractTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  contractDetails: {
    gap: 12,
    marginBottom: 20,
  },
  contractItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  agreementBox: {
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  agreementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  agreementText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  signatureSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  signatureSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  signatureSectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  signatureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    cursor: 'pointer',
  },
  signatureButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primaryDark,
    marginLeft: 8,
  },
  signaturePreview: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginTop: 12,
    alignItems: 'center',
  },
  signaturePreviewText: {
    fontSize: 14,
    color: '#15803D',
    fontWeight: '500',
  },
  signatureModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  signatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signatureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#EF4444',
  },
  signatureContainer: {
    flex: 1,
    margin: 16,
  },
  signatureInstruction: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  signatureCanvas: {
    flex: 1,
  },
  confirmSignatureButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmSignatureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  completeSummary: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryDetails: {
    gap: 8,
    marginBottom: 16,
  },
  paymentInfo: {
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  paymentText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});