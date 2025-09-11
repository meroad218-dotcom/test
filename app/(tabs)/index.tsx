import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Clock, Eye } from 'lucide-react-native';
import * as Location from 'expo-location';
import Colors from '@/constants/Theme';

interface RentalPost {
  id: string;
  title: string;
  price: string;
  period: string;
  location: string;
  distance: string;
  image: string;
  views: number;
  timeAgo: string;
  userId: string;
}

const SAMPLE_POSTS: RentalPost[] = [
  {
    id: '1',
    title: '캠핑 텐트 대여해드립니다 (4인용)',
    price: '15,000원/일',
    period: '1일~7일',
    location: '서울시 강남구',
    distance: '0.3km',
    image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 23,
    timeAgo: '5분 전',
    userId: 'user1'
  },
  {
    id: '2',
    title: '전동드릴 대여 (보쉬 18V)',
    price: '8,000원/일',
    period: '1일~3일',
    location: '서울시 강남구',
    distance: '0.8km',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 15,
    timeAgo: '1시간 전',
    userId: 'user2'
  },
  {
    id: '3',
    title: '스위치 게임기 + 게임 2개',
    price: '12,000원/일',
    period: '1일~5일',
    location: '서울시 강남구',
    distance: '0.9km',
    image: 'https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 42,
    timeAgo: '3시간 전',
    userId: 'user3'
  },
  {
    id: '4',
    title: '빔 프로젝터 대여 (풀HD)',
    price: '20,000원/일',
    period: '1일~14일',
    location: '서울시 강남구',
    distance: '0.7km',
    image: 'https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg?auto=compress&cs=tinysrgb&w=400',
    views: 31,
    timeAgo: '5시간 전',
    userId: 'user4'
  }
];

export default function HomeScreen() {
  const [posts, setPosts] = useState<RentalPost[]>(SAMPLE_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const router = useRouter();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // 실제 API 호출 시뮬레이션
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePostPress = (postId: string) => {
    router.push(`/post/${postId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <MapPin size={16} color={Colors.primary} />
          <Text style={styles.locationText}>강남구</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.rangeText}>1km 이내</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post) => (
          <TouchableOpacity 
            key={post.id} 
            style={styles.postCard}
            onPress={() => handlePostPress(post.id)}
          >
            <Image source={{ uri: post.image }} style={styles.postImage} />
            <View style={styles.postContent}>
              <Text style={styles.postTitle} numberOfLines={2}>
                {post.title}
              </Text>
              <View style={styles.postInfo}>
                <Text style={styles.price}>{post.price}</Text>
                <Text style={styles.period}>• {post.period}</Text>
              </View>
              <View style={styles.postMeta}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationText}>{post.location}</Text>
                  <Text style={styles.distance}> • {post.distance}</Text>
                </View>
                <View style={styles.postStats}>
                  <View style={styles.viewCount}>
                    <Eye size={12} color="#6B7280" />
                    <Text style={styles.viewText}>{post.views}</Text>
                  </View>
                  <Text style={styles.timeAgo}> • {post.timeAgo}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
    color: '#111827',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  postCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  postContent: {
    flex: 1,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    lineHeight: 22,
    marginBottom: 4,
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  period: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  postMeta: {
    justifyContent: 'space-between',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  distance: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  postStats: {
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
});