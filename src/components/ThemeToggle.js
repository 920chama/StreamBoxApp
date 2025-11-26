import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';

const ThemeToggle = ({ style, size = 24, showLabel = false }) => {
  const { toggleTheme } = useTheme();
  const { colors, spacing, borderRadius, isDarkMode } = useThemedStyles();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.surfaceLight,
    },
    label: {
      marginLeft: spacing.sm,
      fontSize: 16,
      fontWeight: '500',
      color: colors.textPrimary,
    },
  });

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Feather 
        name={isDarkMode ? 'sun' : 'moon'} 
        size={size} 
        color={colors.primary} 
      />
      {showLabel && (
        <Text style={styles.label}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ThemeToggle;