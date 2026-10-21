import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { StringCalc } from '../components/PV/StringCalc';
import { PanelCalc } from '../components/PV/PanelCalc';
import { InverterCalc } from '../components/PV/InverterCalc';
import { DCCableCalc } from '../components/PV/DCCableCalc';
import { YieldCalc } from '../components/PV/YieldCalc';
import { SPDCalc } from '../components/PV/SPDCalc';

export const PVScreen = () => {
  const [activeTab, setActiveTab] = useState('string');

  return (
    <View style={styles.container}>
      <View style={styles.segmentedContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              { value: 'string', label: 'Łańcuchy', labelStyle: { fontSize: 11 } },
              { value: 'panel', label: 'Moduł & T', labelStyle: { fontSize: 11 } },
              { value: 'inverter', label: 'Falownik', labelStyle: { fontSize: 11 } },
              { value: 'cable', label: 'Kable DC', labelStyle: { fontSize: 11 } },
              { value: 'yield', label: 'Produkcja', labelStyle: { fontSize: 11 } },
              { value: 'spd', label: 'SPD', labelStyle: { fontSize: 11 } },
            ]}
            style={styles.segmented}
            density="high"
            theme={{
              colors: {
                secondaryContainer: '#F59E0B',
                onSecondaryContainer: '#000000',
                outline: '#333333',
              },
            }}
          />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {activeTab === 'string' && <StringCalc />}
        {activeTab === 'panel' && <PanelCalc />}
        {activeTab === 'inverter' && <InverterCalc />}
        {activeTab === 'cable' && <DCCableCalc />}
        {activeTab === 'yield' && <YieldCalc />}
        {activeTab === 'spd' && <SPDCalc />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  segmentedContainer: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  segmented: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 14,
  },
});
