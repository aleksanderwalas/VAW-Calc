import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { SliderInput } from '../Common/SliderInput';
import { YieldChart } from './YieldChart';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { Zap, TrendingUp, DollarSign } from 'lucide-react-native';

export const YieldCalc = () => {
  const [powerWp, setPowerWp] = useState('10000'); // 10 kWp
  const [insolation, setInsolation] = useState('1000'); // kWh/m²/rok
  const [systemLosses, setSystemLosses] = useState('14'); // % strat
  const [electricityPrice, setElectricityPrice] = useState('1.15'); // PLN/kWh

  // Obliczenia w czasie rzeczywistym
  const pWp = parseFloat(powerWp) || 10000;
  const insol = parseFloat(insolation) || 1000;
  const losses = parseFloat(systemLosses) || 14;
  const price = parseFloat(electricityPrice) || 1.15;

  const kWp = pWp / 1000;
  const specificYield = insol * (1 - losses / 100);
  const annualProduction = kWp * specificYield;

  const monthlyAverage = annualProduction / 12;
  const summerMonthsProduction = annualProduction * 0.70;
  const winterMonthsProduction = annualProduction * 0.30;
  const annualSavings = annualProduction * price;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <TrendingUp size={20} color="#F59E0B" />
        <Text style={styles.sectionHeader}>Interaktywny Kalkulator Produkcji i zysków PV</Text>
      </View>
      <Text style={styles.subtitle}>Przesuwaj suwaki, aby natychmiast zobaczyć wpływ parametrów na produkcję energii i oszczędności.</Text>

      <Card style={styles.card}>
        <Card.Content>
          <SliderInput
            label="Moc zainstalowana generatora PV"
            value={powerWp}
            min={1000}
            max={50000}
            step={500}
            onValueChange={setPowerWp}
            unit="Wp"
          />

          <SliderInput
            label="Średnie roczne nasłonecznienie"
            value={insolation}
            min={800}
            max={1300}
            step={10}
            onValueChange={setInsolation}
            unit="kWh/m²"
          />

          <SliderInput
            label="Szacowane straty systemowe (PR)"
            value={systemLosses}
            min={5}
            max={30}
            step={1}
            onValueChange={setSystemLosses}
            unit="%"
          />

          <SliderInput
            label="Szacowana cena energii elektrycznej"
            value={electricityPrice}
            min={0.50}
            max={3.00}
            step={0.05}
            onValueChange={setElectricityPrice}
            unit="PLN/kWh"
          />
        </Card.Content>
      </Card>

      {/* Dynamiczny Wykres */}
      <YieldChart annualProduction={annualProduction.toFixed(0)} />

      {/* Wyniki w czasie rzeczywistym */}
      <ResultCard
        title="Bilans Energetyczny i Finansowy"
        status="success"
        statusMessage="Wartości aktualizowane dynamicznie w czasie rzeczywistym."
      >
        <ResultRow label="Szacowana roczna produkcja" value={annualProduction.toFixed(0)} unit="kWh/rok" isHighlight isSuccess />
        <ResultRow label="Specyficzny uzysk (Specific Yield)" value={specificYield.toFixed(1)} unit="kWh/kWp" isHighlight />
        <ResultRow label="Średnia miesięczna produkcja" value={monthlyAverage.toFixed(0)} unit="kWh/mies." />
        <ResultRow label="Produkcja letnia (IV-IX)" value={summerMonthsProduction.toFixed(0)} unit="kWh" />
        <ResultRow label="Produkcja zimowa (X-III)" value={winterMonthsProduction.toFixed(0)} unit="kWh" />
        <ResultRow label="Szacowana roczna oszczędność" value={annualSavings.toFixed(2)} unit="PLN" isHighlight isSuccess />
      </ResultCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 12,
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 12,
  },
});
