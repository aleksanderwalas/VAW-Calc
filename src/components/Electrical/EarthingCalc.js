import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, HelperText } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';

export const EarthingCalc = () => {
  const [electrodeType, setElectrodeType] = useState('vertical'); // 'vertical' | 'horizontal'
  const [soilType, setSoilType] = useState('clay'); // 'garden' | 'clay' | 'sand_wet' | 'sand_dry' | 'custom'
  const [customRho, setCustomRho] = useState('100'); // Om*m
  const [length, setLength] = useState('6'); // m (długość szpilki lub otoku)
  const [depth, setDepth] = useState('0.8'); // m (zagłębienie)
  const [diameter, setDiameter] = useState('16'); // mm (średnica pręta)
  const [targetResistance, setTargetResistance] = useState('10'); // Om (np. 10 Om dla LPS / 30 Om dla stacji)

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const soilPresets = {
    garden: { name: 'Czarnoziem / Ziemia ogrodowa', rho: 40 },
    clay: { name: 'Glina / Ił wilgotny', rho: 70 },
    sand_wet: { name: 'Piasek wilgotny', rho: 200 },
    sand_dry: { name: 'Piasek suchy / Żwir', rho: 800 },
  };

  const calculate = () => {
    setError('');
    const l = parseFloat(length);
    const d = parseFloat(diameter) / 1000; // w metrach
    const h = parseFloat(depth);
    const target = parseFloat(targetResistance) || 10;

    let rho = soilType === 'custom' ? parseFloat(customRho) : soilPresets[soilType]?.rho;

    if (isNaN(l) || isNaN(d) || isNaN(rho) || l <= 0 || d <= 0 || rho <= 0) {
      setError('Wprowadź poprawne parametry geometryczne i rezystywność gruntu.');
      return;
    }

    let resistance = 0;
    let formulaName = '';

    if (electrodeType === 'vertical') {
      // Uziom pionowy (pręt / szpilka wbijana w ziemię o długości L i średnicy d)
      // Wzór normowy (Sundee / PN-EN 50522 / PN-HD 60364-5-54):
      // R = (rho / (2 * PI * L)) * (ln(4L / d))
      resistance = (rho / (2 * Math.PI * l)) * Math.log((4 * l) / d);
      formulaName = 'R = (ρ / (2·π·L)) · ln(4L / d)';
    } else {
      // Uziom poziomy (bednarka / otok na głębokości h o długości L i szerokości/średnicy d)
      // Wzór normowy:
      // R = (rho / (2 * PI * L)) * ln(2L^2 / (d * h))
      const effH = Math.max(0.3, h);
      resistance = (rho / (2 * Math.PI * l)) * Math.log((2 * Math.pow(l, 2)) / (d * effH));
      formulaName = 'R = (ρ / (2·π·L)) · ln(2L² / (d·h))';
    }

    const isTargetMet = resistance <= target;
    // Oszacowanie liczby dodatkowych szpilek dla uziomu pionowego przy równoległym łączeniu (z uwzględnieniem wsp. wykorzystania ~0.85)
    let rodsNeeded = 1;
    if (electrodeType === 'vertical' && !isTargetMet) {
      rodsNeeded = Math.ceil((resistance / target) * 1.18);
    }

    setResults({
      resistance: resistance.toFixed(2),
      isTargetMet,
      target,
      rho,
      formulaName,
      rodsNeeded,
    });
  };

  return (
    <View>
      <Text style={styles.sectionHeader}>Kalkulator Rezystancji Uziemień (PN-HD 60364-5-54 / PN-EN 62305)</Text>

      <Text style={styles.label}>Typ uziomu:</Text>
      <SegmentedButtons
        value={electrodeType}
        onValueChange={setElectrodeType}
        buttons={[
          { value: 'vertical', label: 'Pionowy (Szpilka)' },
          { value: 'horizontal', label: 'Poziomy (Bednarka)' },
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

      <Text style={styles.label}>Rodzaj i rezystywność gruntu (ρ):</Text>
      <SegmentedButtons
        value={soilType}
        onValueChange={setSoilType}
        buttons={[
          { value: 'garden', label: 'Czarnoziem (40)' },
          { value: 'clay', label: 'Glina (70)' },
          { value: 'sand_wet', label: 'Piasek m. (200)' },
          { value: 'sand_dry', label: 'Suchy (800)' },
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

      <CustomInput
        label="Długość uziomu (L)"
        value={length}
        onChangeText={setLength}
        unit="m"
        helperText={electrodeType === 'vertical' ? 'Głębokość pogrążenia szpilki w gruncie' : 'Łączna długość taśmy bednarki'}
      />
      <CustomInput
        label="Średnica pręta / szerokość bednarki"
        value={diameter}
        onChangeText={setDiameter}
        unit="mm"
      />
      {electrodeType === 'horizontal' && (
        <CustomInput
          label="Głębokość ułożenia bednarki (h)"
          value={depth}
          onChangeText={setDepth}
          unit="m"
          helperText="Zalecana głębokość przemarzania: 0.7 - 1.0 m"
        />
      )}
      <CustomInput
        label="Wymagana maksymalna rezystancja"
        value={targetResistance}
        onChangeText={setTargetResistance}
        unit="Ω"
        helperText="10 Ω dla odgromowej (LPS) i PV / 30 Ω dla instalacji elektroenergetycznej"
      />

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <Button mode="contained" onPress={calculate} style={styles.button} labelStyle={styles.buttonText}>
        Oblicz Rezystancję Uziemienia
      </Button>

      {results && (
        <ResultCard
          title="Wynik Rezystancji Uziemienia"
          status={results.isTargetMet ? 'success' : 'danger'}
          statusMessage={
            results.isTargetMet
              ? `Warunek spełniony: R ≤ ${results.target} Ω. Uziom zapewnia skuteczną ochronę.`
              : `Norma niespełniona (R > ${results.target} Ω). Wymagane pogrążenie głębsze lub dodanie kolejnych sond.`
          }
        >
          <ResultRow
            label="Obliczona rezystancja uziomu (R)"
            value={results.resistance}
            unit="Ω"
            isHighlight
            isSuccess={results.isTargetMet}
            isWarning={!results.isTargetMet}
          />
          <ResultRow label="Rezystywność przyjęta (ρ)" value={results.rho} unit="Ω·m" />
          <ResultRow label="Wymóg normatywny" value={`≤ ${results.target}`} unit="Ω" />
          <ResultRow label="Zastosowana formuła analityczna" value={results.formulaName} />
          {electrodeType === 'vertical' && !results.isTargetMet && (
            <ResultRow
              label="Szacowana liczba sond pionowych do celu"
              value={results.rodsNeeded}
              unit="szt."
              isHighlight
              isWarning
            />
          )}
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
    backgroundColor: '#1E1E1E',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#38BDF8',
    marginTop: 14,
    marginBottom: 8,
    paddingVertical: 4,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
