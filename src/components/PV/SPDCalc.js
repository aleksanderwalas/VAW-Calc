import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, HelperText, Card } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { ShieldCheck, Zap, Info } from 'lucide-react-native';

export const SPDCalc = () => {
  const [hasLPS, setHasLPS] = useState('no'); // 'yes' | 'no'
  const [separationDistance, setSeparationDistance] = useState('yes'); // 'yes' (maintained) | 'no'
  const [distanceToPanels, setDistanceToPanels] = useState('15'); // m (DC cable length)
  const [inverterLocation, setInverterLocation] = useState('inside'); // 'inside' | 'outside'

  const calculate = () => {
    // Logic based on PN-HD 60364-7-712 and PN-EN 62305
    let dcRecommendation = '';
    let acRecommendation = '';
    let spdStatus = 'success';

    // DC Side Analysis
    if (hasLPS === 'yes') {
      if (separationDistance === 'yes') {
        dcRecommendation = 'Typ 2 (T2) wystarczy na DC, o ile zachowano odstęp izolacyjny s.';
      } else {
        dcRecommendation = 'Wymagany Typ 1 (T1+T2) na DC (brak zachowanego odstępu s).';
        spdStatus = 'warning';
      }
    } else {
      dcRecommendation = 'Typ 2 (T2) jest standardowo wystarczający na DC.';
    }

    if (parseFloat(distanceToPanels) > 10) {
      dcRecommendation += ' UWAGA: Ze względu na odległość > 10m, zaleca się SPD po obu stronach kabla DC (przy panelach i przy falowniku).';
    }

    // AC Side Analysis
    if (hasLPS === 'yes') {
      acRecommendation = 'Wymagany Typ 1+2 (T1+T2) na wejściu AC (budynek z odgromówką).';
    } else {
      acRecommendation = 'Typ 2 (T2) na wejściu AC (brak LPS).';
    }

    return { dcRecommendation, acRecommendation, spdStatus };
  };

  const results = calculate();

  return (
    <ScrollView>
      <Text style={styles.sectionHeader}>Dobór Ochrony Przeciwprzepięciowej (SPD)</Text>

      <Card style={styles.inputCard}>
        <Card.Content>
          <Text style={styles.label}>Czy budynek posiada instalację odgromową (LPS)?</Text>
          <SegmentedButtons
            value={hasLPS}
            onValueChange={setHasLPS}
            buttons={[
              { value: 'yes', label: 'TAK' },
              { value: 'no', label: 'NIE' },
            ]}
            style={styles.segmented}
            theme={{ colors: { secondaryContainer: '#F59E0B', onSecondaryContainer: '#000000', outline: '#444444' } }}
          />

          {hasLPS === 'yes' && (
            <>
              <Text style={styles.label}>Czy zachowano bezpieczny odstęp separacyjny (s)?</Text>
              <SegmentedButtons
                value={separationDistance}
                onValueChange={setSeparationDistance}
                buttons={[
                  { value: 'yes', label: 'TAK (s zachowane)' },
                  { value: 'no', label: 'NIE (brak s)' },
                ]}
                style={styles.segmented}
                theme={{ colors: { secondaryContainer: '#EF4444', onSecondaryContainer: '#FFFFFF', outline: '#444444' } }}
              />
            </>
          )}

          <CustomInput
            label="Długość trasy kablowej DC (od paneli do falownika)"
            value={distanceToPanels}
            onChangeText={setDistanceToPanels}
            unit="m"
            helperText="Jeśli > 10m, wymagane dwa zestawy SPD DC."
          />
        </Card.Content>
      </Card>

      <ResultCard title="Rekomendacja Ograniczników SPD" status={results.spdStatus}>
        <View style={styles.resultRow}>
          <Zap size={20} color="#F59E0B" />
          <Text style={styles.resultTitle}>Strona DC (PV):</Text>
        </View>
        <Text style={styles.resultText}>{results.dcRecommendation}</Text>

        <View style={[styles.resultRow, { marginTop: 16 }]}>
          <ShieldCheck size={20} color="#38BDF8" />
          <Text style={styles.resultTitle}>Strona AC (Sieć):</Text>
        </View>
        <Text style={styles.resultText}>{results.acRecommendation}</Text>
      </ResultCard>

      <Card style={styles.infoBox}>
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Info size={18} color="#38BDF8" />
            <Text style={{ color: '#38BDF8', fontWeight: 'bold', marginLeft: 8 }}>Wytyczne normy</Text>
          </View>
          <Text style={{ color: '#A0A0A0', fontSize: 12, lineHeight: 16 }}>
            Zgodnie z CLC/TS 50539-12 oraz PN-HD 60364-7-712:2016, dobór SPD zależy od poziomu ryzyka LPL oraz fizycznego połączenia konstrukcji PV z instalacją odgromową.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#F59E0B', marginTop: 12, marginBottom: 8, textTransform: 'uppercase' },
  label: { color: '#E0E0E0', fontSize: 13, marginTop: 12, marginBottom: 6 },
  segmented: { marginBottom: 12, backgroundColor: '#1E1E1E' },
  inputCard: { backgroundColor: '#1A1A1A', marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333333' },
  resultRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  resultTitle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
  resultText: { color: '#A0A0A0', fontSize: 14, lineHeight: 20, marginLeft: 28 },
  infoBox: { backgroundColor: '#1A1A1A', borderLeftWidth: 4, borderLeftColor: '#38BDF8', marginTop: 12, borderRadius: 8 },
});
