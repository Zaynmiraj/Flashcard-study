import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BookOpen, Clock } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Deck } from '@/types';
import { getCardsForReview, getStudyStats } from '@/utils/spacedRepetition';

interface DeckCardProps {
  deck: Deck;
  onPress: () => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({ deck, onPress }) => {
  const { theme } = useTheme();
  const stats = getStudyStats(deck.cards);
  const cardsForReview = getCardsForReview(deck.cards);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      flex: 1,
      marginRight: 12,
    },
    colorIndicator: {
      width: 4,
      height: 40,
      borderRadius: 2,
      backgroundColor: deck.color,
    },
    description: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
      marginBottom: 16,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.textSecondary,
      marginLeft: 6,
    },
    reviewBadge: {
      backgroundColor: theme.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    reviewText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.border,
      borderRadius: 2,
      marginTop: 12,
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 2,
    },
    progressText: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });

  const progress = stats.total > 0 ? stats.mastered / stats.total : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{deck.name}</Text>
        <View style={[styles.colorIndicator, { backgroundColor: deck.color }]} />
      </View>
      
      {deck.description && (
        <Text style={styles.description}>{deck.description}</Text>
      )}
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {stats.mastered}/{stats.total} cards mastered
      </Text>
      
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <BookOpen size={16} color={theme.textSecondary} />
          <Text style={styles.statText}>{stats.total} cards</Text>
        </View>
        
        {cardsForReview.length > 0 && (
          <View style={styles.reviewBadge}>
            <Text style={styles.reviewText}>
              {cardsForReview.length} to review
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};