import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Surface, Button } from 'react-native-paper';
import { Sun, Zap, ShieldCheck, Home, Calculator, BookOpen, Lock } from 'lucide-react-native';
import { LicenseModal } from '../components/Common/LicenseModal';
import { VAWLogo } from '../components/Common/VAWLogo';

export const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [licensed, setLicensed] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.headerBanner} elevation={2}>
        <View style={styles.logoRow}>
          <VAWLogo size={52} showText={true} />
        </View>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Autorski Kalkulator Inżynierii Elektrycznej & Fotowoltaiki
        </Text>
      </Surface>

      <Text variant="titleMedium" style={styles.sectionTitle}>Główne Moduły</Text>

      <Card
        style={[styles.moduleCard, { borderLeftColor: '#F59E0B' }]}
        onPress={() => navigation.navigate('PV')}
      >
        <Card.Content style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: '#3B2D00' }]}>
            <Sun color="#F59E0B" size={32} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text variant="titleMedium" style={styles.cardTitle}>Fotowoltaika (PV)</Text>
            <Text variant="bodySmall" style={styles.cardDescription}>
              Łańcuchy paneli, dobór falownika, okablowanie DC oraz szacowanie rocznej produkcji energii (bilans).
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card
        style={[styles.moduleCard, { borderLeftColor: '#38BDF8' }]}
        onPress={() => navigation.navigate('Electrical')}
      >
        <Card.Content style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: '#002E44' }]}>
            <Zap color="#38BDF8" size={32} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text variant="titleMedium" style={styles.cardTitle}>Elektryka Ogólna</Text>
            <Text variant="bodySmall" style={styles.cardDescription}>
              Spadki napięcia, dobór kabli i bezpieczników, zwarcia, moc bierna oraz asystent odbioru.
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card
        style={[styles.moduleCard, { borderLeftColor: '#F472B6' }]}
        onPress={() => navigation.navigate('Estimate')}
      >
        <Card.Content style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: '#4C1D95' }]}>
            <Calculator color="#F472B6" size={32} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text variant="titleMedium" style={styles.cardTitle}>Wycena Prac</Text>
            <Text variant="bodySmall" style={styles.cardDescription}>
              Szybki kosztorys montażu PV, instalacji domowej oraz WLZ z eksportem PDF.
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card
        style={[styles.moduleCard, { borderLeftColor: '#10B981' }]}
        onPress={() => navigation.navigate('Appliances')}
      >
        <Card.Content style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: '#064E3B' }]}>
            <Home color="#10B981" size={32} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text variant="titleMedium" style={styles.cardTitle}>Elektryka Domowa & AGD</Text>
            <Text variant="bodySmall" style={styles.cardDescription}>
              Szybki dobór zabezpieczeń dla AGD oraz projektowanie zasilaczy LED.
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card
        style={[styles.moduleCard, { borderLeftColor: '#8B5CF6' }]}
        onPress={() => navigation.navigate('Knowledge')}
      >
        <Card.Content style={styles.cardContent}>
          <View style={[styles.iconContainer, { backgroundColor: '#2E1065' }]}>
            <BookOpen color="#8B5CF6" size={32} />
          </View>
          <View style={styles.cardTextContainer}>
            <Text variant="titleMedium" style={styles.cardTitle}>Baza Wiedzy & Normy</Text>
            <Text variant="bodySmall" style={styles.cardDescription}>
              Szybka ściągawka z przepisów, stref łazienkowych, stopni IP oraz norm PN-HD 60364.
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.licenseCard}>
        <Card.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ShieldCheck size={20} color={licensed ? '#10B981' : '#F59E0B'} />
              <Text style={styles.licenseTitle}>
                {licensed ? 'Licencja: AKTYWNA (PRO)' : 'Status: Wersja Standard'}
              </Text>
            </View>
            <Button
              mode="text"
              onPress={() => setModalVisible(true)}
              textColor="#38BDF8"
              labelStyle={{ fontSize: 12 }}
            >
              {licensed ? 'Szczegóły' : 'Aktywuj klucz'}
            </Button>
          </View>
          <Text style={styles.versionText}>Wersja: 1.0.6</Text>
          <Text style={styles.copyrightText}>
            Wszystkie prawa autorskie zastrzeżone © 2026 VAW Calc (Aleksander Walas).
          </Text>
        </Card.Content>
      </Card>

      <TouchableOpacity onPress={() => navigation.navigate('Changelog')} style={styles.changelogBtn}>
        <Text style={styles.changelogText}>Historia Zmian</Text>
      </TouchableOpacity>

      <LicenseModal
        visible={modalVisible}
        onLicenseActivated={(key) => {
          setLicensed(true);
          setModalVisible(false);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
  },
  headerBanner: {
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  logoRow: {
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 6,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  moduleCard: {
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#A0A0A0',
    lineHeight: 18,
  },
  licenseCard: {
    backgroundColor: '#1A1A1A',
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  licenseTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#E0E0E0',
  },
  versionText: {
    fontSize: 10,
    color: '#38BDF8',
    textAlign: 'center',
    marginTop: 8,
  },
  copyrightText: {
    fontSize: 10,
    color: '#555555',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 14,
  },
  changelogBtn: {
    marginTop: 12,
    alignItems: 'center',
    padding: 8,
  },
  changelogText: {
    color: '#888888',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
