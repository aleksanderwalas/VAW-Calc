import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { theme } from '../../theme/theme';

export const YieldChart = ({ annualProduction }) => {
  // Współczynniki miesięczne produkcji PV w Polsce (szacunkowe rozłożenie w % rocznej produkcji)
  const monthlyFactors = [0.03, 0.05, 0.09, 0.12, 0.15, 0.16, 0.15, 0.12, 0.08, 0.05, 0.03, 0.02];
  const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];

  const total = parseFloat(annualProduction) || 0;
  const monthlyData = monthlyFactors.map(factor => Math.round(total * factor));
  const maxVal = Math.max(...monthlyData, 100);

  const chartHeight = 160;
  const chartWidth = 320;
  const barWidth = 20;
  const spacing = 6;
  const startX = 30;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Miesięczny profil produkcji energii (kWh)</Text>
      <View style={styles.svgContainer}>
        <Svg height={chartHeight + 30} width={chartWidth}>
          {/* Linie siatki */}
          <Line x1="30" y1="20" x2={chartWidth} y2="20" stroke="#333" strokeDasharray="4,4" />
          <Line x1="30" y1={chartHeight / 2 + 10} x2={chartWidth} y2={chartHeight / 2 + 10} stroke="#333" strokeDasharray="4,4" />
          <Line x1="30" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#555" strokeWidth="1" />

          {/* Słupki wykresu */}
          {monthlyData.map((val, index) => {
            const barHeight = (val / maxVal) * (chartHeight - 30);
            const x = startX + index * (barWidth + spacing);
            const y = chartHeight - barHeight;

            return (
              <G key={months[index]}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={index >= 3 && index <= 8 ? theme.colors.primary : theme.colors.secondary}
                  rx={4}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 4}
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {val > 0 ? val : ''}
                </SvgText>
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 18}
                  fill="#D0D0D0"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {months[index]}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
          <Text style={styles.legendText}>Sezon letni (IV-IX)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: theme.colors.secondary }]} />
          <Text style={styles.legendText}>Sezon zimowy</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    color: '#A0A0A0',
    fontSize: 11,
  },
});
