import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatRoom {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  itemTitle: string;
  itemImage: string;
  postId: string;
}

interface ChatContextType {
  chatRooms: ChatRoom[];
  addChatRoom: (chatRoom: ChatRoom) => void;
  updateLastMessage: (chatRoomId: string, message: string, timestamp: string) => void;
  markAsRead: (chatRoomId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// 샘플 채팅방 데이터
const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'sample_chat_1',
    otherUser: {
      id: 'user_minsu',
      name: '민수님',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    lastMessage: '내일 오후 3시에 만날까요?',
    timestamp: '오후 2:30',
    unreadCount: 2,
    itemTitle: '캠핑 텐트 대여',
    itemImage: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&w=100',
    postId: 'post_1',
  },
  {
    id: 'sample_chat_2',
    otherUser: {
      id: 'user_younghee',
      name: '영희님',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    lastMessage: '전동드릴 사용법 알려주세요',
    timestamp: '오전 11:20',
    unreadCount: 0,
    itemTitle: '전동드릴 대여',
    itemImage: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=100',
    postId: 'post_2',
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(INITIAL_CHAT_ROOMS);

  const addChatRoom = (newChatRoom: ChatRoom) => {
    setChatRooms(prev => {
      // 이미 존재하는 채팅방인지 확인
      const existingIndex = prev.findIndex(room => room.id === newChatRoom.id);
      if (existingIndex >= 0) {
        // 기존 채팅방이 있으면 맨 위로 이동
        const updatedRooms = [...prev];
        const existingRoom = updatedRooms.splice(existingIndex, 1)[0];
        return [existingRoom, ...updatedRooms];
      } else {
        // 새로운 채팅방 추가
        return [newChatRoom, ...prev];
      }
    });
  };

  const updateLastMessage = (chatRoomId: string, message: string, timestamp: string) => {
    setChatRooms(prev => prev.map(room => {
      if (room.id === chatRoomId) {
        return {
          ...room,
          lastMessage: message,
          timestamp,
          unreadCount: room.unreadCount + 1
        };
      }
      return room;
    }));
  };

  const markAsRead = (chatRoomId: string) => {
    setChatRooms(prev => prev.map(room => {
      if (room.id === chatRoomId) {
        return { ...room, unreadCount: 0 };
      }
      return room;
    }));
  };

  return (
    <ChatContext.Provider value={{ 
      chatRooms, 
      addChatRoom, 
      updateLastMessage, 
      markAsRead 
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
