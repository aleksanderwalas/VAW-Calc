import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, SegmentedButtons, Card, Chip, Divider } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { PV_PANEL_PRESETS } from '../../data/pvPresets';
import { calculatePanelAtTemperature, calculateCellTemperature } from '../../utils/pvCalculations';
import { Sun, Thermometer, ShieldAlert, Sparkles, Flame, Snowflake } from 'lucide-react-native';

export const PanelCalc = () => {
  const [selectedPresetId, setSelectedPresetId] = useState(PV_PANEL_PRESETS[0].id);

  // Parametry modułu w STC
  const [pmp, setPmp] = useState(String(PV_PANEL_PRESETS[0].pmp));
  const [voc, setVoc] = useState(String(PV_PANEL_PRESETS[0].voc));
  const [vmp, setVmp] = useState(String(PV_PANEL_PRESETS[0].vmp));
  const [isc, setIsc] = useState(String(PV_PANEL_PRESETS[0].isc));
  const [imp, setImp] = useState(String(PV_PANEL_PRESETS[0].imp));
  const [tempCoefVoc, setTempCoefVoc] = useState(String(PV_PANEL_PRESETS[0].tempCoefVoc));
  const [tempCoefIsc, setTempCoefIsc] = useState(String(PV_PANEL_PRESETS[0].tempCoefIsc));
  const [tempCoefPmp, setTempCoefPmp] = useState(String(PV_PANEL_PRESETS[0].tempCoefPmp));
  const [noct, setNoct] = useState(String(PV_PANEL_PRESETS[0].noct));

  // Temperatury symulacji
  const [tempWinter, setTempWinter] = useState('-20');
  const [tempSummerAmb, setTempSummerAmb] = useState('35');
  const [calcCellTempDirect, setCalcCellTempDirect] = useState('auto'); // 'auto' (wg NOCT) | 'manual'
  const [manualCellTempSummer, setManualCellTempSummer] = useState('65');

  // Funkcja zmiany presetu
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId);
    const p = PV_PANEL_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setPmp(String(p.pmp));
      setVoc(String(p.voc));
      setVmp(String(p.vmp));
      setIsc(String(p.isc));
      setImp(String(p.imp));
      setTempCoefVoc(String(p.tempCoefVoc));
      setTempCoefIsc(String(p.tempCoefIsc));
      setTempCoefPmp(String(p.tempCoefPmp));
      setNoct(String(p.noct));
    }
  };

  // Konwersja danych i obliczenia
  const pmpNum = parseFloat(pmp) || 0;
  const vocNum = parseFloat(voc) || 0;
  const vmpNum = parseFloat(vmp) || 0;
  const iscNum = parseFloat(isc) || 0;
  const impNum = parseFloat(imp) || (iscNum * 0.94);
  const tcVocNum = parseFloat(tempCoefVoc) || -0.26;
  const tcIscNum = parseFloat(tempCoefIsc) || 0.045;
  const tcPmpNum = parseFloat(tempCoefPmp) || -0.32;
  const noctNum = parseFloat(noct) || 45;

  const tWinterNum = parseFloat(tempWinter) || -20;
  const tSummerAmbNum = parseFloat(tempSummerAmb) || 35;

  // Obliczenie letniej temperatury pracy ogniwa
  const estimatedCellTempHot =
    calcCellTempDirect === 'auto'
      ? Math.round(calculateCellTemperature(tSummerAmbNum, noctNum, 1000))
      : parseFloat(manualCellTempSummer) || 65;

  // Obliczenia parametrów w 3 punktach termicznych
  const coldResults = calculatePanelAtTemperature({
    vocStc: vocNum,
    vmpStc: vmpNum,
    iscStc: iscNum,
    impStc: impNum,
    pmpStc: pmpNum,
    tempCoefVoc: tcVocNum,
    tempCoefIsc: tcIscNum,
    tempCoefPmp: tcPmpNum,
    cellTemp: tWinterNum,
  });

  const hotResults = calculatePanelAtTemperature({
    vocStc: vocNum,
    vmpStc: vmpNum,
    iscStc: iscNum,
    impStc: impNum,
    pmpStc: pmpNum,
    tempCoefVoc: tcVocNum,
    tempCoefIsc: tcIscNum,
    tempCoefPmp: tcPmpNum,
    cellTemp: estimatedCellTempHot,
  });

  return (
    <View style={styles.container}>
      {/* Szybki wybór presetu */}
      <View style={styles.cardHeaderRow}>
        <Sparkles size={18} color="#F59E0B" />
        <Text style={styles.sectionTitle}>Katalog popularnych paneli PV</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {PV_PANEL_PRESETS.map((preset) => {
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

      {/* Parametry znamionowe STC */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Sun size={20} color="#F59E0B" />
            <Text style={styles.cardHeader}>Parametry STC (25°C, 1000 W/m²)</Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Moc Pmp (STC)" value={pmp} onChangeText={setPmp} unit="Wp" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Napięcie Voc" value={voc} onChangeText={setVoc} unit="V" />
            </View>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Napięcie robocze Vmp" value={vmp} onChangeText={setVmp} unit="V" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Prąd zwarcia Isc" value={isc} onChangeText={setIsc} unit="A" />
            </View>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Prąd roboczy Imp" value={imp} onChangeText={setImp} unit="A" />
            </View>
            <View style={styles.col}>
              <CustomInput label="Temp. NOCT" value={noct} onChangeText={setNoct} unit="°C" />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Współczynniki temperaturowe */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Thermometer size={20} color="#38BDF8" />
            <Text style={[styles.cardHeader, { color: '#38BDF8' }]}>Współczynniki temperaturowe</Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput
                label="Współcz. Voc (αVoc)"
                value={tempCoefVoc}
                onChangeText={setTempCoefVoc}
                unit="%/°C"
              />
            </View>
            <View style={styles.col}>
              <CustomInput
                label="Współcz. Isc (βIsc)"
                value={tempCoefIsc}
                onChangeText={setTempCoefIsc}
                unit="%/°C"
              />
            </View>
          </View>

          <CustomInput
            label="Współcz. mocy Pmp (γPmp)"
            value={tempCoefPmp}
            onChangeText={setTempCoefPmp}
            unit="%/°C"
          />
        </Card.Content>
      </Card>

      {/* Warunki środowiskowe */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <ShieldAlert size={20} color="#F59E0B" />
            <Text style={styles.cardHeader}>Warunki skrajne (Projektowe)</Text>
          </View>

          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput
                label="Ekstremum zima (Tmin)"
                value={tempWinter}
                onChangeText={setTempWinter}
                unit="°C"
              />
            </View>
            <View style={styles.col}>
              <CustomInput
                label="Temp. otoczenia lato"
                value={tempSummerAmb}
                onChangeText={setTempSummerAmb}
                unit="°C"
              />
            </View>
          </View>

          <Text style={styles.subLabel}>Sposób obliczenia letniej temperatury ogniwa:</Text>
          <SegmentedButtons
            value={calcCellTempDirect}
            onValueChange={setCalcCellTempDirect}
            buttons={[
              { value: 'auto', label: `Wg NOCT (${estimatedCellTempHot}°C)` },
              { value: 'manual', label: 'Ręczna temp. ogniwa' },
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

          {calcCellTempDirect === 'manual' && (
            <CustomInput
              label="Maksymalna temp. ogniwa latem"
              value={manualCellTempSummer}
              onChangeText={setManualCellTempSummer}
              unit="°C"
            />
          )}
        </Card.Content>
      </Card>

      {/* Podsumowanie parametrów w skrajnych temperaturach */}
      <Text style={styles.summaryTitle}>Charakterystyka termiczna panelu</Text>

      {/* Zima - Ekstremum niskich temperatur */}
      <Card style={[styles.resultBox, { borderColor: '#38BDF8' }]}>
        <Card.Content>
          <View style={styles.conditionTitleRow}>
            <Snowflake size={20} color="#38BDF8" />
            <Text style={[styles.conditionTitle, { color: '#38BDF8' }]}>
              ZIMA ({tWinterNum}°C) - Maksymalne napięcia (ryzyko dla Voc)
            </Text>
          </View>
          <ResultRow
            label="Napięcie obwodu otwartego Voc(max)"
            value={coldResults.voc.toFixed(2)}
            unit="V"
            isHighlight
          />
          <ResultRow
            label="Napięcie w punkcie MPP Vmp(max)"
            value={coldResults.vmp.toFixed(2)}
            unit="V"
          />
          <ResultRow
            label="Prąd zwarciowy Isc"
            value={coldResults.isc.toFixed(2)}
            unit="A"
          />
          <ResultRow
            label="Moc chwilowa w zimnym słońcu"
            value={coldResults.pmp.toFixed(1)}
            unit="Wp"
            isSuccess
          />
        </Card.Content>
      </Card>

      {/* Lato - Ekstremum wysokich temperatur */}
      <Card style={[styles.resultBox, { borderColor: '#EF4444' }]}>
        <Card.Content>
          <View style={styles.conditionTitleRow}>
            <Flame size={20} color="#EF4444" />
            <Text style={[styles.conditionTitle, { color: '#EF4444' }]}>
              LATO ({estimatedCellTempHot}°C ogniwa) - Spadek napięć i mocy
            </Text>
          </View>
          <ResultRow
            label="Napięcie w punkcie MPP Vmp(min)"
            value={hotResults.vmp.toFixed(2)}
            unit="V"
            isHighlight
          />
          <ResultRow
            label="Napięcie Voc(min)"
            value={hotResults.voc.toFixed(2)}
            unit="V"
          />
          <ResultRow
            label="Prąd zwarciowy Isc(max)"
            value={hotResults.isc.toFixed(2)}
            unit="A"
            isHighlight
          />
          <ResultRow
            label="Rzeczywista moc w upale"
            value={hotResults.pmp.toFixed(1)}
            unit="Wp"
            isWarning
          />
          <ResultRow
            label="Spadek mocy wskutek nagrzania"
            value={hotResults.powerLossPercent.toFixed(1)}
            unit="%"
            isWarning
          />
        </Card.Content>
      </Card>

      {/* Porównanie STC */}
      <ResultCard
        title="Wnioski inżynierskie dla panelu"
        status="neutral"
        statusMessage={`W temperaturze ${tWinterNum}°C napięcie Voc rośnie o ${((coldResults.voc / vocNum - 1) * 100).toFixed(1)}%. W upale ${estimatedCellTempHot}°C spadek mocy modułu wynosi ${Math.abs(hotResults.powerLossPercent).toFixed(1)}%.`}
      >
        <ResultRow label="Napięcie znamionowe Voc (STC 25°C)" value={vocNum.toFixed(2)} unit="V" />
        <ResultRow label="Prąd zwarciowy Isc (STC 25°C)" value={iscNum.toFixed(2)} unit="A" />
        <ResultRow label="Wzrost Voc zimą względem STC" value={`+${(coldResults.voc - vocNum).toFixed(2)}`} unit="V" isHighlight />
        <ResultRow label="Spadek Vmp latem względem STC" value={`-${(vmpNum - hotResults.vmp).toFixed(2)}`} unit="V" isWarning />
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
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  resultBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  conditionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  conditionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
});
