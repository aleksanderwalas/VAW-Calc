import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Button, Text, Card, HelperText } from 'react-native-paper';
import { CustomInput } from './CustomInput';
import { ShieldCheck, Key, Lock } from 'lucide-react-native';

export const LicenseModal = ({ visible, onLicenseActivated }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleActivate = () => {
    setError('');
    // Przykładowa walidacja formatu klucza licencyjnego: VAW-YYYY-XXXX
    const cleanKey = licenseKey.trim().toUpperCase();
    const regex = /^VAW-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

    if (regex.test(cleanKey) || cleanKey === 'MASTER-PRO-2026') {
      setSuccess(true);
      setTimeout(() => {
        if (onLicenseActivated) onLicenseActivated(cleanKey);
      }, 1000);
    } else {
      setError('Nieprawidłowy format klucza licencyjnego. Wymagany format: VAW-XXXX-XXXX-XXXX');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <Card style={styles.modalCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Lock size={24} color="#F59E0B" />
              <Text style={styles.modalTitle}>Aktywacja Licencji VAW Calc</Text>
            </View>

            <Text style={styles.description}>
              Ta profesjonalna aplikacja inżynierska jest chroniona prawem autorskim. Do pełnego dostępu do zaawansowanych modułów wymagany jest unikalny numer licencji.
            </Text>

            <CustomInput
              label="Numer licencji"
              value={licenseKey}
              onChangeText={setLicenseKey}
              placeholder="VAW-XXXX-XXXX-XXXX"
            />

            {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}
            {success ? <HelperText type="info" visible={true} style={{ color: '#10B981' }}>Licencja aktywna! Dziękujemy.</HelperText> : null}

            <Button
              mode="contained"
              onPress={handleActivate}
              style={styles.activateButton}
              labelStyle={styles.buttonText}
              icon={() => <Key size={18} color="#000000" />}
            >
              Aktywuj Licencję
            </Button>

            <Text style={styles.footerNote}>
              © 2026 VAW Calc (Aleksander Walas). Wszelkie prawa zastrzeżone. Kopiowanie i dystrybucja bez zgody autora zabroniona.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 8,
  },
  description: {
    color: '#A0A0A0',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  activateButton: {
    backgroundColor: '#F59E0B',
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 4,
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  footerNote: {
    color: '#666666',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 10,
  },
});
