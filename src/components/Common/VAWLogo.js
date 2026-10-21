import React from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Text as SvgText,
  G,
  Circle,
} from 'react-native-svg';

export const VAWLogo = ({ size = 52, showText = true }) => {
  const width = showText ? size * 3.8 : size;
  const height = size;

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={width} height={height} viewBox="0 0 320 80" fill="none">
        <Defs>
          <LinearGradient id="proBox" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1E293B" />
            <Stop offset="100%" stopColor="#0F172A" />
          </LinearGradient>
          <LinearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F59E0B" />
            <Stop offset="50%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#10B981" />
          </LinearGradient>
        </Defs>

        {/* --- IKONA PRO: Miernik w kształcie symbolu uziemienia / obwodu elektrycznego --- */}
        <G transform="translate(6, 6)">
          {/* Sześciokątna/techniczna ramka obudowy miernika */}
          <Rect
            x="0"
            y="0"
            width="68"
            height="68"
            rx="14"
            fill="url(#proBox)"
            stroke="url(#electricGradient)"
            strokeWidth="3.5"
          />

          {/* Wyświetlacz LCD z falą napięcia (oscyloskop / multimetr) */}
          <Rect
            x="10"
            y="10"
            width="48"
            height="22"
            rx="4"
            fill="#0B0F19"
            stroke="#38BDF8"
            strokeWidth="1.5"
          />

          {/* Fala sinusoidalna na wyświetlaczu */}
          <Path
            d="M 14 21 Q 20 13, 26 21 T 38 21 T 50 21"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Symbol elektryczny uziemienia / rozdzielnicy na dole miernika */}
          <Path d="M 34 38 V 48" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M 26 48 H 42" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          <Path d="M 29 53 H 39" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <Path d="M 32 58 H 36" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        </G>

        {/* --- TYPOGRAFIA --- */}
        {showText && (
          <G transform="translate(90, 0)">
            <SvgText x="0" y="46" fill="#FFFFFF" fontSize="36" fontWeight="900" letterSpacing="1.5" fontFamily="sans-serif">
              VAW
            </SvgText>
            <SvgText x="92" y="46" fill="#F59E0B" fontSize="36" fontWeight="300" letterSpacing="1" fontFamily="sans-serif">
              CALC
            </SvgText>
            <SvgText x="2" y="65" fill="#94A3B8" fontSize="10" fontWeight="700" letterSpacing="2.5" fontFamily="sans-serif">
              ENGINEERING SUITE v1.0.4
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
};
