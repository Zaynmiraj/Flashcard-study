import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Brain, Target, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useStorage } from '@/hooks/useStorage';
import { DeckCard } from '@/components/DeckCard';
import { getCardsForReview } from '@/utils/spacedRepetition';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { decks, sessions, loading } = useStorage();
  const router = useRouter();

  const totalCards = decks.reduce((sum, deck) => sum + deck.cards.length, 0);
  const cardsToReview = decks.reduce((sum, deck) => sum + getCardsForReview(deck.cards).length, 0);
  const todaySessions = sessions.filter(session => 
    session.startTime.split('T')[0] === new Date().toISOString().split('T')[0]
  );
  const todayCards = todaySessions.reduce((sum, session) => sum + session.cardsStudied, 0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    greeting: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
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
      fontSize: 24,
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
      paddingHorizontal: 20,
    },
    emptyTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    createButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      marginTop: 20,
    },
    createButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
  });

  const handleCreateDeck = () => {
    router.push('/create-deck');
  };

  const handleDeckPress = (deck: any) => {
    router.push(`/deck/${deck.id}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.text, fontFamily: 'Inter-Regular' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.subtitle}>Ready to learn something new?</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Brain size={24} color={theme.primary} />
          <Text style={styles.statValue}>{totalCards}</Text>
          <Text style={styles.statLabel}>Total Cards</Text>
        </View>
        
        <View style={styles.statCard}>
          <Target size={24} color={theme.accent} />
          <Text style={[styles.statValue, { color: theme.accent }]}>{cardsToReview}</Text>
          <Text style={styles.statLabel}>To Review</Text>
        </View>
        
        <View style={styles.statCard}>
          <TrendingUp size={24} color={theme.success} />
          <Text style={[styles.statValue, { color: theme.success }]}>{todayCards}</Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Decks</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateDeck}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {decks.length === 0 ? (
        <View style={styles.emptyState}>
          <Brain size={64} color={theme.textSecondary} />
          <Text style={styles.emptyTitle}>No decks yet</Text>
          <Text style={styles.emptyText}>
            Create your first flashcard deck to start learning with spaced repetition
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateDeck}>
            <Text style={styles.createButtonText}>Create Your First Deck</Text>
          </TouchableOpacity>
        </View>
      ) : (
        decks.map((deck) => (
          <DeckCard
            key={deck.id}
            deck={deck}
            onPress={() => handleDeckPress(deck)}
          />
        ))
      )}
    </ScrollView>
  );
}