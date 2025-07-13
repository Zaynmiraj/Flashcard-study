import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useStorage } from '@/hooks/useStorage';
import { Card } from '@/types';

export default function EditDeckScreen() {
  const { theme } = useTheme();
  const { decks, saveDecks } = useStorage();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const deck = decks.find((d) => d.id === id);

  const [deckName, setDeckName] = useState(deck?.name || '');
  const [deckDescription, setDeckDescription] = useState(
    deck?.description || ''
  );
  const [deckColor, setDeckColor] = useState(deck?.color || '#4A90E2');
  const [cards, setCards] = useState<Card[]>(deck?.cards || []);

  const colors = [
    '#4A90E2',
    '#50E3C2',
    '#F5A623',
    '#D0021B',
    '#7ED321',
    '#9013FE',
    '#BD10E0',
    '#B8E986',
    '#4A4A4A',
    '#9B9B9B',
    '#417505',
    '#F8E71C',
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.text,
      flex: 1,
    },
    saveButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    section: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      marginBottom: 16,
    },
    input: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 12,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorOptionSelected: {
      borderColor: theme.text,
    },
    cardItem: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    cardNumber: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
    },
    deleteButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.error,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardInput: {
      backgroundColor: theme.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.text,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 8,
    },
    addCardButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: 8,
    },
    addCardButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
  });

  if (!deck) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: theme.text }}>Deck not found</Text>
      </View>
    );
  }

  const addCard = () => {
    const newCard: Card = {
      id: Date.now().toString(),
      front: '',
      back: '',
      difficulty: 0,
      lastReviewed: '',
      nextReview: new Date().toISOString(),
      reviewCount: 0,
      correctCount: 0,
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (index: number) => {
    if (cards.length > 1) {
      setCards(cards.filter((_, i) => i !== index));
    }
  };

  const updateCard = (
    index: number,
    field: 'front' | 'back',
    value: string
  ) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setCards(updatedCards);
  };

  const saveDeck = () => {
    if (!deckName.trim()) {
      Alert.alert('Error', 'Please enter a deck name');
      return;
    }

    const validCards = cards.filter(
      (card) => card.front?.trim() && card.back?.trim()
    );
    if (validCards.length === 0) {
      Alert.alert('Error', 'Please add at least one complete card');
      return;
    }

    const updatedDeck = {
      ...deck,
      name: deckName.trim(),
      description: deckDescription.trim(),
      color: deckColor,
      cards: validCards,
    };

    const updatedDecks = decks.map((d) => (d.id === deck.id ? updatedDeck : d));
    saveDecks(updatedDecks);

    Alert.alert('Success', 'Deck updated successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Deck</Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveDeck}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deck Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Deck name"
            placeholderTextColor={theme.textSecondary}
            value={deckName}
            onChangeText={setDeckName}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            placeholderTextColor={theme.textSecondary}
            value={deckDescription}
            onChangeText={setDeckDescription}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorGrid}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  deckColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setDeckColor(color)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cards</Text>
          {cards.map((card, index) => (
            <View key={card.id} style={styles.cardItem}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardNumber}>Card {index + 1}</Text>
                {cards.length > 1 && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeCard(index)}
                  >
                    <Trash2 size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
              <TextInput
                style={styles.cardInput}
                placeholder="Front (question)"
                placeholderTextColor={theme.textSecondary}
                value={card.front}
                onChangeText={(text) => updateCard(index, 'front', text)}
                multiline
              />
              <TextInput
                style={styles.cardInput}
                placeholder="Back (answer)"
                placeholderTextColor={theme.textSecondary}
                value={card.back}
                onChangeText={(text) => updateCard(index, 'back', text)}
                multiline
              />
            </View>
          ))}
          <TouchableOpacity style={styles.addCardButton} onPress={addCard}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addCardButtonText}>Add Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
