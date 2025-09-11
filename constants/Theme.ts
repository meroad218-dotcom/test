// 앱의 전체 테마 색상을 관리하는 파일

export const Colors = {
  // 포인트 컬러 (메인 색상)
  primary: '#0055FF',
  
  // 포인트 컬러 변형들
  primaryLight: '#EEF6FF',    // 연한 배경
  primaryBorder: '#BFDBFE',   // 테두리
  primaryDark: '#1D4ED8',     // 진한 텍스트
  
  // 기본 색상들
  white: '#FFFFFF',
  black: '#000000',
  
  // 그레이 스케일
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // 시맨틱 컬러
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // 배경 색상
  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  
  // 텍스트 색상
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
};

// 컴포넌트별 테마
export const ComponentColors = {
  // 버튼
  button: {
    primary: Colors.primary,
    primaryText: Colors.white,
    secondary: Colors.gray100,
    secondaryText: Colors.gray700,
  },
  
  // 탭바
  tabBar: {
    active: Colors.primary,
    inactive: Colors.gray400,
    background: Colors.white,
    border: Colors.border,
  },
  
  // 카드
  card: {
    background: Colors.white,
    border: Colors.border,
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  // 입력 필드
  input: {
    background: Colors.white,
    border: Colors.border,
    focusBorder: Colors.primary,
    placeholder: Colors.textTertiary,
  },
  
  // 채팅
  chat: {
    myBubble: Colors.primary,
    myText: Colors.white,
    otherBubble: Colors.white,
    otherText: Colors.textPrimary,
    unreadBadge: Colors.primary,
  },
  
  // 하이라이트 박스
  highlight: {
    background: Colors.primaryLight,
    border: Colors.primaryBorder,
    text: Colors.primaryDark,
  },
};

// 간편 접근을 위한 기본 익스포트
export default Colors;
