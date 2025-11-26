import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export const LoadingCard = ({ width = '100%', height = 200 }) => (
  <View style={[styles.loadingCard, { width, height }]}>
    <ActivityIndicator size="small" color="#FF6B6B" />
  </View>
);

export const EmptyState = ({ icon, title, subtitle, onRetry }) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIcon}>
      <Text style={styles.emptyIconText}>{icon}</Text>
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptySubtitle}>{subtitle}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);

export const SectionHeader = ({ title, subtitle, onSeeAll }) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  loadingCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#1a1a1a',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  seeAllText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default {
  LoadingCard,
  EmptyState,
  SectionHeader,
};