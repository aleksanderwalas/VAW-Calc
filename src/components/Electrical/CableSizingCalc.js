import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, Card, HelperText } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { Cable, Zap, ShieldCheck, Activity } from 'lucide-react-native';

export const CableSizingCalc = () => {
  const [powerKw, setPowerKw] = useState('11'); // kW
  const [voltage, setVoltage] = useState('400'); // V (230 or 400)
  const [phases, setPhases] = useState('3'); // '1' or '3'
  const [cosPhi, setCosPhi] = useState('0.95');
  const [length, setLength] = useState('25'); // m
  const [material, setMaterial] = useState('cu'); // 'cu' | 'al'
  const [installationMethod, setInstallationMethod] = useState('wall'); // 'wall' (w tynku/na ścianie), 'ground' (w ziemi), 'pipe' (w rurze)
  const [ambientTemp, setAmbientTemp] = useState('30'); // °C

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Standardowe przekroje żył (mm²)
  const standardSections = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

  // Przybliżona obciążalność długotrwała dla Cu (wartości referencyjne w Amperach dla Method C - na ścianie)
  const baseAmpacityCu = {
    1.5: 18.5, 2.5: 25, 4: 34, 6: 43, 10: 60, 16: 80, 25: 105, 35: 135,
    50: 168, 70: 213, 95: 258, 120: 299, 150: 344, 185: 392, 240: 461
  };

  // Rezystywność w 70°C [Ω·mm²/m]
  const resistivity = material === 'cu' ? 0.0225 : 0.036;

  const calculate = () => {
    setError('');
    const p = parseFloat(powerKw) * 1000; // W
    const u = parseFloat(voltage);
    const l = parseFloat(length);
    const cp = parseFloat(cosPhi) || 1.0;
    const is3Phase = phases === '3';

    if (isNaN(p) || isNaN(u) || isNaN(l) || p <= 0 || l <= 0) {
      setError('Wprowadź poprawne parametry obwodu.');
      return;
    }

    // Obliczenie prądu roboczego Ib [A]
    let ib = 0;
    if (is3Phase) {
      ib = p / (Math.sqrt(3) * u * cp);
    } else {
      ib = p / (u * cp);
    }

    // Współczynniki korekcyjne (np. temperatura, ułożenie)
    let tempFactor = 1.0;
    const tAmb = parseFloat(ambientTemp) || 30;
    if (tAmb > 30) {
      // Uproszczony współczynnik temperatury dla izolacji PVC/XLPE
      tempFactor = Math.max(0.7, 1 - (tAmb - 30) * 0.05);
    }

    let methodFactor = 1.0;
    if (installationMethod === 'pipe') methodFactor = 0.85;
    if (installationMethod === 'ground') methodFactor = 0.90; // zależnie od gruntu

    const totalCorrectionFactor = tempFactor * methodFactor;

    // Dobór minimalnego przekroju ze względu na obciążalność długotrwałą (Iz >= Ib / K)
    const requiredIz = ib / totalCorrectionFactor;

    let selectedSection = standardSections[standardSections.length - 1];
    let selectedIz = 0;

    for (const s of standardSections) {
      const baseIz = (baseAmpacityCu[s] || (s * 10)) * (material === 'al' ? 0.78 : 1.0);
      const effectiveIz = baseIz * totalCorrectionFactor;
      if (effectiveIz >= ib) {
        selectedSection = s;
        selectedIz = effectiveIz;
        break;
      }
    }

    // Teraz sprawdzamy spadek napięcia ΔU dla dobranego przekroju (oraz wyższych w razie potrzeby)
    // ΔU = (2 * L * I * rho * cosPhi) / S dla 1-fazy lub (sqrt(3) * L * I * rho * cosPhi) / S dla 3-faz
    let deltaU = 0;
    if (is3Phase) {
      deltaU = (Math.sqrt(3) * l * ib * resistivity * cp) / selectedSection;
    } else {
      deltaU = (2 * l * ib * resistivity) / selectedSection;
    }

    const deltaUPercent = (deltaU / u) * 100;

    // Jeśli spadek napięcia przekracza 3% (lub 1% dla oświetlenia), możemy zaproponować większy przekrój
    let finalSection = selectedSection;
    let finalDeltaUPercent = deltaUPercent;
    let finalDeltaU = deltaU;

    const maxAllowedDrop = 3.0; // standard dla siły/gniazd
    while (finalDeltaUPercent > maxAllowedDrop) {
      const nextIdx = standardSections.indexOf(finalSection) + 1;
      if (nextIdx < standardSections.length) {
        finalSection = standardSections[nextIdx];
        if (is3Phase) {
          finalDeltaU = (Math.sqrt(3) * l * ib * resistivity * cp) / finalSection;
        } else {
          finalDeltaU = (2 * l * ib * resistivity) / finalSection;
        }
        finalDeltaUPercent = (finalDeltaU / u) * 100;
      } else {
        break;
      }
    }

    let status = 'success';
    let statusMsg = `Dobrano przewód ${material === 'cu' ? 'Cu' : 'Al'} ${finalSection} mm². Spełnia wymagania obciążalności i spadku napięcia (< 3.0%).`;

    if (finalDeltaUPercent > 3.0) {
      status = 'warning';
      statusMsg = `Uwaga: Spadek napięcia wynosi ${finalDeltaUPercent.toFixed(2)}% (powyżej zalecanych 3% dla długich linii). Rozważ jeszcze grubszy kabel.`;
    }

    setResults({
      ib: ib.toFixed(1),
      requiredIz: requiredIz.toFixed(1),
      selectedSection: finalSection,
      deltaU: finalDeltaU.toFixed(2),
      deltaUPercent: finalDeltaUPercent.toFixed(2),
      status,
      statusMsg,
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Cable size={20} color="#38BDF8" />
            <Text style={styles.cardHeader}>Parametry Obwodu i Zasilania AC</Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Moc zapotrzebowana" value={powerKw} onChangeText={setPowerKw} unit="kW" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Długość linii (w jedną str.)" value={length} onChangeText={setLength} unit="m" />
            </View>
          </View>

          <Text style={styles.label}>Układ sieci:</Text>
          <SegmentedButtons
            value={phases}
            onValueChange={setPhases}
            buttons={[
              { value: '1', label: '1-faz. (230V)', labelStyle: { fontSize: 11 } },
              { value: '3', label: '3-faz. (400V)', labelStyle: { fontSize: 11 } },
            ]}
            style={styles.segmented}
            density="high"
            theme={{ colors: { secondaryContainer: '#38BDF8', onSecondaryContainer: '#000000', outline: '#444444' } }}
          />

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Współczynnik mocy cos φ" value={cosPhi} onChangeText={setCosPhi} />
            </View>
            <View style={styles.col}>
              <CustomInput label="Temp. otoczenia" value={ambientTemp} onChangeText={setAmbientTemp} unit="°C" />
            </View>
          </View>

          <Text style={styles.label}>Materiał żyły:</Text>
          <SegmentedButtons
            value={material}
            onValueChange={setMaterial}
            buttons={[
              { value: 'cu', label: 'Miedź (Cu)', labelStyle: { fontSize: 11 } },
              { value: 'al', label: 'Alum. (Al)', labelStyle: { fontSize: 11 } },
            ]}
            style={styles.segmented}
            density="high"
            theme={{ colors: { secondaryContainer: '#38BDF8', onSecondaryContainer: '#000000', outline: '#444444' } }}
          />

          <Text style={styles.label}>Sposób ułożenia przewodu:</Text>
          <SegmentedButtons
            value={installationMethod}
            onValueChange={setInstallationMethod}
            buttons={[
              { value: 'wall', label: 'W tynku', labelStyle: { fontSize: 10 } },
              { value: 'pipe', label: 'W rurze', labelStyle: { fontSize: 10 } },
              { value: 'ground', label: 'W ziemi', labelStyle: { fontSize: 10 } },
            ]}
            style={styles.segmented}
            density="high"
            theme={{ colors: { secondaryContainer: '#38BDF8', onSecondaryContainer: '#000000', outline: '#444444' } }}
          />
        </Card.Content>
      </Card>

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={calculate} style={styles.button} labelStyle={styles.buttonText}>
        Dobierz Przekrój Kabla AC
      </Button>

      {results && (
        <ResultCard title="Wynik Doboru Przewodu AC" status={results.status} statusMessage={results.statusMsg}>
          <ResultRow label="Prąd roboczy obwodu (Ib)" value={results.ib} unit="A" />
          <ResultRow label="Wymagana obciążalność (Iz)" value={results.requiredIz} unit="A" />
          <ResultRow label="Zalecany minimalny przekrój żył" value={results.selectedSection} unit="mm²" isHighlight />
          <ResultRow label="Spadek napięcia (ΔU)" value={results.deltaU} unit="V" />
          <ResultRow label="Względny spadek napięcia (ΔU%)" value={results.deltaUPercent} unit="%" isHighlight />
        </ResultCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 12 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#38BDF8', marginLeft: 8 },
  label: { color: '#A0A0A0', fontSize: 13, marginTop: 8, marginBottom: 4 },
  segmented: { marginBottom: 12, backgroundColor: '#121212' },
  twoCol: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  col: { flex: 1 },
  button: { backgroundColor: '#38BDF8', marginTop: 10, marginBottom: 16, paddingVertical: 4 },
  buttonText: { color: '#000000', fontWeight: 'bold', fontSize: 16 },
});
