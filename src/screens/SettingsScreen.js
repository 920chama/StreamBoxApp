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
import { useTheme } from '../contexts/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { themeColors } = useTheme();
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
      style={[styles.settingItem, { backgroundColor: themeColors.surface }]}
      onPress={hasSwitch ? onToggle : onPress}
      disabled={hasSwitch}
    >
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color={themeColors.textPrimary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: themeColors.textPrimary }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: themeColors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {hasSwitch && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: themeColors.border, true: themeColors.primary + '40' }}
          thumbColor={value ? themeColors.primary : themeColors.textSecondary}
        />
      )}
      {hasChevron && (
        <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <ScrollView>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={themeColors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* User Section */}
        <View style={[styles.section, { backgroundColor: themeColors.surface }]}>
          <TouchableOpacity
            style={[styles.userSection, { backgroundColor: themeColors.surface }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[styles.userAvatar, { backgroundColor: themeColors.border }]}>
              <Ionicons name="person" size={32} color={themeColors.textSecondary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: themeColors.textPrimary }]}>{user?.name}</Text>
              <Text style={[styles.userEmail, { color: themeColors.textSecondary }]}>{user?.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={[styles.section, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Preferences</Text>
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
        <View style={[styles.section, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Media Quality</Text>
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
        <View style={[styles.section, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Account</Text>
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
        <View style={[styles.section, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Support</Text>
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
        <View style={[styles.section, { backgroundColor: themeColors.surface }]}>
          <TouchableOpacity style={[styles.signOutButton, { backgroundColor: themeColors.surface, borderColor: themeColors.error + '30' }]} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color={themeColors.error} />
            <Text style={[styles.signOutText, { color: themeColors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
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
    borderRadius: SPACING.base,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
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
    marginBottom: SPACING.xs / 2,
  },
  settingSubtitle: {
    fontSize: FONT_SIZES.sm,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.md,
    borderRadius: SPACING.base,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
});

export default SettingsScreen;