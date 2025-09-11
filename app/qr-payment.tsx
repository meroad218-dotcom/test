import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { QrCode, FileText, Check, ArrowLeft, Calendar, DollarSign } from 'lucide-react-native';
import SignatureCapture from 'react-native-signature-canvas';
import Colors from '@/constants/Theme';

interface RentalData {
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
  
  const [step, setStep] = useState<'qr-generate' | 'qr-scan' | 'form' | 'signature' | 'complete'>('qr-generate');
  const [showSignature, setShowSignature] = useState(false);
  const [signatureSvg, setSignatureSvg] = useState<string>('');
  const [qrToken, setQrToken] = useState<string>('');
  const [rentalData, setRentalData] = useState<RentalData>({
    itemTitle: itemTitle as string || '캠핑 텐트 대여 (4인용)',
    itemImage: itemImage as string || '',
    ownerName: ownerName as string || '김철수',
    rentalFee: '',
    returnDate: '',
    lateFee: '',
    renterName: '',
  });

  const signatureRef = useRef<any>(null);

  const handleBack = () => {
    router.back();
  };

  // 1단계: QR 생성 (판매자)
  const handleGenerateQR = () => {
    if (!rentalData.rentalFee || !rentalData.returnDate || !rentalData.lateFee) {
      Alert.alert('알림', '모든 대여 조건을 입력해주세요.');
      return;
    }

    // 실제로는 서버에서 JWT 토큰 생성
    const mockToken = `qr_token_${Date.now()}`;
    setQrToken(mockToken);
    setStep('qr-scan');
  };

  // 2단계: QR 스캔 (대여자)
  const handleQRScan = () => {
    Alert.alert(
      'QR 스캔 완료',
      '대여 정보를 확인했습니다.\n대여자 정보를 입력해주세요.',
      [
        {
          text: '확인',
          onPress: () => setStep('form'),
        },
      ]
    );
  };

  // 3단계: 대여자 정보 입력
  const handleFormSubmit = () => {
    if (!rentalData.renterName) {
      Alert.alert('알림', '대여자명을 입력해주세요.');
      return;
    }
    setStep('signature');
  };

  // 4단계: 전자서명
  const handleSignature = (signature: string) => {
    setSignatureSvg(signature);
    setShowSignature(false);
    setStep('complete');
  };

  // 5단계: 완료
  const handleComplete = () => {
    Alert.alert(
      '대여 계약 완료',
      '대여 계약이 성공적으로 체결되었습니다.\n대여료가 홀딩되었으며, 반납 시 정산됩니다.',
      [
        {
          text: '확인',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  // QR 생성 단계 (판매자용)
  const renderQRGenerateStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>대여 조건 설정</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.itemTitle}>{rentalData.itemTitle}</Text>
        <Text style={styles.ownerInfo}>
          대여자: {rentalData.ownerName}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <DollarSign size={16} color={Colors.primary} />
            <Text style={styles.label}>대여료 (원/일) *</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="예: 15000"
            value={rentalData.rentalFee}
            onChangeText={(text) => setRentalData(prev => ({ ...prev, rentalFee: text }))}
            keyboardType="numeric"
          />
        </View>

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

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <DollarSign size={16} color={Colors.warning} />
            <Text style={styles.label}>연체료 (원/일) *</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="예: 5000"
            value={rentalData.lateFee}
            onChangeText={(text) => setRentalData(prev => ({ ...prev, lateFee: text }))}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateQR}>
        <QrCode size={20} color="white" />
        <Text style={styles.primaryButtonText}>QR 코드 생성</Text>
      </TouchableOpacity>
    </View>
  );

  // QR 스캔 단계
  const renderQRScanStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.qrContainer}>
        <View style={styles.qrCodeBox}>
          <QrCode size={120} color={Colors.primary} />
          <Text style={styles.qrToken}>Token: {qrToken.slice(-8)}</Text>
        </View>
        <Text style={styles.qrTitle}>QR 코드가 생성되었습니다</Text>
        <Text style={styles.qrSubtitle}>
          대여자가 이 QR 코드를 스캔하여
          {'\n'}대여 계약을 시작할 수 있습니다
        </Text>
        
