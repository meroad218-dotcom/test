import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, X, Plus } from 'lucide-react-native';
import { ComponentColors } from '@/constants/Theme';

interface RentalForm {
  title: string;
  description: string;
  price: string;
  period: string;
  category: string;
  images: string[];
}

const CATEGORIES = [
  '전자제품',
  '스포츠/레저',
  '캠핑용품',
  '공구/장비',
  '생활용품',
  '기타',
];

export default function WriteScreen() {
  const [form, setForm] = useState<RentalForm>({
    title: '',
    description: '',
    price: '',
    period: '',
    category: '',
    images: [],
  });

  const handleSubmit = () => {
    if (!form.title || !form.price || !form.period) {
      Alert.alert('알림', '필수 항목을 모두 입력해주세요.');
      return;
    }

    Alert.alert(
      '게시글 등록',
      '대여 글을 등록하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '등록',
          onPress: () => {
            // 실제로는 API 호출
            Alert.alert('완료', '대여 글이 등록되었습니다.');
            // 폼 초기화
            setForm({
              title: '',
              description: '',
              price: '',
              period: '',
              category: '',
              images: [],
            });
          },
        },
      ]
    );
  };

  const addImage = () => {
    // 실제로는 이미지 선택 기능
    const sampleImages = [
      'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=400',
    ];
    
    if (form.images.length < 5) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, sampleImages[prev.images.length % sampleImages.length]]
      }));
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>대여 글쓰기</Text>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form}>
        {/* 이미지 업로드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>사진 ({form.images.length}/5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.imageContainer}>
              <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
                <Camera size={24} color="#9CA3AF" />
                <Text style={styles.addImageText}>사진 추가</Text>
              </TouchableOpacity>
              {form.images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.selectedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 제목 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>제목 *</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="대여할 물건의 제목을 입력하세요"
            value={form.title}
            onChangeText={(text) => setForm(prev => ({ ...prev, title: text }))}
            maxLength={50}
          />
        </View>

        {/* 카테고리 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>카테고리</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    form.category === category && styles.categoryButtonActive
                  ]}
                  onPress={() => setForm(prev => ({ ...prev, category }))}
                >
                  <Text style={[
                    styles.categoryText,
                    form.category === category && styles.categoryTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 대여료 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>대여료 *</Text>
          <View style={styles.priceInputContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="0"
              value={form.price}
              onChangeText={(text) => setForm(prev => ({ ...prev, price: text }))}
              keyboardType="numeric"
            />
            <Text style={styles.priceUnit}>원/일</Text>
          </View>
        </View>

        {/* 대여 기간 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>대여 기간 *</Text>
          <TextInput
            style={styles.input}
            placeholder="예: 1일~7일"
            value={form.period}
            onChangeText={(text) => setForm(prev => ({ ...prev, period: text }))}
          />
        </View>

        {/* 설명 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상세 설명</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="대여할 물건에 대한 자세한 설명을 입력하세요"
            value={form.description}
            onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
            multiline
            textAlignVertical="top"
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  submitButton: {
    backgroundColor: ComponentColors.button.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addImageText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: ComponentColors.button.primary,
    borderColor: ComponentColors.button.primary,
  },
  categoryText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryTextActive: {
    color: 'white',
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
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
});