import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Checkbox, Surface } from 'react-native-paper';
import { ShieldCheck, CheckCircle2, AlertCircle, Wrench } from 'lucide-react-native';

export const ChecklistAssist = () => {
  const [checkedItems, setCheckedItems] = useState({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
    item5: false,
    item6: false,
  });

  const toggleCheck = (key) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistData = [
    {
      id: 'item1',
      title: 'Ciągłość przewodów ochronnych i wyrównawczych',
      desc: 'Pomiar rezystancji przewodu ochronnego PE oraz połączeń z szyną główną wyrównawczą (GSU). Wartość powinna być bliska 0 Ω.',
      norm: 'PN-HD 60364-6 / PN-EN 61557-4',
    },
    {
      id: 'item2',
      title: 'Rezystancja izolacji instalacji elektrycznej',
      desc: 'Pomiar napięciem badawczym min. 500V DC (dla instalacji do 500V) lub 1000V DC (dla stron DC fotowoltaiki). Wymóg: >= 1.0 MΩ.',
      norm: 'PN-EN 61557-2',
    },
    {
      id: 'item3',
      title: 'Skuteczność samoczynnego wyłączenia (Zs / Zloop)',
      desc: 'Pomiar impedancji pętli zwarcia i weryfikacja czasów wyłączenia zabezpieczeń nadprądowych (0.4s dla obwodów końcowych <= 32A).',
      norm: 'PN-HD 60364-4-41',
    },
    {
      id: 'item4',
      title: 'Sprawdzenie działania wyłączników RCD',
      desc: 'Test prądu zadziałania IΔn oraz czasu wyłączenia (maks. 300ms dla typu AC/A przy 1×IΔn oraz max 40ms przy 5×IΔn).',
      norm: 'PN-EN 61557-6',
    },
    {
      id: 'item5',
      title: 'Sprawdzenie polaryzacji i napięć obwodu DC (PV)',
      desc: 'Weryfikacja prawidłowogłowego oznaczenia biegunów (+) i (-) paneli oraz poprawności napięcia Voc przed podłączeniem do inwertera.',
      norm: 'PN-HD 60364-7-712',
    },
    {
      id: 'item6',
      title: 'Oględziny zewnętrzne i tabliczki znamionowe',
      desc: 'Kontrola schematów elektrycznych, opisów aparatów w rozdzielnicy, trwałości oznaczeń oraz ciągłości osłon i obudów (IP).',
      norm: 'PN-HD 60364-5-51',
    },
  ];

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = (completedCount / checklistData.length) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Surface style={styles.headerBanner} elevation={2}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Wrench size={24} color="#38BDF8" />
          <Text style={styles.headerTitle}>Asystent i Checklista Odbioru</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Ukończone punkty weryfikacji: {completedCount} / {checklistData.length} ({Math.round(progressPercent)}%)
        </Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </Surface>

      {checklistData.map((item) => {
        const isChecked = checkedItems[item.id];
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => toggleCheck(item.id)}
          >
            <Card style={[styles.checkCard, isChecked && styles.checkCardCompleted]}>
              <Card.Content style={styles.cardRow}>
                <Checkbox
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={() => toggleCheck(item.id)}
                  color="#38BDF8"
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.itemTitle, isChecked && styles.itemTitleCompleted]}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                  <Text style={styles.itemNorm}>Norma: {item.norm}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        );
      })}

      {completedCount === checklistData.length && (
        <Card style={styles.successBox}>
          <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CheckCircle2 size={28} color="#10B981" />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.successTitle}>Wszystkie testy i oględziny zakończone pomyślnie!</Text>
              <Text style={styles.successText}>Instalacja jest gotowa do sporządzenia protokołu i przekazania inwestorowi.</Text>
            </View>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  headerBanner: { backgroundColor: '#1E1E1E', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#333333' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#38BDF8', marginLeft: 8 },
  headerSubtitle: { color: '#A0A0A0', fontSize: 13, marginTop: 6, marginBottom: 8 },
  progressBarBg: { height: 8, backgroundColor: '#2A2A2A', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#38BDF8' },
  checkCard: { backgroundColor: '#1E1E1E', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2A2A2A' },
  checkCardCompleted: { borderColor: '#10B981', backgroundColor: '#15241C' },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 4 },
  textContainer: { flex: 1, marginLeft: 8 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  itemTitleCompleted: { color: '#34D399', textDecorationLine: 'line-through' },
  itemDesc: { fontSize: 13, color: '#A0A0A0', lineHeight: 18, marginBottom: 6 },
  itemNorm: { fontSize: 11, color: '#38BDF8', fontWeight: '600' },
  successBox: { backgroundColor: '#064E3B', borderRadius: 12, borderWidth: 1.5, borderColor: '#10B981', marginTop: 8 },
  successTitle: { color: '#34D399', fontSize: 14, fontWeight: 'bold' },
  successText: { color: '#A7F3D0', fontSize: 12, marginTop: 2 },
});
