import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Play,
  Edit,
  Trash2,
  Plus,
  BarChart3,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useStorage } from '@/hooks/useStorage';
import { getCardsForReview, getStudyStats } from '@/utils/spacedRepetition';

export default function DeckDetailScreen() {
  const { theme } = useTheme();
  const { decks, saveDecks } = useStorage();
  const router = useRouter();
  const { id } = useLocalSearchParams();
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
    headerContent: {
      flex: 1,
    },
    deckTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: theme.text,
      marginBottom: 4,
    },
    deckDescription: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
    },
    colorIndicator: {
      width: 4,
      height: 60,
      borderRadius: 2,
      backgroundColor: deck?.color,
      marginLeft: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 4,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statValue: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: theme.primary,
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: theme.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    actionButtons: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 12,
      marginBottom: 20,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    secondaryButton: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    secondaryButtonText: {
      color: theme.text,
    },
    section: {
      backgroundColor: theme.card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
    },
    addCardButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardItem: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastCard: {
      borderBottomWidth: 0,
    },
    cardFront: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.text,
      marginBottom: 4,
    },
    cardBack: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
    },
    difficultyDots: {
      flexDirection: 'row',
      marginTop: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginRight: 4,
    },
    emptyCards: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });

  const deck = decks.find((d) => d.id === id);

  if (!deck) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: theme.text }}>Deck? not found</Text>
      </View>
    );
  }

  const cardsForReview = getCardsForReview(deck?.cards);
  const stats = getStudyStats(deck?.cards);

  const startStudy = () => {
    if (cardsForReview.length === 0) {
      Alert.alert(
        'No cards to review',
        'All cards are up to date. Come back later!'
      );
      return;
    }
    router.push('/(tabs)/study');
  };

  const editDeck = () => {
    router.push(`/edit-deck/${deck.id}`);
  };

  const deleteDeck = () => {
    Alert.alert(
      'Delete Deck?',
      'Are you sure you want to delete this deck?? This action cannot be undone.',
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedDecks = decks.filter((d) => d.id !== deck.id);
            saveDecks(updatedDecks);
            router.back();
          },
        },
      ]
    );
  };

  const addCard = () => {
    router.push(`/add-card/${deck?.id}`);
  };

  const renderDifficultyDots = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <View
        key={index}
        style={[
          styles.dot,
          {
            backgroundColor: index < difficulty ? theme.primary : theme.border,
          },
        ]}
      />
    ));
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
        <View style={styles.headerContent}>
          <Text style={styles.deckTitle}>{deck?.name}</Text>
          {deck?.description && (
            <Text style={styles.deckDescription}>{deck?.description}</Text>
          )}
        </View>
        <View
          style={[styles.colorIndicator, { backgroundColor: deck?.color }]}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Cards</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: theme.accent }]}>
            {cardsForReview.length}
          </Text>
          <Text style={styles.statLabel}>To Review</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: theme.success }]}>
            {stats.mastered}
          </Text>
          <Text style={styles.statLabel}>Mastered</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={startStudy}>
          <Play size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Study</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={editDeck}
        >
          <Edit size={20} color={theme.text} />
          <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={deleteDeck}
        >
          <Trash2 size={20} color={theme.error} />
          <Text style={[styles.actionButtonText, { color: theme.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Cards ({deck?.cards.length})
            </Text>
            <TouchableOpacity style={styles.addCardButton} onPress={addCard}>
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {deck?.cards.length === 0 ? (
            <View style={styles.emptyCards}>
              <Text style={styles.emptyText}>
                No cards yet. Add your first card to get started!
              </Text>
            </View>
          ) : (
            deck?.cards.map((card, index) => (
              <View
                key={card.id}
                style={[
                  styles.cardItem,
                  index === deck?.cards.length - 1 && styles.lastCard,
                ]}
              >
                <Text style={styles.cardFront}>{card.front}</Text>
                <Text style={styles.cardBack}>{card.back}</Text>
                <View style={styles.difficultyDots}>
                  {renderDifficultyDots(card.difficulty)}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
