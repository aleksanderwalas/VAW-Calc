import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Text, SegmentedButtons, Card, Chip, HelperText, ProgressBar, IconButton } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { PV_PANEL_PRESETS, INVERTER_PRESETS } from '../../data/pvPresets';
import { calculateStringConfig } from '../../utils/pvCalculations';
import { Layers, Zap, Cpu, Sparkles, CheckCircle2, AlertTriangle, XCircle, Plus, Minus } from 'lucide-react-native';

export const StringCalc = () => {
  // Wybór presetów
  const [selectedPanelPreset, setSelectedPanelPreset] = useState(PV_PANEL_PRESETS[0].id);
  const [selectedInvPreset, setSelectedInvPreset] = useState(INVERTER_PRESETS[0].id);

  // Dane modułu
  const [panelPmp, setPanelPmp] = useState(String(PV_PANEL_PRESETS[0].pmp));
  const [panelVoc, setPanelVoc] = useState(String(PV_PANEL_PRESETS[0].voc));
  const [panelVmp, setPanelVmp] = useState(String(PV_PANEL_PRESETS[0].vmp));
  const [panelIsc, setPanelIsc] = useState(String(PV_PANEL_PRESETS[0].isc));
  const [panelImp, setPanelImp] = useState(String(PV_PANEL_PRESETS[0].imp));
  const [tempCoefVoc, setTempCoefVoc] = useState(String(PV_PANEL_PRESETS[0].tempCoefVoc));
  const [tempCoefIsc, setTempCoefIsc] = useState(String(PV_PANEL_PRESETS[0].tempCoefIsc));

  // Dane falownika (wejście MPPT)
  const [invVocMax, setInvVocMax] = useState(String(INVERTER_PRESETS[0].vocMax));
  const [invMpptMin, setInvMpptMin] = useState(String(INVERTER_PRESETS[0].mpptMin));
  const [invMpptMax, setInvMpptMax] = useState(String(INVERTER_PRESETS[0].mpptMax));
  const [invImax, setInvImax] = useState(String(INVERTER_PRESETS[0].imaxPerMppt));
  const [invIscMax, setInvIscMax] = useState(String(INVERTER_PRESETS[0].iscMaxMppt));

  // Warunki i konfiguracja łańcucha
  const [tempMin, setTempMin] = useState('-20');
  const [tempMax, setTempMax] = useState('35');
  const [roofType, setRoofType] = useState('pitched'); // 'pitched' | 'flat' | 'ground'
  const [modulesCount, setModulesCount] = useState('14');
  const [parallelCount, setParallelCount] = useState('1');

  // Funkcje zmiany presetów
  const handlePanelPresetChange = (presetId) => {
    setSelectedPanelPreset(presetId);
    const p = PV_PANEL_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setPanelPmp(String(p.pmp));
      setPanelVoc(String(p.voc));
      setPanelVmp(String(p.vmp));
      setPanelIsc(String(p.isc));
      setPanelImp(String(p.imp));
      setTempCoefVoc(String(p.tempCoefVoc));
      setTempCoefIsc(String(p.tempCoefIsc));
    }
  };

  const handleInvPresetChange = (presetId) => {
    setSelectedInvPreset(presetId);
    const inv = INVERTER_PRESETS.find((item) => item.id === presetId);
    if (inv) {
      setInvVocMax(String(inv.vocMax));
      setInvMpptMin(String(inv.mpptMin));
      setInvMpptMax(String(inv.mpptMax));
      setInvImax(String(inv.imaxPerMppt));
      setInvIscMax(String(inv.iscMaxMppt));
    }
  };

  const changeModules = (delta) => {
    const current = parseInt(modulesCount, 10) || 0;
    const nextVal = Math.max(1, current + delta);
    setModulesCount(String(nextVal));
  };

  // Wyliczenia
  const panelObj = {
    pmp: parseFloat(panelPmp) || 400,
    voc: parseFloat(panelVoc) || 40,
    vmp: parseFloat(panelVmp) || 34,
    isc: parseFloat(panelIsc) || 12,
    imp: parseFloat(panelImp) || 11,
    tempCoefVoc: parseFloat(tempCoefVoc) || -0.26,
    tempCoefIsc: parseFloat(tempCoefIsc) || 0.045,
  };

  const invObj = {
    vocMax: parseFloat(invVocMax) || 1000,
    mpptMin: parseFloat(invMpptMin) || 160,
    mpptMax: parseFloat(invMpptMax) || 850,
    imaxPerMppt: parseFloat(invImax) || 15,
    iscMaxMppt: parseFloat(invIscMax) || 20,
  };

  const results = calculateStringConfig({
    panel: panelObj,
    inverter: invObj,
    tMin: parseFloat(tempMin) || -20,
    tMax: parseFloat(tempMax) || 35,
    roofType,
    modulesInSeries: parseInt(modulesCount, 10) || 1,
    parallelStrings: parseInt(parallelCount, 10) || 1,
  });

  // Wskaźnik napięcia na skali falownika
  const maxScaleVoltage = invObj.vocMax * 1.1; // 110% skali
  const normalizedVocPosition = Math.min(1, Math.max(0, results.currentStringVocCold / maxScaleVoltage));
  const normalizedMpptMinPosition = Math.min(1, Math.max(0, invObj.mpptMin / maxScaleVoltage));
  const normalizedMpptMaxPosition = Math.min(1, Math.max(0, invObj.mpptMax / maxScaleVoltage));

  let statusType = 'success';
  if (!results.isVocOk || !results.isMpptMinOk || !results.isMpptMaxOk || !results.isCurrentIscOk) {
    statusType = 'danger';
  } else if (!results.isCurrentImpOk) {
    statusType = 'warning';
  }

  return (
    <View style={styles.container}>
      {/* Szybki wybór presetu modułu */}
      <View style={styles.cardHeaderRow}>
        <Sparkles size={18} color="#F59E0B" />
        <Text style={styles.sectionTitle}>Moduł PV</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {PV_PANEL_PRESETS.map((preset) => {
          const isSelected = selectedPanelPreset === preset.id;
          return (
            <Chip
              key={preset.id}
              selected={isSelected}
              onPress={() => handlePanelPresetChange(preset.id)}
              style={[styles.presetChip, isSelected && styles.presetChipActive]}
              textStyle={[styles.presetChipText, isSelected && styles.presetChipTextActive]}
            >
              {preset.name.split('(')[0].trim()}
            </Chip>
          );
        })}
      </ScrollView>

      {/* Szybki wybór presetu falownika */}
      <View style={styles.cardHeaderRow}>
        <Cpu size={18} color="#38BDF8" />
        <Text style={[styles.sectionTitle, { color: '#38BDF8' }]}>Falownik (Wejście MPPT)</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {INVERTER_PRESETS.map((preset) => {
          const isSelected = selectedInvPreset === preset.id;
          return (
            <Chip
              key={preset.id}
              selected={isSelected}
              onPress={() => handleInvPresetChange(preset.id)}
              style={[styles.presetChip, isSelected && styles.presetChipActiveInv]}
              textStyle={[styles.presetChipText, isSelected && styles.presetChipTextActiveInv]}
            >
              {preset.name.split('(')[0].trim()}
            </Chip>
          );
        })}
      </ScrollView>

      {/* Interaktywny dobór liczby modułów */}
      <Card style={[styles.card, styles.highlightCard]}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Layers size={22} color="#F59E0B" />
            <Text style={styles.cardHeader}>Konfiguracja testowanego łańcucha</Text>
          </View>

          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Liczba modułów w szeregu (N):</Text>
            <View style={styles.counterControls}>
              <TouchableOpacity
                onPress={() => changeModules(-1)}
                style={styles.stepBtn}
              >
                <Minus size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.counterNumber}>{modulesCount}</Text>
              <TouchableOpacity
                onPress={() => changeModules(1)}
                style={styles.stepBtn}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput
                label="Liczba gałęzi równoległych"
                value={parallelCount}
                onChangeText={setParallelCount}
                unit="string"
              />
            </View>
            <View style={styles.col}>
              <CustomInput
                label="Typ montażu dachu"
                value={roofType === 'pitched' ? 'Skośny (+35°C)' : roofType === 'flat' ? 'Płaski (+30°C)' : 'Grunt (+25°C)'}
                disabled
              />
            </View>
          </View>

          <SegmentedButtons
            value={roofType}
            onValueChange={setRoofType}
            buttons={[
              { value: 'pitched', label: 'Dach skośny' },
              { value: 'flat', label: 'Dach płaski' },
              { value: 'ground', label: 'Grunt' },
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

      {/* Wizualny status dopasowania do falownika */}
      <Card style={[styles.card, { borderColor: statusType === 'success' ? '#10B981' : statusType === 'warning' ? '#F59E0B' : '#EF4444', borderWidth: 2 }]}>
        <Card.Content>
          <View style={styles.statusHeaderRow}>
            {statusType === 'success' ? (
              <CheckCircle2 size={26} color="#10B981" />
            ) : statusType === 'warning' ? (
              <AlertTriangle size={26} color="#F59E0B" />
            ) : (
              <XCircle size={26} color="#EF4444" />
            )}
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text
                style={[
                  styles.statusTitle,
                  {
                    color:
                      statusType === 'success'
                        ? '#10B981'
                        : statusType === 'warning'
                        ? '#F59E0B'
                        : '#EF4444',
                  },
                ]}
              >
                {statusType === 'success'
                  ? 'Konfiguracja łańcucha ZGODNA'
                  : statusType === 'warning'
                  ? 'Konfiguracja wymaga uwagi'
                  : 'NIEZGODNA / NIEBEZPIECZNA'}
              </Text>
              <Text style={styles.statusSubtitle}>
                Dopuszczalna liczba modułów w szeregu: {results.minSeriesMppt} - {results.absoluteMaxSeries} szt.
              </Text>
            </View>
          </View>

          {results.warning ? (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>{results.warning}</Text>
            </View>
          ) : null}

          {/* Skala napięciowa MPPT i Voc */}
          <View style={styles.scaleContainer}>
            <Text style={styles.scaleTitle}>Napięcia łańcucha vs granice inwertera:</Text>
            <View style={styles.voltageBar}>
              <View
                style={[
                  styles.mpptWindow,
                  {
                    left: `${normalizedMpptMinPosition * 100}%`,
                    width: `${(normalizedMpptMaxPosition - normalizedMpptMinPosition) * 100}%`,
                  },
                ]}
              />
              <View
                style={[
                  styles.currentVocMarker,
                  { left: `${normalizedVocPosition * 100}%` },
                ]}
              />
            </View>
            <View style={styles.scaleLabelsRow}>
              <Text style={styles.scaleLabelText}>0V</Text>
              <Text style={[styles.scaleLabelText, { color: '#38BDF8' }]}>
                Min MPPT: {invObj.mpptMin}V
              </Text>
              <Text style={[styles.scaleLabelText, { color: '#38BDF8' }]}>
                Max MPPT: {invObj.mpptMax}V
              </Text>
              <Text style={[styles.scaleLabelText, { color: '#EF4444', fontWeight: 'bold' }]}>
                Voc max: {invObj.vocMax}V
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Szczegółowe wyniki doboru łańcucha */}
      <ResultCard title="Parametry elektryczne łańcucha" status={statusType}>
        <ResultRow
          label="Maksymalne napięcie Voc stringu (w Tmin)"
          value={results.currentStringVocCold.toFixed(1)}
          unit="V"
          isHighlight
          isWarning={!results.isVocOk}
        />
        <ResultRow
          label="Napięcie robocze Vmp w upale (Tmax)"
          value={results.currentStringVmpHot.toFixed(1)}
          unit="V"
          isWarning={!results.isMpptMinOk}
        />
        <ResultRow
          label="Napięcie robocze Vmp zimą (Tmin)"
          value={results.currentStringVmpCold.toFixed(1)}
          unit="V"
          isWarning={!results.isMpptMaxOk}
        />
        <ResultRow
          label="Znamionowa moc generatora tego łańcucha"
          value={(results.currentStringPower / 1000).toFixed(2)}
          unit="kWp"
          isSuccess
        />
        <ResultRow
          label="Maksymalny prąd roboczy Imp gałęzi"
          value={results.currentTotalImp.toFixed(2)}
          unit="A"
          isWarning={!results.isCurrentImpOk}
        />
        <ResultRow
          label="Maksymalny prąd zwarciowy Isc gałęzi"
          value={results.currentTotalIsc.toFixed(2)}
          unit="A"
          isWarning={!results.isCurrentIscOk}
        />
        <ResultRow
          label="Maksymalna liczba równoległych stringów na MPPT"
          value={results.recommendedMaxParallel}
          unit="szt."
        />
      </ResultCard>

      {/* Parametry wejściowe do wglądu i edycji */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Zap size={20} color="#F59E0B" />
            <Text style={styles.cardHeader}>Parametry Modułu PV (Karta katalogowa)</Text>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Voc (STC)" value={panelVoc} onChangeText={setPanelVoc} unit="V" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Vmp (STC)" value={panelVmp} onChangeText={setPanelVmp} unit="V" />
            </View>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Isc (STC)" value={panelIsc} onChangeText={setPanelIsc} unit="A" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Imp (STC)" value={panelImp} onChangeText={setPanelImp} unit="A" />
            </View>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Współcz. Voc" value={tempCoefVoc} onChangeText={setTempCoefVoc} unit="%/°C" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Moc Pmp" value={panelPmp} onChangeText={setPanelPmp} unit="Wp" />
            </View>
          </View>

          <View style={styles.cardHeaderRow}>
            <Cpu size={20} color="#38BDF8" />
            <Text style={[styles.cardHeader, { color: '#38BDF8' }]}>Granice Falownika (MPPT)</Text>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Napięcie Voc max" value={invVocMax} onChangeText={setInvVocMax} unit="V" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Prąd Imax MPPT" value={invImax} onChangeText={setInvImax} unit="A" />
            </View>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="MPPT Min" value={invMpptMin} onChangeText={setInvMpptMin} unit="V" />
            </View>
            <View style={styles.col}>
              <CustomInput label="MPPT Max" value={invMpptMax} onChangeText={setInvMpptMax} unit="V" />
            </View>
          </View>
        </Card.Content>
      </Card>
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
    marginVertical: 8,
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
  presetChipActiveInv: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  presetChipText: {
    color: '#E0E0E0',
    fontSize: 12,
  },
  presetChipTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  presetChipTextActiveInv: {
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
  highlightCard: {
    borderColor: '#3B2D00',
    backgroundColor: '#1F1A12',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 8,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#332711',
  },
  counterLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  counterControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    backgroundColor: '#F59E0B',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 32,
    textAlign: 'center',
  },
  twoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  segmented: {
    backgroundColor: '#121212',
    marginTop: 6,
    marginBottom: 6,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusSubtitle: {
    color: '#A0A0A0',
    fontSize: 13,
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: '#450A0A',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  warningText: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
  },
  scaleContainer: {
    marginTop: 8,
  },
  scaleTitle: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 6,
  },
  voltageBar: {
    height: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  mpptWindow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(56, 189, 248, 0.4)',
    borderColor: '#38BDF8',
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  currentVocMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#F59E0B',
    marginLeft: -2,
    borderRadius: 2,
  },
  scaleLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  scaleLabelText: {
    color: '#888888',
    fontSize: 10,
  },
});
