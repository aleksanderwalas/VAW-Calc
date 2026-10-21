import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, HelperText, Card } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';

export const PowerBalanceCalc = () => {
  const [installedPower, setInstalledPower] = useState('24'); // kW (moc zainstalowana Pi)
  const [simultaneityFactor, setSimultaneityFactor] = useState('0.6'); // kj (współczynnik jednoczesności 0.4 - 0.8)
  const [cosPhi, setCosPhi] = useState('0.95');
  const [voltage, setVoltage] = useState('400'); // 3-fazowe

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const standardMainBreakers = [16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160];

  const calculate = () => {
    setError('');
    const pi = parseFloat(installedPower);
    const kj = parseFloat(simultaneityFactor);
    const pf = parseFloat(cosPhi);
    const u = parseFloat(voltage);

    if (isNaN(pi) || isNaN(kj) || isNaN(pf) || isNaN(u) || pi <= 0 || kj <= 0 || pf <= 0) {
      setError('Wprowadź poprawne parametry mocy i współczynników.');
      return;
    }

    // Moc szczytowa / zapotrzebowana Pz = Pi * kj
    const pz = pi * kj;

    // Moc pozorna szczytowa Sz = Pz / cos(phi)
    const sz = pz / pf;

    // Prąd obliczeniowy 3-fazowy: Ib = (Pz * 1000) / (sqrt(3) * U * cos(phi))
    const ib = (pz * 1000) / (Math.sqrt(3) * u * pf);

    // Dobór zabezpieczenia głównego przedlicznikowego: In >= Ib
    let selectedBreaker = standardMainBreakers.find(b => b >= ib) || standardMainBreakers[standardMainBreakers.length - 1];

    setResults({
      pz: pz.toFixed(2),
      sz: sz.toFixed(2),
      ib: ib.toFixed(1),
      selectedBreaker,
    });
  };

  return (
    <ScrollView>
      <Text style={styles.sectionHeader}>Bilans Mocy i Dobór Przyłącza (SEP / PN-IEC 60364)</Text>

      <CustomInput
        label="Moc zainstalowana odbiorników (Pi)"
        value={installedPower}
        onChangeText={setInstalledPower}
        unit="kW"
        helperText="Suma mocy znamionowej wszystkich urządzeń w budynku"
      />
      <CustomInput
        label="Współczynnik jednoczesności (kj)"
        value={simultaneityFactor}
        onChangeText={setSimultaneityFactor}
        helperText="Zazwyczaj 0.5 - 0.7 dla domów jednorodzinnych"
      />
      <CustomInput label="Współczynnik mocy (cos φ)" value={cosPhi} onChangeText={setCosPhi} />
      <CustomInput label="Napięcie sieciowe (Un)" value={voltage} onChangeText={setVoltage} unit="V" />

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={calculate} style={styles.button} labelStyle={styles.buttonText}>
        Oblicz Moc Szczytową i Przyłącze
      </Button>

      {results && (
        <ResultCard
          title="Wyniki Bilansu Mocy i Doboru Zabezpieczenia"
          status="success"
          statusMessage="Obliczenia zgodne ze standardem wyznaczania mocy zapotrzebowanej dla budynków mieszkalnych."
        >
          <ResultRow label="Moc szczytowa / zapotrzebowana (Pz)" value={results.pz} unit="kW" isHighlight isSuccess />
          <ResultRow label="Moc pozorna zapotrzebowana (Sz)" value={results.sz} unit="kVA" />
          <ResultRow label="Obliczeniowy prąd szczytowy (Ib)" value={results.ib} unit="A" isHighlight />
          <ResultRow
            label="Zalecany bezpiecznik przedlicznikowy (In)"
            value={results.selectedBreaker}
            unit="A"
            isHighlight
            isSuccess
          />
        </ResultCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#38BDF8', marginTop: 12, marginBottom: 8, textTransform: 'uppercase' },
  button: { backgroundColor: '#38BDF8', marginTop: 16, marginBottom: 8, paddingVertical: 4 },
  buttonText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
});
