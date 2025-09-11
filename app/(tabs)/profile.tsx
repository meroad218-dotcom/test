import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, CreditCard, Settings, CircleHelp as HelpCircle, Star, ChevronRight, MapPin, Clock } from 'lucide-react-native';
import { useUser } from '@/hooks/UserContext';
import Colors from '@/constants/Theme';


const MENU_ITEMS = [
  {
    id: 'account',
    title: '계좌 정보',
    icon: CreditCard,
    color: Colors.primary,
  },
  {
    id: 'settings',
    title: '설정',
    icon: Settings,
    color: '#6B7280',
  },
  {
    id: 'help',
    title: '고객센터',
    icon: HelpCircle,
    color: '#6B7280',
  },
];

export default function ProfileScreen() {
  const { currentUser: user } = useUser();

  const handleMenuPress = (menuId: string) => {
    switch (menuId) {
      case 'account':
        Alert.alert(
          '계좌 정보', 
          `등록된 계좌번호:\n${user.accountNumber}\n\n대여료 입금용으로 사용됩니다.`
        );
        break;
      case 'settings':
        Alert.alert('설정', '설정 화면으로 이동합니다.');
        break;
      case 'help':
        Alert.alert('고객센터', '고객센터 화면으로 이동합니다.');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>마이페이지</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.location}>{user.location}</Text>
              </View>
              <View style={styles.joinDateContainer}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.joinDate}>{user.joinDate} 가입</Text>
              </View>
            </View>
          </View>

          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{user.rating}</Text>
              <Text style={styles.reviewCount}>({user.reviewCount}개 후기)</Text>
            </View>
          </View>
        </View>

        {/* 계좌 정보 하이라이트 */}
        <View style={styles.accountHighlight}>
          <View style={styles.accountInfo}>
            <CreditCard size={20} color={Colors.primary} />
            <Text style={styles.accountTitle}>등록된 계좌</Text>
          </View>
          <Text style={styles.accountNumber}>{user.accountNumber}</Text>
          <Text style={styles.accountNote}>
            대여료는 이 계좌로 입금됩니다
          </Text>
        </View>

        {/* 메뉴 섹션 */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={styles.menuLeft}>
                <item.icon size={20} color={item.color} />
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 통계 섹션 */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>나의 대여 현황</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>대여 중</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>23</Text>
              <Text style={styles.statLabel}>총 거래</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>내 글</Text>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 8,
    borderBottomColor: '#F3F4F6',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  joinDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinDate: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  ratingSection: {
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  accountHighlight: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginLeft: 8,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  accountNote: {
    fontSize: 12,
    color: '#6B7280',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  statsSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
});