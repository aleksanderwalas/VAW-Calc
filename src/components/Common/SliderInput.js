import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Slider from '@react-native-community/slider'; // Będziemy używać tego, po uzyskaniu zgody zainstalujemy
import { theme } from '../../theme/theme';

export const SliderInput = ({ label, value, min, max, step, onValueChange, unit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value} {unit}</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={parseFloat(value)}
        onValueChange={(val) => onValueChange(String(val))}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.outline}
        thumbTintColor={theme.colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  value: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
