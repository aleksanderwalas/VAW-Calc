import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, HelperText, Card } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';

export const SWZCalc = () => {
  const [voltageU0, setVoltageU0] = useState('230'); // V (faza-neutralny)
  const [breakerType, setBreakerType] = useState('B'); // B | C | D
  const [breakerIn, setBreakerIn] = useState('16'); // A
  const [loopImpedance, setLoopImpedance] = useState('1.2'); // Ω (Zs)
  const [systemType, setSystemType] = useState('TN'); // TN | TT

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const u0 = parseFloat(voltageU0);
    const inVal = parseFloat(breakerIn);
    const zs = parseFloat(loopImpedance);

    if (isNaN(u0) || isNaN(inVal) || isNaN(zs) || u0 <= 0 || inVal <= 0 || zs <= 0) {
      setError('Wprowadź poprawne parametry obwodu.');
      return;
    }

    // Maksymalne krotności prądu znamionowego In dla wyzwalacza zwarciowego (magnesowego):
    // Typ B: 3 do 5 In (przyjmujemy 5 dla max czasu)
    // Typ C: 5 do 10 In (przyjmujemy 10)
    // Typ D: 10 do 20 In (przyjmujemy 20)
    let kMultiplier = 5;
    if (breakerType === 'C') kMultiplier = 10;
    if (breakerType === 'D') kMultiplier = 20;

    const ia = inVal * kMultiplier; // Prąd powodujący samoczynne zadziałanie w wymaganym czasie (0.4s dla U0=230V)

    // Warunek SWZ: Zs * Ia <= U0  =>  Max Zs = U0 / Ia
    const maxZs = u0 / ia;
    const isSwzMet = zs <= maxZs;

    // Prąd zwarciowy jednofazowy Ik = U0 / Zs
    const ik = u0 / zs;

    setResults({
      ia: ia.toFixed(1),
      maxZs: maxZs.toFixed(2),
      zs: zs.toFixed(2),
      ik: ik.toFixed(1),
      isSwzMet,
      maxTime: '0.4 s',
    });
  };

  return (
    <ScrollView>
      <Text style={styles.sectionHeader}>Sprawdzenie Samoczynnego Wyłączenia Zasilania (SWZ)</Text>

      <CustomInput label="Napięcie fazowe (U0)" value={voltageU0} onChangeText={setVoltageU0} unit="V" />

      <Text style={styles.label}>Charakterystyka wyłącznika nadprądowego (MCB):</Text>
      <SegmentedButtons
        value={breakerType}
        onValueChange={setBreakerType}
        buttons={[
          { value: 'B', label: 'Typ B (5×In)' },
          { value: 'C', label: 'Typ C (10×In)' },
          { value: 'D', label: 'Typ D (20×In)' },
        ]}
        style={styles.segmented}
        theme={{ colors: { secondaryContainer: '#38BDF8', onSecondaryContainer: '#000000', outline: '#444444' } }}
      />

      <CustomInput label="Prąd znamionowy zabezpieczenia (In)" value={breakerIn} onChangeText={setBreakerIn} unit="A" />
      <CustomInput label="Zmierzona / obliczona impedancja pętli (Zs)" value={loopImpedance} onChangeText={setLoopImpedance} unit="Ω" />

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={calculate} style={styles.button} labelStyle={styles.buttonText}>
        Sprawdź Spełnienie Warunku SWZ
      </Button>

      {results && (
        <ResultCard
          title="Wynik Weryfikacji SWZ (PN-HD 60364-4-41)"
          status={results.isSwzMet ? 'success' : 'danger'}
          statusMessage={
            results.isSwzMet
              ? 'Warunek SWZ SPEŁNIONY. Zabezpieczenie wyłączy w wymaganym czasie (≤ 0.4s).'
              : 'NIESPEŁNIONY! Impedancja pętli jest za wysoka dla wyłączenia w wymaganym czasie.'
          }
        >
          <ResultRow
            label="Zmierzona impedancja pętli (Zs)"
            value={results.zs}
            unit="Ω"
            isHighlight
            isSuccess={results.isSwzMet}
            isWarning={!results.isSwzMet}
          />
          <ResultRow label="Dopuszczalna max impedancja pętli" value={results.maxZs} unit="Ω" isHighlight />
          <ResultRow label="Prąd zadziałania wyzwalacza (Ia)" value={results.ia} unit="A" />
          <ResultRow label="Spodziewany prąd zwarciowy (Ik)" value={results.ik} unit="A" isHighlight />
          <ResultRow label="Wymagany czas wyłączenia" value={results.maxTime} />
        </ResultCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#38BDF8', marginTop: 12, marginBottom: 8, textTransform: 'uppercase' },
  label: { color: '#A0A0A0', fontSize: 13, marginTop: 8, marginBottom: 4 },
  segmented: { marginBottom: 12, backgroundColor: '#1E1E1E' },
  button: { backgroundColor: '#38BDF8', marginTop: 16, marginBottom: 8, paddingVertical: 4 },
  buttonText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
});
