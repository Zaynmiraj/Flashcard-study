import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/types';

interface FlashCardProps {
  card: Card;
  showAnswer: boolean;
  onFlip: () => void;
}

const { width } = Dimensions.get('window');

export const FlashCard: React.FC<FlashCardProps> = ({ card, showAnswer, onFlip }) => {
  const { theme } = useTheme();
  const flipRotation = useSharedValue(0);

  React.useEffect(() => {
    flipRotation.value = withTiming(showAnswer ? 180 : 0, { duration: 600 });
  }, [showAnswer]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [0, 180]);
    const opacity = interpolate(flipRotation.value, [0, 90, 180], [1, 0, 0]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipRotation.value, [0, 180], [180, 360]);
    const opacity = interpolate(flipRotation.value, [0, 90, 180], [0, 0, 1]);
    
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const styles = StyleSheet.create({
    container: {
      width: width - 32,
      height: 300,
      alignSelf: 'center',
      marginVertical: 20,
    },
    card: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.border,
      backfaceVisibility: 'hidden',
    },
    text: {
      fontSize: 18,
      fontFamily: 'Inter-Regular',
      color: theme.text,
      textAlign: 'center',
      lineHeight: 26,
    },
    label: {
      position: 'absolute',
      top: 16,
      left: 20,
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    difficulty: {
      position: 'absolute',
      bottom: 16,
      right: 20,
      flexDirection: 'row',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 2,
    },
  });

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
    <TouchableOpacity style={styles.container} onPress={onFlip} activeOpacity={0.9}>
      <Animated.View style={[styles.card, frontAnimatedStyle]}>
        <Text style={styles.label}>Question</Text>
        <Text style={styles.text}>{card.front}</Text>
        <View style={styles.difficulty}>
          {renderDifficultyDots(card.difficulty)}
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.card, backAnimatedStyle]}>
        <Text style={styles.label}>Answer</Text>
        <Text style={styles.text}>{card.back}</Text>
        <View style={styles.difficulty}>
          {renderDifficultyDots(card.difficulty)}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};