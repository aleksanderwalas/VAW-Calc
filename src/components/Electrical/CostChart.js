import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { theme } from '../../theme/theme';

export const CostChart = ({ labor, material }) => {
  const l = parseFloat(labor) || 0;
  const m = parseFloat(material) || 0;
  const total = l + m;

  if (total === 0) return null;

  const laborPercent = (l / total) * 100;
  const radius = 60;
  const stroke = 20;
  const center = 80;
  const circumference = 2 * Math.PI * (radius - stroke / 2);
  const strokeDashoffset = circumference - (laborPercent / 100) * circumference;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Struktura kosztów</Text>
      <Svg height="160" width="160">
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Tło */}
          <Path
            d={`M ${center} ${center - (radius - stroke/2)} A ${radius-stroke/2} ${radius-stroke/2} 0 1 1 ${center-0.1} ${center - (radius - stroke/2)}`}
            stroke={theme.colors.secondary}
            strokeWidth={stroke}
            fill="none"
          />
          {/* Słupek robocizny */}
          <Path
            d={`M ${center} ${center - (radius - stroke/2)} A ${radius-stroke/2} ${radius-stroke/2} 0 1 1 ${center-0.1} ${center - (radius - stroke/2)}`}
            stroke={theme.colors.primary}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
        <SvgText x={center} y={center + 5} fontSize="14" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
          {Math.round(laborPercent)}%
        </SvgText>
        <SvgText x={center} y={center + 20} fontSize="10" fill="#A0A0A0" textAnchor="middle">
          robocizna
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