        <View style={styles.rentalSummary}>
          <Text style={styles.summaryTitle}>대여 조건</Text>
          <Text style={styles.summaryItem}>• 대여료: {rentalData.rentalFee}원/일</Text>
          <Text style={styles.summaryItem}>• 반납일: {rentalData.returnDate}</Text>
          <Text style={styles.summaryItem}>• 연체료: {rentalData.lateFee}원/일</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={handleQRScan}>
        <Text style={styles.primaryButtonText}>QR 스캔 시뮬레이션</Text>
      </TouchableOpacity>
    </View>
  );

  // 대여자 정보 입력 단계
  const renderFormStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>대여자 정보 입력</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.itemTitle}>{rentalData.itemTitle}</Text>
        <Text style={styles.ownerInfo}>
          임대자: {rentalData.ownerName}
        </Text>
      </View>

      <View style={styles.rentalConditions}>
        <Text style={styles.conditionsTitle}>확인된 대여 조건</Text>
        <View style={styles.conditionItem}>
          <Text style={styles.conditionLabel}>대여료:</Text>
          <Text style={styles.conditionValue}>{rentalData.rentalFee}원/일</Text>
        </View>
        <View style={styles.conditionItem}>
          <Text style={styles.conditionLabel}>반납일:</Text>
          <Text style={styles.conditionValue}>{rentalData.returnDate}</Text>
        </View>
        <View style={styles.conditionItem}>
          <Text style={styles.conditionLabel}>연체료:</Text>
          <Text style={styles.conditionValue}>{rentalData.lateFee}원/일</Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>대여자명 *</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력하세요"
            value={rentalData.renterName}
            onChangeText={(text) => setRentalData(prev => ({ ...prev, renterName: text }))}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleFormSubmit}>
        <Text style={styles.primaryButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );

  // 전자서명 단계
  const renderSignatureStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>전자서명</Text>
      
      <View style={styles.contractSummary}>
        <Text style={styles.contractTitle}>대여 계약서</Text>
        <View style={styles.contractDetails}>
          <Text style={styles.contractItem}>물건: {rentalData.itemTitle}</Text>
          <Text style={styles.contractItem}>대여료: {rentalData.rentalFee}원/일</Text>
          <Text style={styles.contractItem}>반납일: {rentalData.returnDate}</Text>
          <Text style={styles.contractItem}>연체료: {rentalData.lateFee}원/일</Text>
          <Text style={styles.contractItem}>대여자: {rentalData.renterName}</Text>
          <Text style={styles.contractItem}>임대자: {rentalData.ownerName}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.signatureButton} 
        onPress={() => setShowSignature(true)}
      >
        <FileText size={20} color={Colors.primary} />
        <Text style={styles.signatureButtonText}>서명하기</Text>
      </TouchableOpacity>

      <Modal visible={showSignature} animationType="slide">
        <SafeAreaView style={styles.signatureModal} edges={['top', 'bottom']}>
          <View style={styles.signatureHeader}>
            <TouchableOpacity 
              onPress={() => setShowSignature(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.signatureTitle}>서명해주세요</Text>
            <TouchableOpacity 
              onPress={() => signatureRef.current?.clearSignature()}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>지우기</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.signatureContainer}>
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
            onPress={() => signatureRef.current?.readSignature()}
          >
            <Text style={styles.confirmSignatureButtonText}>서명 완료</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </View>
  );

  // 완료 단계
  const renderCompleteStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Check size={40} color="white" />
        </View>
        <Text style={styles.successTitle}>계약 완료!</Text>
        <Text style={styles.successSubtitle}>
          대여 계약이 성공적으로 체결되었습니다
        </Text>
      </View>

      <View style={styles.completeSummary}>
        <Text style={styles.summaryTitle}>계약 정보</Text>
        <View style={styles.summaryDetails}>
          <Text style={styles.summaryItem}>물건: {rentalData.itemTitle}</Text>
          <Text style={styles.summaryItem}>대여료: {rentalData.rentalFee}원/일</Text>
          <Text style={styles.summaryItem}>반납일: {rentalData.returnDate}</Text>
          <Text style={styles.summaryItem}>연체료: {rentalData.lateFee}원/일</Text>
          <Text style={styles.summaryItem}>대여자: {rentalData.renterName}</Text>
        </View>
        
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentTitle}>💳 결제 정보</Text>
          <Text style={styles.paymentText}>대여료가 안전거래로 홀딩되었습니다</Text>
          <Text style={styles.paymentText}>반납 완료 시 자동 정산됩니다</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
        <Text style={styles.primaryButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );

  const getCurrentStepContent = () => {
    switch (step) {
      case 'qr-generate':
        return renderQRGenerateStep();
      case 'qr-scan':
        return renderQRScanStep();
      case 'form':
        return renderFormStep();
      case 'signature':
        return renderSignatureStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderQRGenerateStep();
    }
  };

  const getStepIndex = () => {
    const steps = ['qr-generate', 'qr-scan', 'form', 'signature', 'complete'];
    return steps.indexOf(step);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>QR 대여 계약</Text>
        <View style={styles.headerRight} />
      </View>
      
      <View style={styles.progressContainer}>
        {['QR생성', 'QR스캔', '정보입력', '서명', '완료'].map((stepName, index) => (
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginLeft: -28, // 백버튼 크기만큼 보정
  },
  headerRight: {
    width: 28,
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
  stepContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
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
    flex: 1,
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
    marginBottom: 24,
  },
  qrToken: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    fontFamily: 'monospace',
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
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
  rentalConditions: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  conditionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  conditionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  conditionLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  conditionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  contractSummary: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
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
  },
  contractItem: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
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
    marginBottom: 20,
  },
  signatureButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primaryDark,
    marginLeft: 8,
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