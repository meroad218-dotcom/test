import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react-native';
import { useUser } from '@/hooks/UserContext';
import Colors from '@/constants/Theme';
import BackButton from '@/components/BackButton';

interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'pending';
  title: string;
  amount: number;
  date: string;
  status: '완료' | '대기중' | '홀딩중';
  description: string;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'income',
    title: '캠핑 텐트 대여료',
    amount: 45000,
    date: '2024-01-15',
    status: '완료',
    description: '3일 대여 완료',
  },
  {
    id: '2',
    type: 'pending',
    title: '전동드릴 대여료',
    amount: 16000,
    date: '2024-01-14',
    status: '홀딩중',
    description: '대여 진행중 (반납일: 2024-01-16)',
  },
  {
    id: '3',
    type: 'expense',
    title: '스위치 게임기 대여',
    amount: 24000,
    date: '2024-01-12',
    status: '완료',
    description: '2일 대여 완료',
  },
  {
    id: '4',
    type: 'income',
    title: '빔 프로젝터 대여료',
    amount: 60000,
    date: '2024-01-10',
    status: '완료',
    description: '3일 대여 완료',
  },
];

export default function AccountHistoryScreen() {
  const { currentUser } = useUser();

  const formatAmount = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft size={16} color="#10B981" />;
      case 'expense':
        return <ArrowUpRight size={16} color="#EF4444" />;
      case 'pending':
        return <Clock size={16} color="#F59E0B" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'income':
        return '#10B981';
      case 'expense':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getAmountPrefix = (type: string) => {
    switch (type) {
      case 'income':
        return '+';
      case 'expense':
        return '-';
      case 'pending':
        return '';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>계좌 내역</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.accountInfo}>
        <Text style={styles.accountTitle}>등록된 계좌</Text>
        <Text style={styles.accountNumber}>{currentUser.accountNumber}</Text>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>현재 잔액</Text>
          <Text style={styles.balanceAmount}>1,234,500원</Text>
        </View>
      </View>

      <ScrollView style={styles.transactionList}>
        <Text style={styles.sectionTitle}>거래 내역</Text>
        {SAMPLE_TRANSACTIONS.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View style={styles.transactionIcon}>
                {getTransactionIcon(transaction.type)}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[
                styles.transactionAmount,
                { color: getAmountColor(transaction.type) }
              ]}>
                {getAmountPrefix(transaction.type)}{formatAmount(transaction.amount)}원
              </Text>
              <View style={[
                styles.statusBadge,
                transaction.status === '완료' && styles.statusComplete,
                transaction.status === '홀딩중' && styles.statusPending,
                transaction.status === '대기중' && styles.statusWaiting,
              ]}>
                <Text style={[
                  styles.statusText,
                  transaction.status === '완료' && styles.statusCompleteText,
                  transaction.status === '홀딩중' && styles.statusPendingText,
                  transaction.status === '대기중' && styles.statusWaitingText,
                ]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
  accountInfo: {
    backgroundColor: Colors.primaryLight,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  accountTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  accountNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  transactionList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  statusComplete: {
    backgroundColor: '#F0FDF4',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusWaiting: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  statusCompleteText: {
    color: '#15803D',
  },
  statusPendingText: {
    color: '#92400E',
  },
  statusWaitingText: {
    color: '#DC2626',
  },
});