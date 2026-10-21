import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, Card, Chip, HelperText } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { Lightbulb, Zap, ShieldAlert, Sparkles, Sliders } from 'lucide-react-native';

const LED_PRESETS = [
  { id: 'dekora', name: 'Dekoracyjna (4.8 W/m)', power: '4.8' },
  { id: 'standard', name: 'Standard (9.6 W/m)', power: '9.6' },
  { id: 'kuchnia', name: 'Mocna / Blat (14.4 W/m)', power: '14.4' },
  { id: 'cob', name: 'COB / Bardzo jasna (18.0 W/m)', power: '18.0' },
  { id: 'rgbw', name: 'RGB+W Multikolor (24.0 W/m)', power: '24.0' },
];

export const LEDLightingCalc = () => {
  const [selectedPreset, setSelectedPreset] = useState(LED_PRESETS[2].id);

  const [lengthMeters, setLengthMeters] = useState('5'); // m
  const [powerPerMeter, setPowerPerMeter] = useState('14.4'); // W/m
  const [voltage, setVoltage] = useState('24'); // '12' | '24' V DC
  const [wireLength, setWireLength] = useState('3'); // m od zasilacza do taśmy
  const [wireSection, setWireSection] = useState('1.0'); // mm²
  const [reserveMargin, setReserveMargin] = useState('20'); // %

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    const item = LED_PRESETS.find(p => p.id === presetId);
    if (item) {
      setPowerPerMeter(item.power);
    }
  };

  const len = parseFloat(lengthMeters) || 0;
  const pPerM = parseFloat(powerPerMeter) || 0;
  const uDc = parseFloat(voltage) || 24;
  const wLen = parseFloat(wireLength) || 0;
  const wSec = parseFloat(wireSection) || 1.0;
  const reserve = (parseFloat(reserveMargin) || 20) / 100;

  // Łączna moc taśmy
  const totalPower = len * pPerM;
  // Wymagana moc zasilacza z zapasem
  const minPsuPower = totalPower * (1 + reserve);

  // Dobór typowego zasilacza z typoszeregu handlowego
  const standardPsuSizes = [15, 30, 45, 60, 75, 100, 120, 150, 200, 250, 320, 400, 500];
  const recommendedPsu = standardPsuSizes.find(s => s >= minPsuPower) || Math.ceil(minPsuPower);

  // Prąd DC
  const currentDc = uDc > 0 ? totalPower / uDc : 0;

  // Spadek napięcia na kablu doprowadzającym (2 * długość przewodu Cu, rho=0.018 przy 20°C)
  const wireResistance = (0.018 * 2 * wLen) / wSec;
  const wireVoltageDrop = wireResistance * currentDc;
  const wireVoltageDropPercent = (wireVoltageDrop / uDc) * 100;

  // Rekomendacja zasilania jednostronnego / obustronnego
  let feedMethod = 'Zasilanie jednostronne wystarczające.';
  let feedStatus = 'success';
  if (uDc === 12 && len > 5) {
    feedMethod = 'UWAGA: Dla taśmy 12V o długości > 5m zaleca się zasilanie OBUSTURONNE lub z obu końców, aby uniknąć ściemniania diod!';
    feedStatus = 'warning';
  } else if (uDc === 24 && len > 10) {
    feedMethod = 'Dla taśmy 24V o długości > 10m zaleca się zasilanie z obu stron.';
    feedStatus = 'warning';
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardHeaderRow}>
        <Sparkles size={18} color="#38BDF8" />
        <Text style={styles.sectionTitle}>Dobór Zasilacza i Okablowania LED</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {LED_PRESETS.map((preset) => {
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
            <Lightbulb size={20} color="#38BDF8" />
            <Text style={styles.cardHeader}>Parametry Taśmy LED</Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Długość taśmy" value={lengthMeters} onChangeText={setLengthMeters} unit="m" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Moc na metr" value={powerPerMeter} onChangeText={setPowerPerMeter} unit="W/m" />
            </View>
          </View>

          <Text style={styles.label}>Napięcie robocze zasilacza (DC):</Text>
          <SegmentedButtons
            value={voltage}
            onValueChange={setVoltage}
            buttons={[
              { value: '12', label: '12V DC', labelStyle: { fontSize: 11 } },
              { value: '24', label: '24V DC (Zal.)', labelStyle: { fontSize: 11 } },
            ]}
            style={styles.segmented}
            density="high"
            theme={{ colors: { secondaryContainer: '#38BDF8', onSecondaryContainer: '#000000', outline: '#444444' } }}
          />

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Długość kabla zasilacz-LED" value={wireLength} onChangeText={setWireLength} unit="m" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Przekrój kabla Cu" value={wireSection} onChangeText={setWireSection} unit="mm²" />
            </View>
          </View>
        </Card.Content>
      </Card>

      <ResultCard title="Wyniki Doboru Zasilacza i Instalacji" status={feedStatus} statusMessage={feedMethod}>
        <ResultRow
          label="Łączna moc taśmy LED"
          value={totalPower.toFixed(1)}
          unit="W"
          isHighlight
        />
        <ResultRow
          label="Zalecana moc zasilacza (zapas min. 20%)"
          value={`${recommendedPsu}W (min. ${minPsuPower.toFixed(0)}W)`}
          isSuccess
          isHighlight
        />
        <ResultRow
          label="Maksymalny prąd obciążenia DC"
          value={currentDc.toFixed(2)}
          unit="A"
        />
        <ResultRow
          label="Spadek napięcia na kablu do taśmy"
          value={`${wireVoltageDrop.toFixed(2)}V (${wireVoltageDropPercent.toFixed(1)}%)`}
          isWarning={wireVoltageDropPercent > 3.0}
        />
      </ResultCard>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <ShieldAlert size={18} color="#F59E0B" />
            <Text style={{ color: '#F59E0B', fontWeight: 'bold', marginLeft: 6 }}>Dlaczego warto wybrać 24V?</Text>
          </View>
          <Text style={{ color: '#A0A0A0', fontSize: 12, lineHeight: 16 }}>
            Przy napięciu 24V płynie 2-krotnie mniejszy prąd niż przy 12V, co 4-krotnie redukuje straty napięcia na kablach i pozwala na montaż dłuższych odcinków bez widocznego spadku jasności diod.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  sectionTitle: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase' },
  chipsScroll: { marginVertical: 10, flexDirection: 'row' },
  presetChip: { backgroundColor: '#1E1E1E', marginRight: 8, borderWidth: 1, borderColor: '#333333' },
  presetChipActive: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  presetChipText: { color: '#E0E0E0', fontSize: 12 },
  presetChipTextActive: { color: '#000000', fontWeight: 'bold' },
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 12 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#38BDF8', marginLeft: 8 },
  label: { color: '#A0A0A0', fontSize: 13, marginTop: 8, marginBottom: 4 },
  segmented: { marginBottom: 12, backgroundColor: '#121212' },
  twoCol: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  col: { flex: 1 },
  infoCard: { backgroundColor: '#1A1A1A', borderLeftWidth: 4, borderLeftColor: '#F59E0B', borderRadius: 8 },
});
