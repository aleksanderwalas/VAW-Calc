import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, SegmentedButtons, Card, Switch } from 'react-native-paper';
import { SliderInput } from '../Common/SliderInput';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { Calculator, Briefcase, Settings, BarChart2, FileText } from 'lucide-react-native';
import Svg, { Rect, Line, Text as SvgText, G } from 'react-native-svg';
import { theme } from '../../theme/theme';
import { generateEstimatePDF } from '../../utils/pdfGenerator';
import { Button } from 'react-native-paper';

export const WorkEstimateCalc = () => {
  const [subTab, setSubTab] = useState('pv');
  const [mode, setMode] = useState('auto'); // 'auto' | 'manual'

  // --- Parametry dla PV ---
  const [pvPowerKwp, setPvPowerKwp] = useState('10');
  const [pvMountType, setPvMountType] = useState('pitched'); // pitched, flat, ground
  const [pvIncludesStorage, setPvIncludesStorage] = useState(false);
  const [pvStorageCapacity, setPvStorageCapacity] = useState('5'); // kWh
  const [pvInverterPhase, setPvInverterPhase] = useState('3'); // 1 lub 3 fazy

  // --- Parametry dla Instalacji Domowej ---
  const [roomsCount, setRoomsCount] = useState('5');
  const [pointsPerRoom, setPointsPerRoom] = useState('6');
  const [switchboardRows, setSwitchboardRows] = useState('3'); // rzędy rozdzielnicy
  const [smartHome, setSmartHome] = useState(false);

  // --- Parametry dla WLZ / Przyłącza ---
  const [wlzLength, setWlzLength] = useState('35');
  const [cableCrossSection, setCableCrossSection] = useState('10'); // mm2
  const [trenchNeeded, setTrenchNeeded] = useState(true);

  // --- Stawki manualne ---
  const [manualLaborRate, setManualLaborRate] = useState('600');
  const [manualMaterialRate, setManualMaterialRate] = useState('450');
  const [manualMargin, setManualMargin] = useState('20'); // % marży

  const calculateEstimate = () => {
    let baseUnits = 0;
    let autoLaborPerUnit = 0;
    let autoMaterialPerUnit = 0;
    let additionalCost = 0;

    if (subTab === 'pv') {
      baseUnits = parseFloat(pvPowerKwp) || 0;
      if (mode === 'auto') {
        // Stawki bazowe za kWp
        autoLaborPerUnit = pvMountType === 'ground' ? 700 : pvMountType === 'flat' ? 600 : 500;
        autoMaterialPerUnit = 1200; // Inwerter, panele, konstrukcje, zabezpieczenia DC/AC
        if (pvIncludesStorage) {
          additionalCost += (parseFloat(pvStorageCapacity) || 0) * 1200; // koszt magazynu energii
        }
        if (pvInverterPhase === '3') {
          additionalCost += 300;
        }
      } else {
        autoLaborPerUnit = parseFloat(manualLaborRate) || 0;
        autoMaterialPerUnit = parseFloat(manualMaterialRate) || 0;
      }
    } else if (subTab === 'house') {
      const totalPoints = (parseInt(roomsCount) || 1) * (parseInt(pointsPerRoom) || 5);
      baseUnits = totalPoints;
      if (mode === 'auto') {
        autoLaborPerUnit = 130; // za punkt
        autoMaterialPerUnit = 85;  // przewody, puszki, aparaty
        additionalCost += (parseInt(switchboardRows) || 1) * 350; // koszt rozdzielnicy
        if (smartHome) {
          additionalCost += totalPoints * 45; // dodatkowy osprzęt smart
        }
      } else {
        autoLaborPerUnit = parseFloat(manualLaborRate) || 0;
        autoMaterialPerUnit = parseFloat(manualMaterialRate) || 0;
      }
    } else {
      // WLZ
      baseUnits = parseFloat(wlzLength) || 0;
      if (mode === 'auto') {
        autoLaborPerUnit = (trenchNeeded ? 90 : 50); // za metr trasy
        const cSec = parseFloat(cableCrossSection) || 10;
        autoMaterialPerUnit = 35 + cSec * 3.5; // cena kabla zależna od przekroju
        if (trenchNeeded) {
          additionalCost += baseUnits * 25; // zasypka, podsypka, wykop koparką/ręcznie
        }
      } else {
        autoLaborPerUnit = parseFloat(manualLaborRate) || 0;
        autoMaterialPerUnit = parseFloat(manualMaterialRate) || 0;
      }
    }

    const laborTotal = baseUnits * autoLaborPerUnit;
    const materialTotal = (baseUnits * autoMaterialPerUnit) + additionalCost;
    const netTotal = laborTotal + materialTotal;
    const marginPercent = parseFloat(manualMargin) || 20;
    const totalWithMargin = netTotal * (1 + marginPercent / 100);
    const grossTotal = totalWithMargin * 1.23; // VAT 23% (lub 8% dla mieszkaniowych, przyjmujemy standardowo 23% z opcją)

    return {
      baseUnits,
      laborTotal: laborTotal.toFixed(2),
      materialTotal: materialTotal.toFixed(2),
      netTotal: netTotal.toFixed(2),
      totalWithMargin: totalWithMargin.toFixed(2),
      grossTotal: grossTotal.toFixed(2),
    };
  };

  const est = calculateEstimate();

  // Generowanie danych do wykresu zmienności kosztów (np. w zależności od skali/mocy/długości)
  const generateChartData = () => {
    let points = [];
    let currentVal = parseFloat(est.baseUnits) || 10;
    let step = subTab === 'pv' ? 2 : subTab === 'house' ? 10 : 10;

    for (let i = 1; i <= 5; i++) {
      let val = Math.max(1, Math.round(currentVal * (0.6 + i * 0.1)));
      let cost = 0;
      if (subTab === 'pv') {
        cost = val * (500 + 1200) * 1.2;
      } else if (subTab === 'house') {
        cost = val * (130 + 85) * 1.15;
      } else {
        cost = val * (70 + 60) * 1.2;
      }
      points.push({ label: subTab === 'pv' ? `${val}kWp` : subTab === 'house' ? `${val}p` : `${val}m`, cost: Math.round(cost) });
    }
    return points;
  };

  const chartPoints = generateChartData();
  const maxChartCost = Math.max(...chartPoints.map(p => p.cost), 1000);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardHeaderRow}>
        <Calculator size={18} color="#F59E0B" />
        <Text style={styles.sectionTitle}>Zaawansowany Kosztorys Inwestorski</Text>
      </View>

      <SegmentedButtons
        value={subTab}
        onValueChange={setSubTab}
        buttons={[
          { value: 'pv', label: 'PV' },
          { value: 'house', label: 'Dom' },
          { value: 'wlz', label: 'WLZ' }
        ]}
        style={styles.segmented}
        density="high"
      />

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeaderRow}>
            <Settings size={20} color="#F59E0B" />
            <Text style={styles.cardHeader}>Parametry wyceny</Text>
          </View>

          <View style={styles.modeRow}>
            <Text style={styles.switchLabel}>Tryb obliczeń:</Text>
            <SegmentedButtons
              value={mode}
              onValueChange={setMode}
              buttons={[{ value: 'auto', label: 'Auto' }, { value: 'manual', label: 'Ręczny' }]}
              style={styles.modeSegmented}
              density="high"
            />
          </View>

          {/* Parametry specyficzne dla PV */}
          {subTab === 'pv' && (
            <>
              <SliderInput label="Moc instalacji PV" value={pvPowerKwp} min={2} max={50} step={1} onValueChange={setPvPowerKwp} unit="kWp" />
              <Text style={styles.subLabel}>Typ montażu:</Text>
              <SegmentedButtons
                value={pvMountType}
                onValueChange={setPvMountType}
                buttons={[
                  { value: 'pitched', label: 'Skośny' },
                  { value: 'flat', label: 'Płaski' },
                  { value: 'ground', label: 'Grunt' }
                ]}
                style={styles.subSegmented}
              />
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Magazyn energii w zestawie</Text>
                <Switch value={pvIncludesStorage} onValueChange={setPvIncludesStorage} color="#F59E0B" />
              </View>
              {pvIncludesStorage && (
                <SliderInput label="Pojemność magazynu" value={pvStorageCapacity} min={3} max={30} step={1} onValueChange={setPvStorageCapacity} unit="kWh" />
              )}
            </>
          )}

          {/* Parametry specyficzne dla Domu */}
          {subTab === 'house' && (
            <>
              <SliderInput label="Liczba pomieszczeń" value={roomsCount} min={1} max={30} step={1} onValueChange={setRoomsCount} unit="pok." />
              <SliderInput label="Średnio punktów na pokój" value={pointsPerRoom} min={2} max={15} step={1} onValueChange={setPointsPerRoom} unit="pkt" />
              <SliderInput label="Rzędy w rozdzielnicy głównej" value={switchboardRows} min={1} max={6} step={1} onValueChange={setSwitchboardRows} unit="rzędy" />
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Instalacja Smart Home / Automatyka</Text>
                <Switch value={smartHome} onValueChange={setSmartHome} color="#F59E0B" />
              </View>
            </>
          )}

          {/* Parametry specyficzne dla WLZ */}
          {subTab === 'wlz' && (
            <>
              <SliderInput label="Długość trasy kablowej" value={wlzLength} min={10} max={200} step={5} onValueChange={setWlzLength} unit="m" />
              <SliderInput label="Przekrój kabla WLZ" value={cableCrossSection} min={6} max={70} step={4} onValueChange={setCableCrossSection} unit="mm²" />
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Wymagany wykop / korytowanie</Text>
                <Switch value={trenchNeeded} onValueChange={setTrenchNeeded} color="#F59E0B" />
              </View>
            </>
          )}

          {mode === 'manual' && (
            <View style={styles.manualInputs}>
              <CustomInput label="Robocizna za jednostkę" value={manualLaborRate} onChangeText={setManualLaborRate} unit="PLN" />
              <CustomInput label="Materiały za jednostkę" value={manualMaterialRate} onChangeText={setManualMaterialRate} unit="PLN" />
            </View>
          )}

          <CustomInput label="Marża handlowa / zysk" value={manualMargin} onChangeText={setManualMargin} unit="%" />
        </Card.Content>
      </Card>

      {/* Wykres zmienności kosztów */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <BarChart2 size={18} color="#F59E0B" />
            <Text style={styles.cardHeader}>Wykres Zmienności Kosztów (Skala inwestycji)</Text>
          </View>
          <View style={styles.chartContainer}>
            <Svg height="140" width="300">
              <Line x1="30" y1="120" x2="280" y2="120" stroke="#444" strokeWidth="1" />
              {chartPoints.map((pt, idx) => {
                const barH = (pt.cost / maxChartCost) * 90;
                const x = 50 + idx * 45;
                const y = 120 - barH;
                return (
                  <G key={idx}>
                    <Rect x={x} y={y} width="28" height={barH} fill={theme.colors.primary} rx={4} />
                    <SvgText x={x + 14} y={y - 5} fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {Math.round(pt.cost / 1000)}k
                    </SvgText>
                    <SvgText x={x + 14} y="132" fill="#A0A0A0" fontSize="11" textAnchor="middle">
                      {pt.label}
                    </SvgText>
                  </G>
                );
              })}
            </Svg>
          </View>
        </Card.Content>
      </Card>

      <ResultCard title="Podsumowanie Kosztorysu" status="success">
        <ResultRow label="Wartość robocizny" value={est.laborTotal} unit="PLN" />
        <ResultRow label="Wartość materiałów + osprzętu" value={est.materialTotal} unit="PLN" />
        <ResultRow label="Wartość Netto (z marżą)" value={est.totalWithMargin} unit="PLN" isHighlight />
        <ResultRow label="Wartość Brutto (VAT 23%)" value={est.grossTotal} unit="PLN" isHighlight />
      </ResultCard>

      <Button
        mode="contained"
        icon={() => <FileText size={18} color="#000" />}
        onPress={() => generateEstimatePDF(est, subTab)}
        style={styles.pdfButton}
        labelStyle={styles.pdfButtonText}
      >
        Generuj i Udostępnij Raport PDF
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  sectionTitle: { color: '#F59E0B', fontSize: 14, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase' },
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 12 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#F59E0B', marginLeft: 8 },
  segmented: { marginBottom: 12, backgroundColor: '#121212' },
  subSegmented: { marginVertical: 8, backgroundColor: '#121212' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  manualInputs: { marginTop: 10, padding: 10, backgroundColor: '#2A2A2A', borderRadius: 8, gap: 8 },
  subLabel: { color: '#A0A0A0', fontSize: 12, marginTop: 4, marginBottom: 4 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  switchLabel: { color: '#FFFFFF', fontSize: 13 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, backgroundColor: '#2A2A2A', padding: 8, paddingHorizontal: 12, borderRadius: 8 },
  modeSegmented: { width: 140 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  chartContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  pdfButton: { backgroundColor: '#F59E0B', marginTop: 10, marginBottom: 20, paddingVertical: 4 },
  pdfButtonText: { color: '#000000', fontWeight: 'bold', fontSize: 16 }
});
