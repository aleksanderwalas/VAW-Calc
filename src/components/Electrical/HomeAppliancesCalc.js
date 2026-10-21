import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, Card, Chip, HelperText } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { Tv, Zap, ShieldAlert, Sparkles, DollarSign } from 'lucide-react-native';

const APPLIANCE_PRESETS = [
  { id: 'indukcja', name: 'Płyta indukcyjna (7.4 kW)', power: '7400', phases: '3', voltage: '400', cosPhi: '0.95' },
  { id: 'piekarnik', name: 'Piekarnik elektryczny (3.5 kW)', power: '3500', phases: '1', voltage: '230', cosPhi: '0.98' },
  { id: 'czajnik', name: 'Czajnik / Ekspres (2.2 kW)', power: '2200', phases: '1', voltage: '230', cosPhi: '1.0' },
  { id: 'pralka', name: 'Pralka / Zmywarka (2.0 kW)', power: '2000', phases: '1', voltage: '230', cosPhi: '0.95' },
  { id: 'wallbox', name: 'Ładowarka EV Wallbox (11 kW)', power: '11000', phases: '3', voltage: '400', cosPhi: '0.98' },
  { id: 'pompa', name: 'Pompa ciepła (6 kW)', power: '6000', phases: '3', voltage: '400', cosPhi: '0.92' },
  { id: 'klima', name: 'Klimatyzacja domowa (1.5 kW)', power: '1500', phases: '1', voltage: '230', cosPhi: '0.90' },
  { id: 'bojler', name: 'Bojler / Grzejnik (2.5 kW)', power: '2500', phases: '1', voltage: '230', cosPhi: '1.0' },
];

