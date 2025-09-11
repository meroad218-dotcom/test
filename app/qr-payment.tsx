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
import { QrCode, FileText, Check } from 'lucide-react-native';
import SignatureCapture from 'react-native-signature-canvas';
import Colors from '@/constants/Theme';

interface PaymentData {
  itemTitle: string;
  rentalFee: string;
  rentalPeriod: string;
  renterName: string;
  ownerName: string;
  ownerAccount: string;
}

export default function QRPaymentScreen() {
  const [step, setStep] = useState<'scan' | 'form' | 'signature' | 'complete'>('scan');
  const [showSignature, setShowSignature] = useState(false);
  const [signatureSvg, setSignatureSvg] = useState<string>('');
  const [paymentData, setPaymentData] = useState<PaymentData>({
    itemTitle: '캠핑 텐트 대여 (4인용)',
    rentalFee: '',
    rentalPeriod: '',
    renterName: '',
    ownerName: '김철수',
    ownerAccount: '1234-56-789012 (국민은행)',
  });

  const signatureRef = useRef<any>(null);

  const handleQRScan = () => {
    // QR 코드 스캔 시뮬레이션
    Alert.alert(
      'QR 스캔 완료',
      '대여 정보를 확인했습니다.',
      [
        {
          text: '확인',
          onPress: () => setStep('form'),
        },
      ]
    );
  };

  const handleFormSubmit = () => {
    if (!paymentData.rentalFee || !paymentData.rentalPeriod || !paymentData.renterName) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }
    setStep('signature');
  };

  const handleSignature = (signature: string) => {
    setSignatureSvg(signature);
    setShowSignature(false);
    setStep('complete');
  };

  const handleComplete = () => {
    Alert.alert(
      '대여 계약 완료',
      '대여 계약이 성공적으로 체결되었습니다.\n대여료는 등록된 계좌로 입금됩니다.',
      [
        {
          text: '확인',
          onPress: () => {
            // 홈으로 이동
          },
        },
      ]
    );
  };

  const renderScanStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.qrContainer}>
        <QrCode size={120} color={Colors.primary} />
        <Text style={styles.qrTitle}>QR 코드를 스캔하세요</Text>
        <Text style={styles.qrSubtitle}>
          상대방이 제시한 QR 코드를 스캔하여
          {'\n'}대여 정보를 확인해보세요
        </Text>
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={handleQRScan}>
        <Text style={styles.primaryButtonText}>QR 스캔하기</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFormStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>대여 정보 입력</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.itemTitle}>{paymentData.itemTitle}</Text>
        <Text style={styles.ownerInfo}>
          대여자: {paymentData.ownerName}
        </Text>
        <Text style={styles.accountInfo}>
          입금 계좌: {paymentData.ownerAccount}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>대여자명 *</Text>
          <TextInput
            style={styles.input}
            placeholder="이름을 입력하세요"
            value={paymentData.renterName}
            onChangeText={(text) => setPaymentData(prev => ({ ...prev, renterName: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>대여료 *</Text>
          <View style={styles.priceInputContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="0"
              value={paymentData.rentalFee}
              onChangeText={(text) => setPaymentData(prev => ({ ...prev, rentalFee: text }))}
              keyboardType="numeric"
            />
            <Text style={styles.priceUnit}>원</Text>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>대여 기간 *</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 2024.01.15 ~ 2024.01.20"
            value={paymentData.rentalPeriod}
            onChangeText={(text) => setPaymentData(prev => ({ ...prev, rentalPeriod: text }))}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleFormSubmit}>
        <Text style={styles.primaryButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignatureStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>전자서명</Text>
      
      <View style={styles.contractSummary}>
        <Text style={styles.contractTitle}>대여 계약서</Text>
        <View style={styles.contractDetails}>
          <Text style={styles.contractItem}>물건: {paymentData.itemTitle}</Text>
          <Text style={styles.contractItem}>대여료: {paymentData.rentalFee}원</Text>
          <Text style={styles.contractItem}>기간: {paymentData.rentalPeriod}</Text>
          <Text style={styles.contractItem}>대여자: {paymentData.renterName}</Text>
          <Text style={styles.contractItem}>임대자: {paymentData.ownerName}</Text>
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
          <Text style={styles.summaryItem}>물건: {paymentData.itemTitle}</Text>
          <Text style={styles.summaryItem}>대여료: {paymentData.rentalFee}원</Text>
          <Text style={styles.summaryItem}>기간: {paymentData.rentalPeriod}</Text>
          <Text style={styles.summaryItem}>입금계좌: {paymentData.ownerAccount}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
        <Text style={styles.primaryButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );

  const getCurrentStepContent = () => {
    switch (step) {
      case 'scan':
        return renderScanStep();
      case 'form':
        return renderFormStep();
      case 'signature':
        return renderSignatureStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderScanStep();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QR 결제</Text>
      </View>
      
      <View style={styles.progressContainer}>
        {['스캔', '정보입력', '서명', '완료'].map((stepName, index) => (
          <View key={stepName} style={styles.progressStep}>
            <View style={[
              styles.progressDot,
              index <= ['scan', 'form', 'signature', 'complete'].indexOf(step) && styles.progressDotActive
            ]}>
              <Text style={[
                styles.progressNumber,
                index <= ['scan', 'form', 'signature', 'complete'].indexOf(step) && styles.progressNumberActive
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
  },
  progressStep: {
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressNumberActive: {
    color: 'white',
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  stepContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
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
    marginBottom: 4,
  },
  accountInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  priceUnit: {
    fontSize: 16,
    color: '#6B7280',
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryDetails: {
    gap: 8,
  },
  summaryItem: {
    fontSize: 14,
    color: '#374151',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});