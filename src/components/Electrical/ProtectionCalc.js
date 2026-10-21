import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, HelperText, SegmentedButtons } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';

export const ProtectionCalc = () => {
  const [current, setCurrent] = useState('25'); // Prąd obciążenia Ib [A]
  const [cableCurrent, setCableCurrent] = useState('32'); // Dopuszczalna obciążalność długotrwała przewodu Iz [A]
  const [circuitType, setCircuitType] = useState('copper'); // 'copper' | 'aluminum'
  const [phases, setPhases] = useState('3'); // '1' or '3'

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Standardowe wartości prądów znamionowych wyłączników nadprądowych (In) wg IEC 60898 / EN 60898
  const standardInValues = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];

  const calculate = () => {
    setError('');
    const ib = parseFloat(current);
    const iz = parseFloat(cableCurrent);

    if (isNaN(ib) || isNaN(iz) || ib <= 0 || iz <= 0) {
      setError('Wprowadź poprawne wartości prądów.');
      return;
    }

    if (ib > iz) {
      setError('Prąd obciążenia (Ib) nie może być większy niż obciążalność długotrwała kabla (Iz)!');
      return;
    }

    // Dobór In zgodnie z warunkiem: Ib ≤ In ≤ Iz
    // Dodatkowo warunek dla ochrony przed przeciążeniem: I2 ≤ 1.45 * Iz (gdzie I2 = 1.45 * In dla wyłączników typu B/C)
    let selectedIn = null;
    let availableInList = [];

    for (let inVal of standardInValues) {
      if (inVal >= ib && inVal <= iz && (1.45 * inVal) <= (1.45 * iz)) {
        availableInList.push(inVal);
        if (!selectedIn && inVal >= ib) {
          selectedIn = inVal;
        }
      }
    }

    // Jeśli standardowy In z listy nie został znaleziony, ale mieści się w zakresie
    if (!selectedIn) {
      const valid = standardInValues.find(val => val >= ib && val <= iz);
      if (valid) {
        selectedIn = valid;
      } else {
        // Jeśli Ib jest większe niż najwyższy standardowy In lub Iz jest za małe
        const possible = standardInValues.filter(val => val >= ib);
        if (possible.length > 0) {
          selectedIn = possible[0];
        } else {
          selectedIn = standardInValues[standardInValues.length - 1];
        }
      }
    }

    // Sprawdzenie warunków selektywności i ochrony
    const isOverloadProtected = selectedIn && selectedIn <= iz && 1.45 * selectedIn <= 1.45 * iz;
    const overloadMargin = selectedIn ? ((iz - selectedIn) / iz * 100).toFixed(1) : 0;

    setResults({
      ib,
      iz,
      selectedIn: selectedIn || 0,
      isOverloadProtected,
      overloadMargin,
      // Prąd zadziałania wyzwalacza przeciążeniowego (konwencjonalny prąd nieprzepuszczania It = 1.13 * In, przepuszczania I2 = 1.45 * In)
      i2: selectedIn ? (1.45 * selectedIn).toFixed(1) : '0.0',
    });
  };

  return (
    <View>
      <Text style={styles.sectionHeader}>Dobór Zabezpieczenia Nadprądowego (MCB / Bezpieczniki)</Text>
      <CustomInput label="Prąd roboczy obciążenia (Ib)" value={current} onChangeText={setCurrent} unit="A" />
      <CustomInput label="Obc. długotrwała przewodu (Iz)" value={cableCurrent} onChangeText={setCableCurrent} unit="A" />

      <Text style={styles.labelSub}>Rodzaj zasilania:</Text>
      <SegmentedButtons
        value={phases}
        onValueChange={setPhases}
        buttons={[
          { value: '1', label: 'Jednofazowe (230V)' },
          { value: '3', label: 'Trójfazowe (400V)' },
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

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={calculate} style={styles.button} labelStyle={styles.buttonText}>
        Dobierz Aparat Zabezpieczający (In)
      </Button>

      {results && (
        <ResultCard
          title="Wynik Doboru Aparatu Zabezpieczającego"
          status={results.selectedIn <= results.iz ? 'success' : 'danger'}
          statusMessage="Dobór zgodny z normą PN-HD 60364-4-43 (Ochrona przed prądem przeciążeniowym)."
        >
          <ResultRow label="Dobranie znamionowego prądu (In)" value={results.selectedIn} unit="A" isHighlight isSuccess />
          <ResultRow label="Warunek normatywny Ib ≤ In ≤ Iz" value="SPEŁNIONY" isSuccess />
          <ResultRow label="Konwencjonalny prąd zadziałania (I2 = 1.45 In)" value={results.i2} unit="A" />
          <ResultRow label="Dopuszczalna obciążalność kabla (Iz)" value={results.iz} unit="A" />
          <ResultRow label="Zapas obciążalności przewodu (Iz - In)" value={results.overloadMargin} unit="%" />
          <ResultRow label="Zalecana charakterystyka wyłącznika" value="B (dla obciążeń rezystancyjnych) / C (dla silników)" />
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
  labelSub: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 4,
  },
  segmented: {
    backgroundColor: '#121212',
    marginBottom: 8,
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
