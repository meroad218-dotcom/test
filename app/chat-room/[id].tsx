import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useUser } from '@/hooks/UserContext';
import { ComponentColors } from '@/constants/Theme';

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: string;
  avatar?: string;
}

interface ChatRoomData {
  id: string;
  otherUser: {
    name: string;
    avatar: string;
  };
  itemTitle: string;
  itemImage: string;
}

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    text: '안녕하세요! 캠핑 텐트 대여 문의드립니다.',
    isMe: true,
    timestamp: '14:30',
  },
  {
    id: '2',
    text: '안녕하세요! 언제 사용하실 예정이신가요?',
    isMe: false,
    timestamp: '14:32',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: '3',
    text: '이번 주말 1박2일로 사용하고 싶습니다.',
    isMe: true,
    timestamp: '14:33',
  },
  {
    id: '4',
    text: '네, 가능합니다! 보증금은 현금으로 5만원 받습니다.',
    isMe: false,
    timestamp: '14:35',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

const SAMPLE_CHAT_ROOM: ChatRoomData = {
  id: '1',
  otherUser: {
    name: '민수님',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  itemTitle: '캠핑 텐트 대여',
  itemImage: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&w=100',
};

export default function ChatRoomScreen() {
  const params = useLocalSearchParams();
  const { id, postId, ownerId, ownerName, ownerAvatar, itemTitle, itemImage } = params;
  const router = useRouter();
  const { currentUser } = useUser();
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [chatRoom, setChatRoom] = useState<ChatRoomData>(SAMPLE_CHAT_ROOM);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // 파라미터가 있으면 새로운 채팅방 정보로 설정
    if (ownerName && ownerAvatar && itemTitle && itemImage) {
      setChatRoom({
        id: id as string,
        otherUser: {
          name: ownerName as string,
          avatar: ownerAvatar as string,
        },
        itemTitle: itemTitle as string,
        itemImage: itemImage as string,
      });
      
      // 새로운 채팅방이면 빈 메시지 목록으로 시작
      setMessages([]);
    }
  }, [id, ownerName, ownerAvatar, itemTitle, itemImage]);

  const handleBack = () => {
    router.back();
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isMe: true,
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');

    // 메시지 전송 후 하단으로 스크롤
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.otherMessage]}>
        {!item.isMe && (
          <Image source={{ uri: item.avatar || chatRoom.otherUser.avatar }} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
          <Text style={[styles.messageText, item.isMe ? styles.myMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, item.isMe ? styles.myMessageTime : styles.otherMessageTime]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Image source={{ uri: chatRoom.itemImage }} style={styles.headerItemImage} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{chatRoom.otherUser.name}</Text>
            <Text style={styles.headerSubtitle}>{chatRoom.itemTitle}</Text>
          </View>
        </View>
        <Image source={{ uri: chatRoom.otherUser.avatar }} style={styles.headerAvatar} />
      </View>

      {/* 메시지 목록 */}
      <KeyboardAvoidingView 
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* 입력창 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
            onSubmitEditing={handleSendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? "white" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerItemImage: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: ComponentColors.chat.myBubble,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
    color: '#111827',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: ComponentColors.chat.myBubble,
  },
  sendButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
});
