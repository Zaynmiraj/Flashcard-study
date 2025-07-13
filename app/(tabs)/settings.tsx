import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {
  Palette,
  Bell,
  Target,
  Volume2,
  Download,
  Upload,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useStorage } from '@/hooks/useStorage';
import { exportData, importData } from '@/utils/dataManager';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

export default function SettingsScreen() {
  const { theme, currentTheme, setTheme } = useTheme();
  const { settings, saveSettings, decks, sessions, saveDecks, saveSessions } =
    useStorage();

  const updateSetting = (key: keyof typeof settings, value: any) => {
    saveSettings({ ...settings, [key]: value });
  };

  const handleExportData = async () => {
    try {
      const exportedData = exportData(decks, sessions, settings);
      const fileUri =
        FileSystem.documentDirectory +
        `quickcards-backup-${new Date().toISOString().split('T')[0]}.json`;

      await FileSystem.writeAsStringAsync(fileUri, exportedData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sharing not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (!result?.canceled) {
        const fileContent = await FileSystem.readAsStringAsync(result.uri);
        const importedData = importData(fileContent);

        Alert.alert(
          'Import Data',
          'This will replace all your current data. Are you sure?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Import',
              onPress: () => {
                saveDecks(importedData.decks);
                saveSessions(importedData.sessions);
                saveSettings(importedData.settings);
                Alert.alert('Success', 'Data imported successfully!');
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import data');
    }
  };

  const themeOptions = [
    { key: 'light', name: 'Light', color: '#4A90E2' },
    { key: 'dark', name: 'Dark', color: '#64B5F6' },
    { key: 'sepia', name: 'Sepia', color: '#A67B5B' },
  ];

  const goalOptions = [10, 20, 30, 50];

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
    title: {
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
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      padding: 20,
      paddingBottom: 12,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: 16,
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: theme.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: theme.textSecondary,
    },
    settingValue: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: theme.primary,
    },
    themeOptions: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingBottom: 20,
      gap: 12,
    },
    themeOption: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    themeOptionActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '20',
    },
    themeOptionText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: theme.text,
      marginTop: 8,
    },
    themePreview: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginBottom: 4,
    },
    goalContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    goalButtons: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    goalButton: {
      backgroundColor: theme.surface,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    goalButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    goalButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: theme.text,
    },
    goalButtonTextActive: {
      color: '#FFFFFF',
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your learning experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingItem}>
          <Palette size={24} color={theme.primary} style={styles.settingIcon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Theme</Text>
            <Text style={styles.settingDescription}>
              Choose your preferred color scheme
            </Text>
          </View>
        </View>
        <View style={styles.themeOptions}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.themeOption,
                currentTheme === option.key && styles.themeOptionActive,
              ]}
              onPress={() => setTheme(option.key)}
            >
              <View
                style={[styles.themePreview, { backgroundColor: option.color }]}
              />
              <Text style={styles.themeOptionText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Study Preferences</Text>

        <View style={styles.settingItem}>
          <Bell size={24} color={theme.accent} style={styles.settingIcon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Study Reminders</Text>
            <Text style={styles.settingDescription}>
              Get notified when it's time to review
            </Text>
          </View>
          <Switch
            value={settings.studyReminders}
            onValueChange={(value) => updateSetting('studyReminders', value)}
            trackColor={{ false: theme.border, true: theme.primary + '40' }}
            thumbColor={
              settings.studyReminders ? theme.primary : theme.textSecondary
            }
          />
        </View>

        <View style={[styles.settingItem, styles.lastItem]}>
          <Volume2 size={24} color={theme.success} style={styles.settingIcon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Text style={styles.settingDescription}>
              Play sounds for feedback
            </Text>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(value) => updateSetting('soundEnabled', value)}
            trackColor={{ false: theme.border, true: theme.primary + '40' }}
            thumbColor={
              settings.soundEnabled ? theme.primary : theme.textSecondary
            }
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Goal</Text>
        <View style={styles.settingItem}>
          <Target size={24} color={theme.warning} style={styles.settingIcon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Cards per day</Text>
            <Text style={styles.settingDescription}>
              Set your daily study target
            </Text>
          </View>
          <Text style={styles.settingValue}>{settings.dailyGoal}</Text>
        </View>
        <View style={styles.goalContainer}>
          <View style={styles.goalButtons}>
            {goalOptions.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalButton,
                  settings.dailyGoal === goal && styles.goalButtonActive,
                ]}
                onPress={() => updateSetting('dailyGoal', goal)}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    settings.dailyGoal === goal && styles.goalButtonTextActive,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
          <Download
            size={24}
            color={theme.primary}
            style={styles.settingIcon}
          />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Export Data</Text>
            <Text style={styles.settingDescription}>
              Download your decks and progress
            </Text>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, styles.lastItem]}
          onPress={handleImportData}
        >
          <Upload size={24} color={theme.accent} style={styles.settingIcon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Import Data</Text>
            <Text style={styles.settingDescription}>
              Import decks from backup
            </Text>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <TouchableOpacity style={[styles.settingItem, styles.lastItem]}>
          <Info
            size={24}
            color={theme.textSecondary}
            style={styles.settingIcon}
          />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.settingDescription}>FlashCard v1.0.0</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
