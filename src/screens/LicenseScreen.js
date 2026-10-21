import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';

export const LicenseScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Licencja VAW Calc</Text>
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>1. Postanowienia ogólne</Text>
          <Text style={styles.text}>
            Aplikacja VAW Calc jest własnością intelektualną Aleksandra Walasa (Autor). Korzystając z Aplikacji, użytkownik akceptuje niniejsze warunki.
          </Text>

          <Text style={styles.sectionTitle}>2. Zakres odpowiedzialności</Text>
          <Text style={styles.text}>
            Narzędzie ma charakter pomocniczy. Autor dołożył starań, aby algorytmy były zgodne z normami (PN-HD 60364).
            Użytkownik jest wyłącznym decydentem w zakresie końcowego projektu technicznego. Autor nie ponosi odpowiedzialności za szkody wynikłe z błędnych danych wejściowych lub skutki decyzji podjętych na podstawie wyników Aplikacji.
          </Text>

          <Text style={styles.sectionTitle}>3. Własność intelektualna</Text>
          <Text style={styles.text}>
            Nazwa "VAW Calc", logotyp oraz algorytmy są chronione prawem autorskim. Zabrania się dekompilacji, modyfikacji i odsprzedaży oprogramowania.
          </Text>

          <Text style={styles.sectionTitle}>4. Dane techniczne</Text>
          <Text style={styles.text}>
            Każdy projekt wykonawczy powinien być weryfikowany zgodnie z aktualnymi przepisami prawa budowlanego.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#121212' },
  card: { backgroundColor: '#1E1E1E', padding: 8 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#F59E0B', marginBottom: 8 },
  divider: { marginVertical: 12, backgroundColor: '#333333' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 12, marginBottom: 4 },
  text: { color: '#A0A0A0', fontSize: 14, lineHeight: 20 },
});
