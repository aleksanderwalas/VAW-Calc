import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, List, Divider } from 'react-native-paper';
import { Clock } from 'lucide-react-native';

export const ChangelogScreen = () => {
  const history = [
    { version: '1.0.6', date: '2026-10-21', changes: ['Wdrożenie Bazy Wiedzy i Norm (PV, Instalacje, SPD, Strefy specjalne)', 'Dodanie nawigacji do Bazy Norm'] },
    { version: '1.0.5', date: '2026-10-21', changes: ['Dodanie generatora raportów PDF w kosztorysie', 'Nowy moduł: Kalkulator Wielkości Rozdzielnicy (DIN)', 'Dodanie ekranu Licencji użytkownika (EULA)', 'Poprawki UX: zagęszczenie interfejsu i czytelność wykresów'] },
    { version: '1.0.4', date: '2026-10-20', changes: ['Przebudowa modułu kosztorysu (zaawansowane parametry PV, instalacji domowych i WLZ)', 'Usunięcie zbędnej struktury kosztów i zastąpienie jej wykresem zmienności skali', 'Dodanie konfigurowalnej marży i zaawansowanego trybu auto/ręczny'] },
    { version: '1.0.3', date: '2026-10-19', changes: ['Rebranding na VAW Calc', 'Nowe minimalistyczne logo', 'Dodanie dedykowanego modułu AGD/Dom', 'Dodanie numeracji wersji i historii zmian'] },
    { version: '1.0.2', date: '2026-10-19', changes: ['Dodanie kalkulatora kabli AC', 'Dodanie asystenta odbioru (checklisty)'] },
    { version: '1.0.1', date: '2026-10-18', changes: ['Implementacja Modułu Fotowoltaiki (Faza 2)', 'Kalkulatory łańcuchów, inwerterów, kabli DC'] },
    { version: '1.0.0', date: '2026-10-17', changes: ['Pierwsza wersja aplikacji (ECALC)', 'Podstawowe moduły elektryki'] },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Historia Zmian (Changelog)</Text>
      {history.map((item, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <Text style={styles.version}>v{item.version}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Divider style={styles.divider} />
            {item.changes.map((change, cIdx) => (
              <List.Item
                key={cIdx}
                title={change}
                left={props => <List.Icon {...props} icon="check-circle" color="#F59E0B" />}
                titleStyle={styles.changeItem}
              />
            ))}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 16 },
  card: { backgroundColor: '#1E1E1E', marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  version: { fontSize: 16, fontWeight: 'bold', color: '#38BDF8' },
  date: { color: '#888888', fontSize: 12 },
  divider: { marginVertical: 8, backgroundColor: '#333333' },
  changeItem: { fontSize: 14, color: '#E0E0E0' },
});
