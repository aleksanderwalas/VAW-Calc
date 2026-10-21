import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { CustomInput } from '../Common/CustomInput';
import { ResultCard, ResultRow } from '../Common/ResultCard';
import { LayoutGrid, Plus, Trash2, Shield } from 'lucide-react-native';

export const SwitchboardCalc = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Wyłącznik główny (3P)', count: '1', modules: 3 },
    { id: '2', name: 'Wyłącznik różnicowoprądowy RCD', count: '2', modules: 4 },
    { id: '3', name: 'Wyłącznik nadprądowy MCB (B16/C16)', count: '10', modules: 10 },
    { id: '4', name: 'Ochronnik przeciwprzepięciowy SPD', count: '1', modules: 4 },
  ]);

  const [customName, setCustomName] = useState('');
  const [customCount, setCustomCount] = useState('1');
  const [customModules, setCustomModules] = useState('2');

  const addItem = () => {
    if (!customName.trim()) return;
    const newItem = {
      id: Date.now().toString(),
      name: customName,
      count: customCount || '1',
      modules: parseInt(customModules) || 1,
    };
    setItems([...items, newItem]);
    setCustomName('');
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Obliczenia modułów
  let totalModules = 0;
  items.forEach(item => {
    totalModules += (parseInt(item.count) || 0) * (parseInt(item.modules) || 0);
  });

  // Dodanie 20% rezerwy wolnego miejsca
  const totalWithReserve = Math.ceil(totalModules * 1.2);

  // Dobór standardowej obudowy (np. wielokrotności 12 modułów na rząd: 1x12, 2x12, 3x12, 4x12)
  let standardSize = '1x12';
  let rows = 1;
  if (totalWithReserve <= 12) { standardSize = '1 x 12 (12 mod.)'; rows = 1; }
  else if (totalWithReserve <= 24) { standardSize = '2 x 12 (24 mod.)'; rows = 2; }
  else if (totalWithReserve <= 36) { standardSize = '3 x 12 (36 mod.)'; rows = 3; }
  else if (totalWithReserve <= 48) { standardSize = '4 x 12 (48 mod.)'; rows = 4; }
  else { standardSize = `${Math.ceil(totalWithReserve / 12)} x 12 (${Math.ceil(totalWithReserve / 12) * 12} mod.)`; rows = Math.ceil(totalWithReserve / 12); }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cardHeaderRow}>
        <LayoutGrid size={18} color="#38BDF8" />
        <Text style={styles.sectionTitle}>Kalkulator Wielkości Rozdzielnicy (Moduły DIN)</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardHeader}>Dodaj aparat do rozdzielnicy</Text>
          <CustomInput label="Nazwa aparatu / grupy" value={customName} onChangeText={setCustomName} />
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <CustomInput label="Liczba sztuk" value={customCount} onChangeText={setCustomCount} />
            </View>
            <View style={styles.col}>
              <CustomInput label="Szerokość (moduły 17.5mm)" value={customModules} onChangeText={setCustomModules} unit="mod." />
            </View>
          </View>
          <Button mode="contained" onPress={addItem} style={styles.addButton} labelStyle={{ color: '#000', fontWeight: 'bold' }}>
            Dodaj Aparat
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardHeader}>Zestawienie aparatów w rozdzielnicy:</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>Ilość: {item.count} szt. | Szerokość: {item.modules} mod./szt.</Text>
              </View>
              <Button onPress={() => removeItem(item.id)} textColor="#EF4444" compact>
                Usuń
              </Button>
            </View>
          ))}
        </Card.Content>
      </Card>

      <ResultCard title="Dobór Obudowy Rozdzielnicy" status="success" statusMessage="Uwzględniono 20% rezerwy wolnego miejsca na przyszłe rozbudowy (zgodnie z dobrą praktyką inżynierską).">
        <ResultRow label="Suma zajętych modułów DIN" value={totalModules} unit="mod." />
        <ResultRow label="Zapotrzebowanie z rezerwą 20%" value={totalWithReserve} unit="mod." isHighlight />
        <ResultRow label="Zalecana rozdzielnica natynkowa/podtynkowa" value={standardSize} unit="" isHighlight isSuccess />
        <ResultRow label="Liczba rzędów po 12 modułów" value={rows} unit="rzędy" />
      </ResultCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  sectionTitle: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold', marginLeft: 8, textTransform: 'uppercase' },
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 12 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardHeader: { fontSize: 15, fontWeight: 'bold', color: '#38BDF8', marginBottom: 8 },
  twoCol: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  col: { flex: 1 },
  addButton: { backgroundColor: '#38BDF8', marginTop: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  itemName: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  itemDetails: { color: '#A0A0A0', fontSize: 12 }
});
