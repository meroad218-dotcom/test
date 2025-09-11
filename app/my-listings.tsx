import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Eye, MessageCircle, CreditCard as Edit3, Trash2, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Theme';
import BackButton from '@/components/BackButton';

interface ListingItem {
  id: string;
  title: string;
  image: string;
  dailyPrice: number;
  period: string;
  views: number;
  chatCount: number;
  status: '대여가능' | '대여중' | '일시정지';
  postedDate: string;
  currentRenter?: string;
  returnDate?: string;
}

const SAMPLE_LISTINGS: ListingItem[] = [
  {
    id: '1',
    title: '캠핑 텐트 대여해드립니다 (4인용)',
    image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&w=400',
    dailyPrice: 15000,
    period: '1일~7일',
    views: 45,
    chatCount: 8,
    status: '대여중',
    postedDate: '2024-01-10',
    currentRenter: '김민수',
    returnDate: '2024-01-17',
  },
  {
    id: '2',
    title: '전동드릴 대여 (보쉬 18V)',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
    dailyPrice: 8000,
    period: '1일~3일',
    views: 23,
    chatCount: 3,
    status: '대여가능',
    postedDate: '2024-01-12',
  },
  {
    id: '3',
    title: '빔 프로젝터 대여 (풀HD)',
    image: 'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=400',
    dailyPrice: 20000,
    period: '1일~14일',
    views: 67,
    chatCount: 12,
    status: '일시정지',
    postedDate: '2024-01-08',
  },
];

export default function MyListingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'rented' | 'paused'>('active');

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '대여가능':
        return '#10B981';
      case '대여중':
        return Colors.primary;
      case '일시정지':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case '대여가능':
        return '#F0FDF4';
      case '대여중':
        return Colors.primaryLight;
      case '일시정지':
        return '#F3F4F6';
      default:
        return '#F3F4F6';
    }
  };

  const filteredListings = SAMPLE_LISTINGS.filter(listing => {
    switch (activeTab) {
      case 'active':
        return listing.status === '대여가능';
      case 'rented':
        return listing.status === '대여중';
      case 'paused':
        return listing.status === '일시정지';
      default:
        return true;
    }
  });

  const handleEdit = (listingId: string) => {
    Alert.alert('수정', '게시글을 수정하시겠습니까?');
  };

  const handleDelete = (listingId: string) => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 게시글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => {
          Alert.alert('완료', '게시글이 삭제되었습니다.');
        }},
      ]
    );
  };

  const handleToggleStatus = (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === '대여가능' ? '일시정지' : '대여가능';
    Alert.alert(
      '상태 변경',
      `게시글을 ${newStatus} 상태로 변경하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { text: '변경', onPress: () => {
          Alert.alert('완료', `게시글이 ${newStatus} 상태로 변경되었습니다.`);
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>내가 판매 중</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            대여가능
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rented' && styles.activeTab]}
          onPress={() => setActiveTab('rented')}
        >
          <Text style={[styles.tabText, activeTab === 'rented' && styles.activeTabText]}>
            대여중
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'paused' && styles.activeTab]}
          onPress={() => setActiveTab('paused')}
        >
          <Text style={[styles.tabText, activeTab === 'paused' && styles.activeTabText]}>
            일시정지
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredListings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' && '대여 가능한 물건이 없습니다'}
              {activeTab === 'rented' && '대여 중인 물건이 없습니다'}
              {activeTab === 'paused' && '일시정지된 물건이 없습니다'}
            </Text>
            <Text style={styles.emptySubtitle}>
              새로운 대여 글을 작성해보세요
            </Text>
          </View>
        ) : (
          filteredListings.map((listing) => (
            <View key={listing.id} style={styles.listingCard}>
              <View style={styles.cardHeader}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBgColor(listing.status) }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(listing.status) }
                  ]}>
                    {listing.status}
                  </Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEdit(listing.id)}
                  >
                    <Edit3 size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDelete(listing.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Image source={{ uri: listing.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {listing.title}
                  </Text>
                  
                  <View style={styles.priceInfo}>
                    <Text style={styles.dailyPrice}>
                      {formatPrice(listing.dailyPrice)}원/일
                    </Text>
                    <Text style={styles.period}>• {listing.period}</Text>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Eye size={12} color="#6B7280" />
                      <Text style={styles.statText}>{listing.views}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <MessageCircle size={12} color="#6B7280" />
                      <Text style={styles.statText}>{listing.chatCount}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Calendar size={12} color="#6B7280" />
                      <Text style={styles.statText}>{listing.postedDate}</Text>
                    </View>
                  </View>

                  {listing.status === '대여중' && listing.currentRenter && (
                    <View style={styles.renterInfo}>
                      <Text style={styles.renterText}>
                        대여자: {listing.currentRenter}
                      </Text>
                      <Text style={styles.returnText}>
                        반납일: {listing.returnDate}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.cardFooter}>
                {listing.status !== '대여중' && (
                  <TouchableOpacity 
                    style={styles.toggleButton}
                    onPress={() => handleToggleStatus(listing.id, listing.status)}
                  >
                    <Text style={styles.toggleButtonText}>
                      {listing.status === '대여가능' ? '일시정지' : '다시 활성화'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>상세보기</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 22,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dailyPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  period: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  renterInfo: {
    backgroundColor: Colors.primaryLight,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  renterText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '500',
  },
  returnText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  toggleButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  viewButton: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primaryDark,
  },
});