import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Icon } from 'react-native-paper';

export const ResultRow = ({ label, value, unit, isHighlight = false, isWarning = false, isSuccess = false }) => {
  let valueColor = '#FFFFFF';
  if (isHighlight) valueColor = '#F59E0B';
  if (isWarning) valueColor = '#EF4444';
  if (isSuccess) valueColor = '#10B981';

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>
        {value} {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </Text>
    </View>
  );
};

export const ResultCard = ({ title, children, status = 'neutral', statusMessage }) => {
  let borderColor = '#333333';
  if (status === 'success') borderColor = '#10B981';
  if (status === 'warning') borderColor = '#F59E0B';
  if (status === 'danger') borderColor = '#EF4444';

  return (
    <Card style={[styles.card, { borderColor }]}>
      <Card.Content>
        {title && <Text style={styles.title}>{title}</Text>}
        {children}
        {statusMessage && (
          <View style={[styles.statusBanner, { backgroundColor: getStatusBg(status) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
              {statusMessage}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const getStatusBg = (status) => {
  switch (status) {
    case 'success': return '#064E3B';
    case 'warning': return '#451A03';
    case 'danger': return '#450A0A';
    default: return '#1F2937';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'success': return '#34D399';
    case 'warning': return '#FBBF24';
    case 'danger': return '#F87171';
    default: return '#9CA3AF';
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1.5,
    marginVertical: 12,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  label: {
    fontSize: 14,
    color: '#A0A0A0',
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 13,
    color: '#888888',
    fontWeight: 'normal',
  },
  statusBanner: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
