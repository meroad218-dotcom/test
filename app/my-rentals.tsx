import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Calendar, MapPin, Clock, MessageCircle } from 'lucide-react-native';
import Colors from '@/constants/Theme';
import BackButton from '@/components/BackButton';

interface RentalItem {
  id: string;
  title: string;
  image: string;
  owner: string;
  ownerAvatar: string;
  rentalDate: string;
  returnDate: string;
  dailyPrice: number;
  totalPrice: number;
  status: '대여중' | '반납완료' | '연체중';
  location: string;
  daysLeft: number;
}

const SAMPLE_RENTALS: RentalItem[] = [
  {
    id: '1',
    title: '캠핑 텐트 (4인용)',
    image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&w=400',
    owner: '김철수',
    ownerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    rentalDate: '2024-01-14',
    returnDate: '2024-01-17',
    dailyPrice: 15000,
    totalPrice: 45000,
    status: '대여중',
    location: '강남구',
    daysLeft: 2,
  },
  {
    id: '2',
    title: '전동드릴 (보쉬 18V)',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
    owner: '이영희',
    ownerAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    rentalDate: '2024-01-10',
    returnDate: '2024-01-13',
    dailyPrice: 8000,
    totalPrice: 24000,
    status: '반납완료',
    location: '서초구',
    daysLeft: 0,
  },
  {
    id: '3',
    title: '빔 프로젝터 (풀HD)',
    image: 'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=400',
    owner: '박민수',
    ownerAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    rentalDate: '2024-01-05',
    returnDate: '2024-01-08',
    dailyPrice: 20000,
    totalPrice: 60000,
    status: '연체중',
    location: '강남구',
    daysLeft: -2,
  },
];

export default function MyRentalsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ongoing' | 'completed'>('ongoing');

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '대여중':
        return Colors.primary;
      case '반납완료':
        return '#10B981';
      case '연체중':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case '대여중':
        return Colors.primaryLight;
      case '반납완료':
        return '#F0FDF4';
      case '연체중':
        return '#FEF2F2';
      default:
        return '#F3F4F6';
    }
  };

  const filteredRentals = SAMPLE_RENTALS.filter(rental => {
    if (activeTab === 'ongoing') {
      return rental.status === '대여중' || rental.status === '연체중';
    } else {
      return rental.status === '반납완료';
    }
  });

  const handleChat = (rental: RentalItem) => {
    router.push({
      pathname: `/chat-room/rental_${rental.id}`,
      params: {
        id: `rental_${rental.id}`,
        ownerName: rental.owner,
        ownerAvatar: rental.ownerAvatar,
        itemTitle: rental.title,
        itemImage: rental.image,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>내가 대여 중</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
            진행중
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            완료
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredRentals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              {activeTab === 'ongoing' ? '진행 중인 대여가 없습니다' : '완료된 대여가 없습니다'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'ongoing' ? '새로운 물건을 대여해보세요' : '대여 내역이 여기에 표시됩니다'}
            </Text>
          </View>
        ) : (
          filteredRentals.map((rental) => (
            <View key={rental.id} style={styles.rentalCard}>
              <View style={styles.cardHeader}>
                <View style={styles.ownerInfo}>
                  <Image source={{ uri: rental.ownerAvatar }} style={styles.ownerAvatar} />
                  <Text style={styles.ownerName}>{rental.owner}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusBgColor(rental.status) }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(rental.status) }
                  ]}>
                    {rental.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Image source={{ uri: rental.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{rental.title}</Text>
                  
                  <View style={styles.infoRow}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.infoText}>
                      {rental.rentalDate} ~ {rental.returnDate}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.infoText}>{rental.location}</Text>
                  </View>

                  {rental.status === '대여중' && (
                    <View style={styles.infoRow}>
                      <Clock size={14} color={Colors.primary} />
                      <Text style={[styles.infoText, { color: Colors.primary }]}>
                        {rental.daysLeft}일 남음
                      </Text>
                    </View>
                  )}

                  {rental.status === '연체중' && (
                    <View style={styles.infoRow}>
                      <Clock size={14} color="#EF4444" />
                      <Text style={[styles.infoText, { color: '#EF4444' }]}>
                        {Math.abs(rental.daysLeft)}일 연체
                      </Text>
                    </View>
                  )}

                  <View style={styles.priceInfo}>
                    <Text style={styles.dailyPrice}>
                      {formatPrice(rental.dailyPrice)}원/일
                    </Text>
                    <Text style={styles.totalPrice}>
                      총 {formatPrice(rental.totalPrice)}원
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.chatButton}
                  onPress={() => handleChat(rental)}
                >
                  <MessageCircle size={16} color={Colors.primary} />
                  <Text style={styles.chatButtonText}>채팅하기</Text>
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
  rentalCard: {
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
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
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
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  priceInfo: {
    marginTop: 8,
  },
  dailyPrice: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primaryDark,
    marginLeft: 4,
  },
});