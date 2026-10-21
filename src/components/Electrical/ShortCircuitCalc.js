import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, HelperText } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';

export const ShortCircuitCalc = () => {
  const [transformerPower, setTransformerPower] = useState('400'); // kVA
  const [transformerUcc, setTransformerUcc] = useState('4.0'); // %
  const [voltage, setVoltage] = useState('400'); // V (ph-ph)
  const [cableLength, setCableLength] = useState('25'); // m
  const [cableCrossSection, setCableCrossSection] = useState('50'); // mm2

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const sTr = parseFloat(transformerPower) * 1000; // VA
    const ucc = parseFloat(transformerUcc) / 100;
    const un = parseFloat(voltage);
    const l = parseFloat(cableLength);
    const sCab = parseFloat(cableCrossSection);

    if (isNaN(sTr) || isNaN(ucc) || isNaN(un) || sTr <= 0 || ucc <= 0 || un <= 0) {
      setError('Wprowadź poprawne parametry transformatora.');
      return;
    }

    // Transformer impedance voltage drop: u_cc
    // Transformer internal impedance Z_tr = (ucc * U^2) / S_tr
    const zTr = (ucc * Math.pow(un, 2)) / sTr; // Ohms

    // Transformer short-circuit current Ik3_tr = Un / (√3 * Z_tr)
    const ik3Tr = un / (Math.sqrt(3) * zTr);

    // Cable impedance (Cu, resistivity ~0.018 Ω·mm²/m at working temp)
    // R_cab = (0.018 * L) / S
    const rCab = (0.018 * l) / sCab;
    const xCab = (0.08 * l) / 1000; // Approx reactance ~0.08 mΩ/m -> 0.00008 Ω/m * l = 0.00008 * l? Wait, 0.08 mΩ/m = 0.00008 Ω/m. Let's use 0.08 * 1e-3 * l
    const zCab = Math.sqrt(Math.pow(rCab, 2) + Math.pow(xCab, 2));

    // Total impedance at fault point
    // Assuming transformer resistance R_tr and X_tr from ucc (usually X >> R, or simplified Z_tr)
    // Let's estimate Z_total = Z_tr + Z_cab (simplified addition of magnitudes or real/imaginary)
    // For engineering estimation: Z_tr components R_tr ≈ 0.2 * Z_tr, X_tr ≈ 0.98 * Z_tr
    const xTr = zTr * 0.98;
    const rTr = zTr * 0.20;

    const rTotal = rTr + rCab;
    const xTotal = xTr + xCab;
    const zTotal = Math.sqrt(Math.pow(rTotal, 2) + Math.pow(xTotal, 2));

    const ik3Max = un / (Math.sqrt(3) * zTotal); // 3-phase short circuit current (kA -> A)
    const ik1Max = (1.5 * un) / (2 * zTotal + 0.01); // 1-phase short circuit current approx (phase-neutral)

    setResults({
      ik3Max: (ik3Max / 1000).toFixed(2), // kA
      ik1Max: (ik1Max / 1000).toFixed(2), // kA
      zTr: (zTr * 1000).toFixed(2), // mΩ
      zCab: (zCab * 1000).toFixed(2), // mΩ
      zTotal: (zTotal * 1000).toFixed(2), // mΩ
    });
  };

  return (
    <View>
      <Text style={styles.sectionHeader}>Parametry Transformatora Zasilającego</Text>
      <CustomInput label="Moc znamionowa transformatora" value={transformerPower} onChangeText={setTransformerPower} unit="kVA" />
      <CustomInput label="Napięcie zwarcia (ucc)" value={transformerUcc} onChangeText={setTransformerUcc} unit="%" />
      <CustomInput label="Napięcie międzyprzewodowe (Un)" value={voltage} onChangeText={setVoltage} unit="V" />

      <Text style={styles.sectionHeader}>Trasa Kablowa od Transformatora</Text>
      <CustomInput label="Długość kabla do rozdzielnicy" value={cableLength} onChangeText={setCableLength} unit="m" />
      <CustomInput label="Przekrój kabla Cu" value={cableCrossSection} onChangeText={setCableCrossSection} unit="mm²" />

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={calculate} style={styles.button} labelStyle={styles.buttonText}>
        Oblicz Prądy Zwarciowe
      </Button>

      {results && (
        <ResultCard
          title="Szacowane Prądy Zwarciowe (Węzeł)"
          status="success"
          statusMessage="Szacunek inżynieryjny na podstawie impedancji pętli i transformatora."
        >
          <ResultRow label="Prąd zwarcia trójfazowego (Ik3)" value={results.ik3Max} unit="kA" isHighlight />
          <ResultRow label="Prąd zwarcia jednofazowego (Ik1)" value={results.ik1Max} unit="kA" isHighlight />
          <ResultRow label="Impedancja transformatora (Ztr)" value={results.zTr} unit="mΩ" />
          <ResultRow label="Impedancja kabla (Zcab)" value={results.zCab} unit="mΩ" />
          <ResultRow label="Impedancja całkowita pętli (Ztotal)" value={results.zTotal} unit="mΩ" />
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
