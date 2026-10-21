import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, SegmentedButtons, HelperText, Card } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { Cable, Zap, ShieldAlert, Activity } from 'lucide-react-native';

export const DCCableCalc = () => {
  const [stringVoltage, setStringVoltage] = useState('650'); // V
  const [stringCurrent, setStringCurrent] = useState('13.5'); // A
  const [cableLength, setCableLength] = useState('35'); // m (one way)
  const [crossSection, setCrossSection] = useState('4'); // mm2
  const [material, setMaterial] = useState('cu'); // 'cu' | 'al'

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    const u = parseFloat(stringVoltage);
    const i = parseFloat(stringCurrent);
    const l = parseFloat(cableLength);
    const s = parseFloat(crossSection);

    if (isNaN(u) || isNaN(i) || isNaN(l) || isNaN(s) || u <= 0 || s <= 0) {
      setError('Wprowadź poprawne parametry instalacji.');
      return;
    }

    // Specific resistance at standard working temp (e.g. 70°C for solar cables):
    // Cu at 70°C: ~0.0215 Ω·mm²/m
    // Al at 70°C: ~0.035 Ω·mm²/m
    const rho = material === 'cu' ? 0.0215 : 0.035;

    // Total length for DC circuit is 2 * L (+ and - conductors)
    const resistance = (rho * 2 * l) / s;
    const deltaU = resistance * i; // Voltage drop in Volts
    const deltaUPercent = (deltaU / u) * 100; // Voltage drop in %

    const powerLossWatts = deltaU * i;
    const powerLossPercent = (powerLossWatts / (u * i)) * 100;

    let status = 'success';
    let statusMsg = 'Spadek napięcia DC mieści się w normie (< 1.0% zalecane dla PV wg standardów SEP / IEC).';

    if (deltaUPercent > 1.5) {
      status = 'danger';
      statusMsg = 'Przekroczono dopuszczalny spadek napięcia (> 1.5%). Zwiększ przekrój przewodu!';
    } else if (deltaUPercent > 1.0) {
      status = 'warning';
      statusMsg = 'Spadek napięcia powyżej 1.0%. Rozważ większy przekrój aby ograniczyć straty energii.';
    }

    setResults({
      deltaU: deltaU.toFixed(2),
      deltaUPercent: deltaUPercent.toFixed(2),
      powerLossWatts: powerLossWatts.toFixed(1),
      powerLossPercent: powerLossPercent.toFixed(2),
      resistance: resistance.toFixed(3),
      status,
      statusMsg,
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Cable size={20} color="#F59E0B" />
            <Text style={styles.cardHeader}>Parametry Obwodu DC</Text>
          </View>

          <CustomInput
            label="Napięcie robocze łańcucha (Vmp)"
            value={stringVoltage}
            onChangeText={setStringVoltage}
            unit="V"
          />
          <CustomInput
            label="Prąd roboczy łańcucha (Imp)"
            value={stringCurrent}
            onChangeText={setStringCurrent}
            unit="A"
          />
          <CustomInput
            label="Długość trasy kablowej (w jedną stronę)"
            value={cableLength}
            onChangeText={setCableLength}
            unit="m"
            helperText="Długość przewodu od modułów do falownika"
          />

          <Text style={styles.label}>Materiał żyły:</Text>
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
                secondaryContainer: '#F59E0B',
                onSecondaryContainer: '#000000',
                outline: '#444444',
              },
            }}
          />

          <Text style={styles.label}>Przekrój przewodu:</Text>
          <SegmentedButtons
            value={crossSection}
            onValueChange={setCrossSection}
            buttons={[
              { value: '4', label: '4 mm²' },
              { value: '6', label: '6 mm²' },
              { value: '10', label: '10 mm²' },
              { value: '16', label: '16 mm²' },
            ]}
            style={styles.segmented}
            theme={{
              colors: {
                secondaryContainer: '#F59E0B',
                onSecondaryContainer: '#000000',
                outline: '#444444',
              },
            }}
          />
        </Card.Content>
      </Card>

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={calculate}
        style={styles.button}
        labelStyle={styles.buttonText}
        icon={() => <Activity size={20} color="#000000" />}
      >
        Oblicz Straty DC
      </Button>

      {results && (
        <ResultCard
          title="Wyniki Spadku Napięcia DC"
          status={results.status}
          statusMessage={results.statusMsg}
        >
          <ResultRow label="Względny spadek napięcia (ΔU %)" value={results.deltaUPercent} unit="%" isHighlight />
          <ResultRow label="Bezwzględny spadek napięcia (ΔU)" value={results.deltaU} unit="V" />
          <ResultRow label="Straty mocy na kablu" value={results.powerLossWatts} unit="W" isWarning={results.status !== 'success'} />
          <ResultRow label="Straty mocy względne" value={results.powerLossPercent} unit="%" />
          <ResultRow label="Rezystancja pętli kabla" value={results.resistance} unit="Ω" />
        </ResultCard>
      )}

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <ShieldAlert size={18} color="#38BDF8" />
            <Text style={styles.infoTitle}>Normy i zalecenia</Text>
          </View>
          <Text style={styles.infoText}>
            Zgodnie z normą PN-HD 60364-7-712 oraz wytycznymi SEP, spadek napięcia w obwodach DC nie powinien przekraczać 1.0% dla zapewnienia wysokiej sprawności instalacji.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 8,
  },
  label: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
  },
  segmented: {
    marginBottom: 12,
    backgroundColor: '#121212',
  },
  button: {
    backgroundColor: '#F59E0B',
    marginTop: 10,
    marginBottom: 16,
    paddingVertical: 4,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#1A1A1A',
    borderLeftWidth: 4,
    borderLeftColor: '#38BDF8',
    borderRadius: 8,
  },
  infoTitle: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  infoText: {
    color: '#A0A0A0',
    fontSize: 12,
    lineHeight: 18,
  }
});
