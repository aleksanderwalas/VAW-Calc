import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';

export const ReactivePowerCalc = () => {
  const [activePower, setActivePower] = useState('50'); // kW
  const [currentCosPhi, setCurrentCosPhi] = useState('0.75');
  const [targetCosPhi, setTargetCosPhi] = useState('0.95');
  const [voltage, setVoltage] = useState('400'); // V

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const p = parseFloat(activePower);
    const cos1 = parseFloat(currentCosPhi);
    const cos2 = parseFloat(targetCosPhi);
    const u = parseFloat(voltage);

    if (isNaN(p) || isNaN(cos1) || isNaN(cos2) || isNaN(u) || p <= 0 || cos1 <= 0 || cos2 <= 0 || cos1 >= 1 || cos2 > 1) {
      setError('Wprowadź poprawne parametry (0 < cos φ ≤ 1).');
      return;
    }

    if (cos1 >= cos2) {
      setError('Współczynnik docelowy musi być wyższy od aktualnego.');
      return;
    }

    // tan(phi1) and tan(phi2)
    const sin1 = Math.sqrt(1 - Math.pow(cos1, 2));
    const tan1 = sin1 / cos1;

    const sin2 = Math.sqrt(1 - Math.pow(cos2, 2));
    const tan2 = sin2 / cos2;

    // Qc = P * (tan(phi1) - tan(phi2)) in kvar
    const qc = p * (tan1 - tan2);

    // Initial total power S1 and final total power S2
    const s1 = p / cos1; // kVA
    const s2 = p / cos2; // kVA
    const deltaS = s1 - s2; // reduction in apparent power

    // Current reduction: I1 - I2 (3-phase)
    const i1 = (p * 1000) / (Math.sqrt(3) * u * cos1);
    const i2 = (p * 1000) / (Math.sqrt(3) * u * cos2);
    const deltaI = i1 - i2;

    setResults({
      qc: qc.toFixed(2),
      tan1: tan1.toFixed(3),
      tan2: tan2.toFixed(3),
      s1: s1.toFixed(1),
      s2: s2.toFixed(1),
      deltaS: deltaS.toFixed(1),
      i1: i1.toFixed(1),
      i2: i2.toFixed(1),
      deltaI: deltaI.toFixed(1),
    });
  };

  return (
    <View>
      <Text style={styles.sectionHeader}>Parametry Obciążenia i Współczynnika Mocy</Text>
      <CustomInput label="Moc czynna odbiorników (P)" value={activePower} onChangeText={setActivePower} unit="kW" />
      <CustomInput label="Aktualny cos φ (przed kompensacją)" value={currentCosPhi} onChangeText={setCurrentCosPhi} />
      <CustomInput label="Wymagany cos φ (docelowy)" value={targetCosPhi} onChangeText={setTargetCosPhi} />
      <CustomInput label="Napięcie sieciowe (Un)" value={voltage} onChangeText={setVoltage} unit="V" />

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={calculate} style={styles.button} labelStyle={styles.buttonText}>
        Oblicz Wymaganą Moc Baterii Kondensatorów
      </Button>

      {results && (
        <ResultCard
          title="Wynik Doboru Kompensacji Mocy Biernej"
          status="success"
          statusMessage="Kompensacja pozwala uniknąć opłat za pobór ponadumownej energii biernej indukcyjnej."
        >
          <ResultRow label="Wymagana moc baterii (Qc)" value={results.qc} unit="kvar" isHighlight isSuccess />
          <ResultRow label="Aktualna moc pozorna (S1)" value={results.s1} unit="kVA" />
          <ResultRow label="Moc pozorna po kompensacji (S2)" value={results.s2} unit="kVA" />
          <ResultRow label="Zmniejszenie mocy pozornej (ΔS)" value={results.deltaS} unit="kVA" isHighlight />
          <ResultRow label="Prąd przed kompensacją (I1)" value={results.i1} unit="A" />
          <ResultRow label="Prąd po kompensacji (I2)" value={results.i2} unit="A" />
          <ResultRow label="Zmniejszenie prądu w linii (ΔI)" value={results.deltaI} unit="A" isHighlight />
        </ResultCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  button: {
    backgroundColor: '#38BDF8',
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 4,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
