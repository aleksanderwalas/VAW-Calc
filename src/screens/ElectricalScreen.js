import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { VoltageDropCalc } from '../components/Electrical/VoltageDropCalc';
import { CableSizingCalc } from '../components/Electrical/CableSizingCalc';
import { ShortCircuitCalc } from '../components/Electrical/ShortCircuitCalc';
import { ReactivePowerCalc } from '../components/Electrical/ReactivePowerCalc';
import { ProtectionCalc } from '../components/Electrical/ProtectionCalc';
import { ChecklistAssist } from '../components/Electrical/ChecklistAssist';
import { SwitchboardCalc } from '../components/Electrical/SwitchboardCalc';

export const ElectricalScreen = () => {
  const [activeTab, setActiveTab] = useState('vdrop');

  return (
    <View style={styles.container}>
      <View style={styles.segmentedContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SegmentedButtons
            value={activeTab}
            onValueChange={setActiveTab}
            buttons={[
              { value: 'vdrop', label: 'Spadek U', labelStyle: { fontSize: 11 } },
              { value: 'cable', label: 'Dobór Kabla', labelStyle: { fontSize: 11 } },
              { value: 'protection', label: 'Zabezpieczenia', labelStyle: { fontSize: 11 } },
              { value: 'short', label: 'Zwarcia', labelStyle: { fontSize: 11 } },
              { value: 'reactive', label: 'Moc Bierna', labelStyle: { fontSize: 11 } },
              { value: 'board', label: 'Rozdzielnica', labelStyle: { fontSize: 11 } },
              { value: 'checklist', label: 'Asystent/Odbiór', labelStyle: { fontSize: 11 } },
            ]}
            style={styles.segmented}
            density="high"
            theme={{
              colors: {
                secondaryContainer: '#38BDF8',
                onSecondaryContainer: '#000000',
                outline: '#333333',
              },
            }}
          />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'vdrop' && <VoltageDropCalc />}
        {activeTab === 'cable' && <CableSizingCalc />}
        {activeTab === 'protection' && <ProtectionCalc />}
        {activeTab === 'short' && <ShortCircuitCalc />}
        {activeTab === 'reactive' && <ReactivePowerCalc />}
        {activeTab === 'board' && <SwitchboardCalc />}
        {activeTab === 'checklist' && <ChecklistAssist />}
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
    padding: 12,
    backgroundColor: '#1E1E1E',
  },
  segmented: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
  },
});
