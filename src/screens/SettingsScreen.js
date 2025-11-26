import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    autoPlay: false,
    downloadOnWiFi: true,
    darkMode: true,
    highQuality: false,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, value, onToggle, hasSwitch = false, hasChevron = false, onPress }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={hasSwitch ? onToggle : onPress}
      disabled={hasSwitch}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={COLORS.text} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {hasSwitch && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.border, true: COLORS.primary + '40' }}
          thumbColor={value ? COLORS.primary : COLORS.textMuted}
        />
      )}
      {hasChevron && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* User Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.userSection}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={32} color={COLORS.textMuted} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive updates about new content"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
            hasSwitch
          />
          <SettingItem
            icon="play-circle-outline"
            title="Auto-Play Videos"
            subtitle="Automatically play video previews"
            value={settings.autoPlay}
            onToggle={() => toggleSetting('autoPlay')}
            hasSwitch
          />
          <SettingItem
            icon="wifi-outline"
            title="Download on Wi-Fi Only"
            subtitle="Save mobile data usage"
            value={settings.downloadOnWiFi}
            onToggle={() => toggleSetting('downloadOnWiFi')}
            hasSwitch
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Use dark theme"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
            hasSwitch
          />
        </View>

        {/* Media Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media Quality</Text>
          <SettingItem
            icon="videocam-outline"
            title="High Quality Streaming"
            subtitle="Better quality, uses more data"
            value={settings.highQuality}
            onToggle={() => toggleSetting('highQuality')}
            hasSwitch
          />
          <SettingItem
            icon="download-outline"
            title="Download Quality"
            subtitle="High"
            hasChevron
            onPress={() => Alert.alert('Download Quality', 'Quality settings would open here')}
          />
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon="shield-outline"
            title="Privacy & Security"
            hasChevron
            onPress={() => Alert.alert('Privacy & Security', 'Privacy settings would open here')}
          />
          <SettingItem
            icon="card-outline"
            title="Subscription"
            subtitle="Manage your plan"
            hasChevron
            onPress={() => Alert.alert('Subscription', 'Subscription management would open here')}
          />
          <SettingItem
            icon="download-outline"
            title="Downloaded Content"
            subtitle="Manage offline content"
            hasChevron
            onPress={() => Alert.alert('Downloaded Content', 'Download manager would open here')}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            hasChevron
            onPress={() => Alert.alert('Help Center', 'Help documentation would open here')}
          />
          <SettingItem
            icon="chatbubble-outline"
            title="Contact Support"
            hasChevron
            onPress={() => Alert.alert('Contact Support', 'Support chat would open here')}
          />
          <SettingItem
            icon="star-outline"
            title="Rate StreamBox"
            hasChevron
            onPress={() => Alert.alert('Rate StreamBox', 'App store rating would open here')}
          />
          <SettingItem
            icon="information-circle-outline"
            title="About"
            subtitle="Version 1.0.0"
            hasChevron
            onPress={() => Alert.alert('About StreamBox', 'App information would display here')}
          />
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  section: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  settingTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  signOutText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
});

export default SettingsScreen;