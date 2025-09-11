import React from 'react';
import { View } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
} from 'react-native-svg';

interface LogoProps {
  size?: number;
  variant?: 'orange' | 'blue' | 'purple' | 'green' | 'red';
}

export default function Logo({
  size = 80,
  variant = 'orange',
}: LogoProps) {
  const colors = {
    orange: { primary: '#FF6B35', secondary: '#FF8B65' },
    blue: { primary: '#0055FF', secondary: '#3D7EFF' },
    purple: { primary: '#9C27B0', secondary: '#BA68C8' },
    green: { primary: '#4CAF50', secondary: '#81C784' },
    red: { primary: '#F44336', secondary: '#EF5350' },
  };

  const currentColor = colors[variant];

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient
            id="carrotGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop
              offset="0%"
              stopColor={currentColor.primary}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={currentColor.secondary}
              stopOpacity="1"
            />
          </LinearGradient>
        </Defs>

        {/* 메인 원형 배경 */}
        <Circle cx="50" cy="50" r="40" fill="url(#carrotGradient)" />

        {/* 가운데 흰색 원 */}
        <Circle cx="50" cy="50" r="15" fill="#ffffff" />

        {/* 위쪽 잎사귀 */}
        <Path
          d="M45 15 
             C 43 10, 47 8, 49 12
             C 51 8, 55 10, 53 15
             C 52 17, 48 17, 45 15 Z"
          fill="#4CAF50"
        />
      </Svg>
    </View>
  );
}
