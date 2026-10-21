import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, List, Chip, Divider } from 'react-native-paper';
import { NORMS_DATA } from '../data/normsData';
import { BookOpen, Shield, Sun, Zap, Home, Search } from 'lucide-react-native';

export const KnowledgeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredData = selectedCategory === 'all'
    ? NORMS_DATA
    : NORMS_DATA.filter(item => item.id === selectedCategory);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sun': return <Sun size={20} color="#F59E0B" />;
      case 'Zap': return <Zap size={20} color="#38BDF8" />;
      case 'Shield': return <Shield size={20} color="#EF4444" />;
      case 'Home': return <Home size={20} color="#10B981" />;
      default: return <BookOpen size={20} color="#38BDF8" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <BookOpen size={22} color="#38BDF8" />
        <Text style={styles.headerTitle}>Baza Norm i Przepisów Elektrycznych</Text>
      </View>

      {/* Wybór kategorii / zakresu */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        <Chip
          selected={selectedCategory === 'all'}
          onPress={() => setSelectedCategory('all')}
          style={[styles.chip, selectedCategory === 'all' && styles.chipActive]}
          textStyle={[styles.chipText, selectedCategory === 'all' && styles.chipTextActive]}
        >
          Wszystkie
        </Chip>
        {NORMS_DATA.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          let label = cat.category;
          if (cat.id === 'pv') label = 'PV';
          if (cat.id === 'installations') label = 'Instalacje';
          if (cat.id === 'spd') label = 'SPD';
          if (cat.id === 'special') label = 'Strefy';

          return (
            <Chip
              key={cat.id}
              selected={isSelected}
              onPress={() => setSelectedCategory(cat.id)}
              style={[styles.chip, isSelected && styles.chipActive]}
              textStyle={[styles.chipText, isSelected && styles.chipTextActive]}
            >
              {label}
            </Chip>
          );
        })}
      </ScrollView>

      {/* Lista norm w rozwijanych akordionach */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredData.map((cat) => (
          <Card key={cat.id} style={styles.card}>
            <Card.Content>
              <View style={styles.categoryHeader}>
                {getIcon(cat.icon)}
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.categoryTitle}>{cat.category}</Text>
                  <Text style={styles.categoryDesc}>{cat.description}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />

              <List.Section style={{ marginTop: 0 }}>
                {cat.norms.map((norm, nIdx) => (
                  <List.Accordion
                    key={nIdx}
                    title={norm.code}
                    description={norm.title}
                    titleStyle={styles.normCode}
                    descriptionStyle={styles.normTitle}
                    descriptionNumberOfLines={2}
                    style={styles.accordion}
                    theme={{ colors: { primary: '#38BDF8', onSurface: '#FFFFFF' } }}
                  >
                    <View style={styles.accordionContent}>
                      <Text style={styles.summaryTitle}>Kluczowe wymagania i zakres:</Text>
                      <Text style={styles.summaryText}>{norm.summary}</Text>
                    </View>
                  </List.Accordion>
                ))}
              </List.Section>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  headerBox: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#1E1E1E', borderBottomWidth: 1, borderBottomColor: '#2A2A2A' },
  headerTitle: { color: '#38BDF8', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  chipsScroll: { paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#181818' },
  chip: { backgroundColor: '#222222', marginRight: 8, borderWidth: 1, borderColor: '#333333' },
  chipActive: { backgroundColor: '#38BDF8', borderColor: '#38BDF8' },
  chipText: { color: '#A0A0A0', fontSize: 12 },
  chipTextActive: { color: '#000000', fontWeight: 'bold' },
  scrollContent: { padding: 14 },
  card: { backgroundColor: '#1E1E1E', borderRadius: 12, borderWidth: 1, borderColor: '#2A2A2A', marginBottom: 14 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  categoryTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  categoryDesc: { color: '#888888', fontSize: 12, marginTop: 2 },
  divider: { marginVertical: 8, backgroundColor: '#2A2A2A' },
  accordion: { backgroundColor: '#181818', borderRadius: 8, marginVertical: 4 },
  normCode: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold' },
  normTitle: { color: '#CCCCCC', fontSize: 12 },
  accordionContent: { backgroundColor: '#222222', padding: 12, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginTop: -4 },
  summaryTitle: { color: '#F59E0B', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  summaryText: { color: '#E0E0E0', fontSize: 13, lineHeight: 18 }
});
