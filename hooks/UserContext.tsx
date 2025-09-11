import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  location: string;
  joinDate: string;
  rating: number;
  reviewCount: number;
  accountNumber: string;
}

interface UserContextType {
  currentUser: User;
  updateUser: (user: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// 현재 로그인한 사용자 정보 (실제로는 로그인 시스템에서 가져와야 함)
const DEFAULT_CURRENT_USER: User = {
  id: 'current_user',
  name: '김철수',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  location: '서울시 강남구',
  joinDate: '2023.03',
  rating: 4.8,
  reviewCount: 24,
  accountNumber: '1234-56-789012 (국민은행)',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_CURRENT_USER);

  const updateUser = (userData: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <UserContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
