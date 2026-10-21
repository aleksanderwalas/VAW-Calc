import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, Card, Chip, ProgressBar } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { INVERTER_PRESETS } from '../../data/pvPresets';
import { calculateInverterSizing } from '../../utils/pvCalculations';
import { Zap, Cpu, Sparkles, Compass, ShieldCheck, Activity, Gauge } from 'lucide-react-native';

export const InverterCalc = () => {
  const [selectedPresetId, setSelectedPresetId] = useState(INVERTER_PRESETS[0].id);

  // Parametry falownika
  const [powerAc, setPowerAc] = useState(String(INVERTER_PRESETS[0].powerAc));
  const [apparentPower, setApparentPower] = useState(String(INVERTER_PRESETS[0].maxApparentPower));
  const [phases, setPhases] = useState(String(INVERTER_PRESETS[0].phases)); // '1' | '3'
  const [efficiency, setEfficiency] = useState(String(INVERTER_PRESETS[0].efficiency));
  const [mpptCount, setMpptCount] = useState(String(INVERTER_PRESETS[0].mpptCount));
  const [vocMax, setVocMax] = useState(String(INVERTER_PRESETS[0].vocMax));
  const [mpptMin, setMpptMin] = useState(String(INVERTER_PRESETS[0].mpptMin));
  const [mpptMax, setMpptMax] = useState(String(INVERTER_PRESETS[0].mpptMax));
  const [imaxMppt, setImaxMppt] = useState(String(INVERTER_PRESETS[0].imaxPerMppt));

  // Parametry instalacji PV
  const [totalDcPower, setTotalDcPower] = useState('9.6'); // kWp
  const [orientation, setOrientation] = useState('south'); // 'south' | 'east_west'
  const [cosPhi, setCosPhi] = useState('1.0');

  // Funkcja wyboru presetu inwertera
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const inv = INVERTER_PRESETS.find((item) => item.id === presetId);
    if (inv) {
      setPowerAc(String(inv.powerAc));
      setApparentPower(String(inv.maxApparentPower));
      setPhases(String(inv.phases));
      setEfficiency(String(inv.efficiency));
      setMpptCount(String(inv.mpptCount));
      setVocMax(String(inv.vocMax));
      setMpptMin(String(inv.mpptMin));
      setMpptMax(String(inv.mpptMax));
      setImaxMppt(String(inv.imaxPerMppt));
    }
  };

  // Wyliczenia
  const results = calculateInverterSizing({
    totalDcPowerKwp: totalDcPower,
    inverterPowerAcKw: powerAc,
    maxApparentPowerKva: apparentPower,
    phases: parseInt(phases, 10),
    voltageAc: parseInt(phases, 10) === 1 ? 230 : 400,
    cosPhi: parseFloat(cosPhi) || 1.0,
    inverterEfficiency: efficiency,
    orientation,
  });

  const ratioNumber = parseFloat(results.dcAcRatio) || 0;
  // Progress bar znormalizowany od 80% do 160%
  const normalizedRatioProgress = Math.max(0, Math.min(1, (ratioNumber - 70) / 90));

  let ratioBarColor = '#10B981'; // green
  if (results.ratioStatus === 'warning') ratioBarColor = '#F59E0B';
  if (results.ratioStatus === 'danger') ratioBarColor = '#EF4444';

  return (
    <View style={styles.container}>
      {/* Szybki wybór inwertera z presetów */}
      <View style={styles.cardHeaderRow}>
        <Sparkles size={18} color="#F59E0B" />
        <Text style={styles.sectionTitle}>Katalog popularnych falowników</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {INVERTER_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <Chip
              key={preset.id}
              selected={isSelected}
              onPress={() => handleSelectPreset(preset.id)}
              style={[styles.presetChip, isSelected && styles.presetChipActive]}
              textStyle={[styles.presetChipText, isSelected && styles.presetChipTextActive]}
            >
              {preset.name.split('(')[0].trim()}
            </Chip>
          );
        })}
      </ScrollView>

      {/* Parametry instalacji generatora PV */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Zap size={20} color="#F59E0B" />
            <Text style={styles.cardHeader}>Generator DC (Panele Fotowoltaiczne)</Text>
          </View>

          <CustomInput
            label="Łączna moc generatora DC (Pdc)"
            value={totalDcPower}
            onChangeText={setTotalDcPower}
            unit="kWp"
          />

          <Text style={styles.subLabel}>Orientacja dachu / generatora:</Text>
          <SegmentedButtons
            value={orientation}
            onValueChange={setOrientation}
            buttons={[
              { value: 'south', label: 'Południe (S)' },
              { value: 'east_west', label: 'Wschód-Zachód (E-W)' },
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

      {/* Parametry falownika */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Cpu size={20} color="#38BDF8" />
            <Text style={[styles.cardHeader, { color: '#38BDF8' }]}>
              Parametry Falownika (AC & MPPT)
            </Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput
                label="Moc znamionowa AC"
                value={powerAc}
                onChangeText={setPowerAc}
                unit="kW"
              />
            </View>
            <View style={styles.col}>
              <CustomInput
                label="Moc pozorna Smax"
                value={apparentPower}
                onChangeText={setApparentPower}
                unit="kVA"
              />
            </View>
          </View>

          <Text style={styles.subLabel}>Układ fazowy:</Text>
          <SegmentedButtons
            value={phases}
            onValueChange={setPhases}
            buttons={[
              { value: '1', label: '1-fazowy (230V)' },
              { value: '3', label: '3-fazowy (400V)' },
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

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput
                label="Sprawność maks."
                value={efficiency}
                onChangeText={setEfficiency}
                unit="%"
              />
            </View>
            <View style={styles.col}>
              <CustomInput
                label="Współcz. mocy cos φ"
                value={cosPhi}
                onChangeText={setCosPhi}
              />
            </View>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput
                label="Liczba MPPT"
                value={mpptCount}
                onChangeText={setMpptCount}
                unit="szt."
              />
            </View>
            <View style={styles.col}>
              <CustomInput
                label="Max prąd MPPT"
                value={imaxMppt}
                onChangeText={setImaxMppt}
                unit="A"
              />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Wizualny wskaźnik DC/AC Ratio */}
      <Card style={[styles.card, { borderColor: ratioBarColor, borderWidth: 1.5 }]}>
        <Card.Content>
          <View style={styles.ratioHeaderRow}>
            <Gauge size={22} color={ratioBarColor} />
            <Text style={[styles.ratioTitle, { color: ratioBarColor }]}>
              Wskaźnik Przewymiarowania DC/AC: {results.dcAcRatio}%
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <ProgressBar
              progress={normalizedRatioProgress}
              color={ratioBarColor}
              style={styles.progressBar}
            />
            <View style={styles.ratioLabelsRow}>
              <Text style={styles.ratioScaleText}>70%</Text>
              <Text style={styles.ratioScaleText}>100%</Text>
              <Text style={[styles.ratioScaleText, { color: '#10B981', fontWeight: 'bold' }]}>
                115-130% (Optimum)
              </Text>
              <Text style={styles.ratioScaleText}>160%</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBanner,
              {
                backgroundColor:
                  results.ratioStatus === 'success'
                    ? '#064E3B'
                    : results.ratioStatus === 'warning'
                    ? '#451A03'
                    : '#450A0A',
              },
            ]}
          >
            <Text
              style={[
                styles.statusBannerText,
                {
                  color:
                    results.ratioStatus === 'success'
                      ? '#34D399'
                      : results.ratioStatus === 'warning'
                      ? '#FBBF24'
                      : '#F87171',
                },
              ]}
            >
              {results.ratioComment}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Wyniki elektryczne i zabezpieczenia AC */}
      <ResultCard
        title="Weryfikacja elektryczna falownika i AC"
        status={results.ratioStatus}
      >
        <ResultRow
          label="Maksymalny prąd wyjściowy AC (Iac max)"
          value={results.currentAcMax}
          unit="A"
          isHighlight
        />
        <ResultRow
          label="Zalecany wyłącznik nadprądowy (MCB)"
          value={results.recommendedBreaker}
          isHighlight
        />
        <ResultRow
          label="Szacowane straty clippingu (obcinania mocy)"
          value={results.estimatedClippingLoss}
          unit="%"
          isWarning={parseFloat(results.estimatedClippingLoss) > 1.5}
        />
        <ResultRow
          label="Szacowana roczna produkcja energii"
          value={results.estimatedAnnualYieldKwh}
          unit="kWh/rok"
          isSuccess
        />
        <ResultRow
          label="Zalecany typ i czułość RCD"
          value={results.rcdRecommendation}
        />
      </ResultCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  sectionTitle: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  chipsScroll: {
    marginVertical: 10,
    flexDirection: 'row',
  },
  presetChip: {
    backgroundColor: '#1E1E1E',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  presetChipActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  presetChipText: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  presetChipTextActive: {
    color: '#000000',
    fontWeight: 'bold',
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
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  subLabel: {
    color: '#A0A0A0',
    fontSize: 13,
    marginBottom: 8,
    marginTop: 4,
  },
  segmented: {
    backgroundColor: '#121212',
    marginBottom: 12,
  },
  ratioHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2A2A2A',
  },
  ratioLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  ratioScaleText: {
    color: '#888888',
    fontSize: 11,
  },
  statusBanner: {
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
});
