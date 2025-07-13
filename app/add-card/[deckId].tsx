import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useStorage } from '@/hooks/useStorage';
import { Card } from '@/types';

export default function AddCardScreen() {
  const { theme } = useTheme();
  const { decks, saveDecks } = useStorage();
  const router = useRouter();
  const { deckId } = useLocalSearchParams();

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
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
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    deckInfo: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    deckName: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      marginBottom: 4,
    },
    deckDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
    },
    cardForm: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      marginBottom: 8,
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
      marginBottom: 20,
      height: 120,
      textAlignVertical: 'top',
    },
  });

  const deck = decks.find((d) => d.id === deckId);

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

  const saveCard = () => {
    if (!front.trim() || !back.trim()) {
      Alert.alert('Error', 'Please fill in both front and back of the card');
      return;
    }

    const newCard: Card = {
      id: Date.now().toString(),
      front: front.trim(),
      back: back.trim(),
      difficulty: 0,
      lastReviewed: '',
      nextReview: new Date().toISOString(),
      reviewCount: 0,
      correctCount: 0,
    };

    const updatedDeck = {
      ...deck,
      cards: [...deck.cards, newCard],
    };

    const updatedDecks = decks.map((d) => (d.id === deck.id ? updatedDeck : d));
    saveDecks(updatedDecks);

    Alert.alert('Success', 'Card added successfully!', [
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
        <Text style={styles.headerTitle}>Add Card</Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.deckInfo}>
          <Text style={styles.deckName}>{deck.name}</Text>
          {deck.description && (
            <Text style={styles.deckDescription}>{deck.description}</Text>
          )}
        </View>

        <View style={styles.cardForm}>
          <Text style={styles.label}>Front (Question)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the question or prompt..."
            placeholderTextColor={theme.textSecondary}
            value={front}
            onChangeText={setFront}
            multiline
          />

          <Text style={styles.label}>Back (Answer)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the answer or explanation..."
            placeholderTextColor={theme.textSecondary}
            value={back}
            onChangeText={setBack}
            multiline
          />
        </View>
      </View>
    </View>
  );
}
