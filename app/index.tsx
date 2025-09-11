import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // 즉시 스플래시 화면으로 리다이렉트
    router.replace('/splash');
  }, []);

  return null;
}