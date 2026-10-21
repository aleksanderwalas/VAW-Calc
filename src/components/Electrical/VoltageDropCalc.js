import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, HelperText } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';

export const VoltageDropCalc = () => {
  const [systemType, setSystemType] = useState('3p'); // '1p' | '3p' | 'dc'
  const [voltage, setVoltage] = useState('400'); // V
  const [powerKw, setPowerKw] = useState('15'); // kW
  const [length, setLength] = useState('40'); // m
  const [crossSection, setCrossSection] = useState('6'); // mm2
  const [cosPhi, setCosPhi] = useState('0.95');
  const [material, setMaterial] = useState('cu'); // 'cu' | 'al'

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const u = parseFloat(voltage);
    const p = parseFloat(powerKw) * 1000; // in Watts
    const l = parseFloat(length);
    const s = parseFloat(crossSection);
    const pf = parseFloat(cosPhi);

    if (isNaN(u) || isNaN(p) || isNaN(l) || isNaN(s) || isNaN(pf) || u <= 0 || s <= 0 || pf <= 0) {
      setError('Wprowadź poprawne parametry instalacji.');
      return;
    }

    // Conductivity gamma (m / (Ω·mm²)) at operating temp ~70°C:
    // Cu: ~45 m/(Ω·mm²)
    // Al: ~28 m/(Ω·mm²)
    const gamma = material === 'cu' ? 45.0 : 28.0;

    let deltaU = 0;
    let current = 0;

    if (systemType === '1p') {
      // 1-phase AC: I = P / (U * cosPhi)
      current = p / (u * pf);
      // ΔU = (2 * P * L) / (gamma * S * U)
      deltaU = (2 * p * l) / (gamma * s * u);
    } else if (systemType === '3p') {
      // 3-phase AC: I = P / (√3 * U * cosPhi)
      current = p / (Math.sqrt(3) * u * pf);
      // ΔU = (P * L) / (gamma * S * U)
      deltaU = (p * l) / (gamma * s * u);
    } else {
      // DC: I = P / U
      current = p / u;
      // ΔU = (2 * P * L) / (gamma * S * U)
      deltaU = (2 * p * l) / (gamma * s * u);
    }

    const deltaUPercent = (deltaU / u) * 100;

    let status = 'success';
    let statusMsg = 'Spadek napięcia zgodny z normą PN-HD 60364-5-52 (< 3% dla oświetlenia, < 5% dla odbiorników).';

    if (deltaUPercent > 5.0) {
      status = 'danger';
      statusMsg = 'Krytyczny spadek napięcia (> 5%). Norma przekroczona! Należy zwiększyć przekrój kabla.';
    } else if (deltaUPercent > 3.0) {
      status = 'warning';
      statusMsg = 'Spadek napięcia pomiędzy 3% a 5%. Dopuszczalny dla obwodów siłowych, niedopuszczalny dla oświetlenia.';
    }

    setResults({
      current: current.toFixed(2),
      deltaU: deltaU.toFixed(2),
      deltaUPercent: deltaUPercent.toFixed(2),
      status,
      statusMsg,
    });
  };

  const handleSystemChange = (type) => {
    setSystemType(type);
    if (type === '1p') setVoltage('230');
    if (type === '3p') setVoltage('400');
    if (type === 'dc') setVoltage('48');
  };

  return (
    <View>
      <Text style={styles.sectionHeader}>Typ Układu Zasilania</Text>
      <SegmentedButtons
        value={systemType}
        onValueChange={handleSystemChange}
        buttons={[
          { value: '3p', label: '3-Fazowy (400V)' },
          { value: '1p', label: '1-Fazowy (230V)' },
          { value: 'dc', label: 'Stały (DC)' },
        ]}
        style={styles.segmented}
        theme={{
          colors: {
            secondaryContainer: '#38BDF8',
            onSecondaryContainer: '#000000',
            outline: '#444444',
          },
        }}
      />

      <CustomInput label="Napięcie znamionowe" value={voltage} onChangeText={setVoltage} unit="V" />
      <CustomInput label="Moc odbiornika (czynna)" value={powerKw} onChangeText={setPowerKw} unit="kW" />
      <CustomInput label="Współczynnik mocy (cos φ)" value={cosPhi} onChangeText={setCosPhi} disabled={systemType === 'dc'} />
      <CustomInput label="Długość trasy kablowej" value={length} onChangeText={setLength} unit="m" />

      <Text style={styles.label}>Materiał przewodnika:</Text>
      <SegmentedButtons
        value={material}
        onValueChange={setMaterial}
        buttons={[
          { value: 'cu', label: 'Miedź (Cu)' },
          { value: 'al', label: 'Aluminium (Al)' },
        ]}
        style={styles.segmented}
        theme={{
          colors: {
            secondaryContainer: '#38BDF8',
            onSecondaryContainer: '#000000',
            outline: '#444444',
          },
        }}
      />

      <Text style={styles.label}>Przekrój żyły (mm²):</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        <SegmentedButtons
          value={crossSection}
          onValueChange={setCrossSection}
          buttons={[
            { value: '1.5', label: '1.5' },
            { value: '2.5', label: '2.5' },
            { value: '4', label: '4' },
            { value: '6', label: '6' },
            { value: '10', label: '10' },
            { value: '16', label: '16' },
            { value: '25', label: '25' },
            { value: '35', label: '35' },
            { value: '50', label: '50' },
          ]}
          theme={{
            colors: {
              secondaryContainer: '#38BDF8',
              onSecondaryContainer: '#000000',
              outline: '#444444',
            },
          }}
        />
      </ScrollView>

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={calculate} style={styles.button} labelStyle={styles.buttonText}>
        Oblicz Spadek Napięcia
      </Button>

      {results && (
        <ResultCard
          title="Wyniki Obliczeń Spadku Napięcia"
          status={results.status}
          statusMessage={results.statusMsg}
        >
          <ResultRow label="Względny spadek napięcia (ΔU %)" value={results.deltaUPercent} unit="%" isHighlight />
          <ResultRow label="Bezwzględny spadek napięcia (ΔU)" value={results.deltaU} unit="V" />
          <ResultRow label="Prąd obciążenia (Ib)" value={results.current} unit="A" isHighlight />
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
  label: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
  },
  segmented: {
    marginBottom: 12,
    backgroundColor: '#1E1E1E',
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
