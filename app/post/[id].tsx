import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Eye, Heart, MessageCircle, Share } from 'lucide-react-native';
import { useUser } from '@/hooks/UserContext';
import { useChat } from '@/hooks/ChatContext';
import Colors from '@/constants/Theme';

const { width } = Dimensions.get('window');

interface RentalPost {
  id: string;
  title: string;
  price: string;
  period: string;
  location: string;
  distance: string;
  images: string[];
  views: number;
  timeAgo: string;
  description: string;
  category: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
  };
}

const SAMPLE_POST: RentalPost = {
  id: '1',
  title: '캠핑 텐트 대여해드립니다 (4인용)',
  price: '15,000원/일',
  period: '1일~7일',
  location: '서울시 강남구',
  distance: '0.3km',
  images: [
    'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/2662816/pexels-photo-2662816.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  views: 23,
  timeAgo: '5분 전',
  description: `4인용 캠핑 텐트 대여해드립니다.

🏕️ 제품 정보
- 브랜드: 코베아
- 크기: 4인용 (240x210x130cm)
- 무게: 약 3.2kg
- 방수 기능: 완벽 방수

📋 대여 조건
- 최소 1일부터 최대 7일까지
- 픽업/반납: 강남구 역삼동
- 보증금: 50,000원 (반납 시 환불)

✅ 포함 사항
- 텐트 본체
- 팩 (못)
- 가이라인
- 수납 가방

❌ 주의사항
- 흡연 금지
- 애완동물 동반 불가
- 파손 시 수리비 별도

깨끗하게 관리하고 있으니 안심하고 사용하세요!`,
  category: '캠핑용품',
  owner: {
    id: 'owner_kimcheolsu',
    name: '김철수',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4.8,
    reviewCount: 24,
  },
};

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { currentUser } = useUser();
  const { addChatRoom } = useChat();
  const [post, setPost] = useState<RentalPost>(SAMPLE_POST);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleChat = () => {
    // 자신의 게시물인지 확인
    if (post.owner.id === currentUser.id) {
      Alert.alert('알림', '본인의 게시물에는 채팅을 보낼 수 없습니다.');
      return;
    }

    Alert.alert(
      '채팅하기',
      `${post.owner.name}님과 채팅을 시작하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '채팅하기',
          onPress: () => {
            // 채팅방 ID를 현재 사용자와 게시물 작성자의 조합으로 생성
            const chatRoomId = `${currentUser.id}_${post.owner.id}_${post.id}`;
            
            // 새로운 채팅방을 채팅 목록에 추가
            addChatRoom({
              id: chatRoomId,
              otherUser: {
                id: post.owner.id,
                name: post.owner.name,
                avatar: post.owner.avatar,
              },
              lastMessage: '채팅을 시작했습니다.',
              timestamp: new Date().toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              unreadCount: 0,
              itemTitle: post.title,
              itemImage: post.images[0],
              postId: post.id,
            });

            router.push({
              pathname: `/chat-room/[id]`,
              params: { 
                id: chatRoomId,
                postId: post.id,
                ownerId: post.owner.id,
                ownerName: post.owner.name,
                ownerAvatar: post.owner.avatar,
                itemTitle: post.title,
                itemImage: post.images[0]
              }
            });
          },
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('공유하기', '이 게시물을 공유하시겠습니까?');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Share size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike} style={styles.headerButton}>
            <Heart 
              size={20} 
              color={isLiked ? "#EF4444" : "#111827"} 
              fill={isLiked ? "#EF4444" : "none"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 이미지 갤러리 */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {post.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </ScrollView>
          
          {/* 이미지 인디케이터 */}
          <View style={styles.imageIndicator}>
            <Text style={styles.imageCount}>
              {currentImageIndex + 1} / {post.images.length}
            </Text>
          </View>
        </View>

        {/* 게시물 정보 */}
        <View style={styles.postInfo}>
          <View style={styles.postHeader}>
            <Text style={styles.category}>{post.category}</Text>
            <View style={styles.postMeta}>
              <View style={styles.viewCount}>
                <Eye size={12} color="#6B7280" />
                <Text style={styles.viewText}>{post.views}</Text>
              </View>
              <Text style={styles.timeAgo}> • {post.timeAgo}</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          
          <View style={styles.priceInfo}>
            <Text style={styles.price}>{post.price}</Text>
            <Text style={styles.period}> • {post.period}</Text>
          </View>

          <View style={styles.locationInfo}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.location}>{post.location}</Text>
            <Text style={styles.distance}> • {post.distance}</Text>
          </View>
        </View>

        {/* 설명 */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>상세 설명</Text>
          <Text style={styles.description}>{post.description}</Text>
        </View>

        {/* 판매자 정보 */}
        <View style={styles.ownerSection}>
          <Text style={styles.sectionTitle}>대여자 정보</Text>
          <View style={styles.ownerInfo}>
            <Image source={{ uri: post.owner.avatar }} style={styles.ownerAvatar} />
            <View style={styles.ownerDetails}>
              <Text style={styles.ownerName}>{post.owner.name}</Text>
              <View style={styles.ownerRating}>
                <Text style={styles.rating}>⭐ {post.owner.rating}</Text>
                <Text style={styles.reviewCount}>({post.owner.reviewCount}개 후기)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 하단 액션 바 */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.bottomPrice}>{post.price}</Text>
          <Text style={styles.bottomPeriod}>{post.period}</Text>
        </View>
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <MessageCircle size={20} color="white" />
          <Text style={styles.chatButtonText}>채팅하기</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  postInfo: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F3F4F6',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 28,
    marginBottom: 12,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  period: {
    fontSize: 14,
    color: '#6B7280',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  descriptionSection: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  ownerSection: {
    padding: 16,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  ownerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#374151',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  priceContainer: {
    flex: 1,
  },
  bottomPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  bottomPeriod: {
    fontSize: 12,
    color: '#6B7280',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});