export const HomeAppliancesCalc = () => {
  const [selectedPreset, setSelectedPreset] = useState(APPLIANCE_PRESETS[0].id);

  const [powerWatts, setPowerWatts] = useState(APPLIANCE_PRESETS[0].power);
  const [phases, setPhases] = useState(APPLIANCE_PRESETS[0].phases);
  const [voltage, setVoltage] = useState(APPLIANCE_PRESETS[0].voltage);
  const [cosPhi, setCosPhi] = useState(APPLIANCE_PRESETS[0].cosPhi);
  const [energyPrice, setEnergyPrice] = useState('1.15'); // PLN/kWh

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    const item = APPLIANCE_PRESETS.find(p => p.id === presetId);
    if (item) {
      setPowerWatts(item.power);
      setPhases(item.phases);
      setVoltage(item.voltage);
      setCosPhi(item.cosPhi);
    }
  };

  const p = parseFloat(powerWatts) || 0;
  const u = parseFloat(voltage) || (phases === '3' ? 400 : 230);
  const cp = parseFloat(cosPhi) || 0.95;
  const price = parseFloat(energyPrice) || 1.15;
  const is3Phase = phases === '3';

  // Obliczenie prądu I [A]
  let currentAmps = 0;
  if (is3Phase) {
    currentAmps = p / (Math.sqrt(3) * u * cp);
  } else {
    currentAmps = p / (u * cp);
  }

  // Dobór bezpiecznika nadprądowego (In >= 1.25 * I)
  const targetRating = currentAmps * 1.15;
  const breakers = [6, 10, 16, 20, 25, 32, 40, 50, 63];
  const recommendedBreaker = breakers.find(b => b >= targetRating) || 63;
  const breakerChar = is3Phase ? `B${recommendedBreaker} 3P (lub C${recommendedBreaker})` : `B${recommendedBreaker} 1P`;

  // Dobór przewodów
  let cableSuggestion = '';
  if (recommendedBreaker <= 10) cableSuggestion = is3Phase ? '5×1.5 mm²' : '3×1.5 mm²';
  else if (recommendedBreaker <= 16) cableSuggestion = is3Phase ? '5×2.5 mm²' : '3×2.5 mm²';
  else if (recommendedBreaker <= 25) cableSuggestion = is3Phase ? '5×4 mm²' : '3×4 mm²';
  else if (recommendedBreaker <= 32) cableSuggestion = is3Phase ? '5×6 mm²' : '3×6 mm²';
  else cableSuggestion = is3Phase ? '5×10 mm²' : '3×10 mm²';

  // Koszt pracy 1 godziny na pełnej mocy
  const hourlyCost = (p / 1000) * price;

  return (
    <View style={styles.container}>
      <View style={styles.cardHeaderRow}>
        <Sparkles size={18} color="#F59E0B" />
        <Text style={styles.sectionTitle}>Szybki dobór dla sprzętów AGD i Domu</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {APPLIANCE_PRESETS.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <Chip
              key={preset.id}
              selected={isSelected}
              onPress={() => handleSelectPreset(preset.id)}
              style={[styles.presetChip, isSelected && styles.presetChipActive]}
              textStyle={[styles.presetChipText, isSelected && styles.presetChipTextActive]}
            >
              {preset.name}
            </Chip>
          );
        })}
      </ScrollView>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Tv size={20} color="#F59E0B" />
            <Text style={styles.cardHeader}>Parametry Urządzenia Domowego</Text>
          </View>

          <CustomInput
            label="Moc znamionowa pobierana"
            value={powerWatts}
            onChangeText={setPowerWatts}
            unit="W"
          />

          <Text style={styles.label}>Układ zasilania:</Text>
          <SegmentedButtons
            value={phases}
            onValueChange={(val) => {
              setPhases(val);
              setVoltage(val === '3' ? '400' : '230');
            }}
            buttons={[
              { value: '1', label: '1-faz. (230V)', labelStyle: { fontSize: 11 } },
              { value: '3', label: '3-faz. (400V)', labelStyle: { fontSize: 11 } },
            ]}
            style={styles.segmented}
            density="high"
            theme={{ colors: { secondaryContainer: '#F59E0B', onSecondaryContainer: '#000000', outline: '#444444' } }}
          />

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Współczynnik cos φ" value={cosPhi} onChangeText={setCosPhi} />
            </View>
            <View style={styles.col}>
              <CustomInput label="Cena energii PLN/kWh" value={energyPrice} onChangeText={setEnergyPrice} unit="zł" />
            </View>
          </View>
        </Card.Content>
      </Card>

      <ResultCard title="Wymagania Instalacyjne i Zabezpieczenia" status="success">
        <ResultRow
          label="Pobierany prąd roboczy (I)"
          value={currentAmps.toFixed(2)}
          unit="A"
          isHighlight
        />
        <ResultRow
          label="Zalecany bezpiecznik nadprądowy"
          value={breakerChar}
          isHighlight
        />
        <ResultRow
          label="Zalecany minimalny przewód miedziany"
          value={cableSuggestion}
          isSuccess
        />
        <ResultRow
          label="Wymagany wyłącznik RCD"
          value="Typ A lub AC, IΔn = 30mA"
        />
        <ResultRow
          label="Koszt 1 godziny pracy na pełnej mocy"
          value={hourlyCost.toFixed(2)}
          unit="zł/h"
        />
      </ResultCard>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <ShieldAlert size={18} color="#38BDF8" />
            <Text style={{ color: '#38BDF8', fontWeight: 'bold', marginLeft: 6 }}>Wskazówka bezpieczeństwa</Text>
          </View>
          <Text style={{ color: '#A0A0A0', fontSize: 12, lineHeight: 16 }}>
            Dla urządzeń dużej mocy (> 2.0 kW, np. piekarnik, pralka, zmywarka) norma PN-HD 60364 nakazuje stosowanie dedykowanych obwodów zasilających prowadzonych bezpośrednio z rozdzielnicy!
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  sectionTitle: { color: '#F59E0B', fontSize: 14, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase' },
  chipsScroll: { marginVertical: 10, flexDirection: 'row' },
  presetChip: { backgroundColor: '#1E1E1E', marginRight: 8, borderWidth: 1, borderColor: '#333333' },
  presetChipActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  presetChipText: { color: '#E0E0E0', fontSize: 12 },
  presetChipTextActive: { color: '#000000', fontWeight: 'bold' },
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 12 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#F59E0B', marginLeft: 8 },
  label: { color: '#A0A0A0', fontSize: 13, marginTop: 8, marginBottom: 4 },
  segmented: { marginBottom: 12, backgroundColor: '#121212' },
  twoCol: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  col: { flex: 1 },
  infoCard: { backgroundColor: '#1A1A1A', borderLeftWidth: 4, borderLeftColor: '#38BDF8', borderRadius: 8 },
});
