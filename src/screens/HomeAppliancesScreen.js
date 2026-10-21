import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { HomeAppliancesCalc } from '../components/Electrical/HomeAppliancesCalc';
import { LEDLightingCalc } from '../components/Electrical/LEDLightingCalc';

export const HomeAppliancesScreen = () => {
  const [activeTab, setActiveTab] = useState('appliances');

  return (
    <View style={styles.container}>
      <View style={styles.segmentedContainer}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'appliances', label: 'Sprzęt AGD & Moc' },
            { value: 'led', label: 'Taśmy LED & Zasilacze' },
          ]}
          style={styles.segmented}
          theme={{
            colors: {
              secondaryContainer: '#10B981',
              onSecondaryContainer: '#000000',
              outline: '#333333',
            },
          }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {activeTab === 'appliances' && <HomeAppliancesCalc />}
        {activeTab === 'led' && <LEDLightingCalc />}
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  segmented: {
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
  },
});
