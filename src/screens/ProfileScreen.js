import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const { user, signOut, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    username: user?.username || '',
  });

  const handleSaveProfile = async () => {
    try {
      await updateUser(editedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.logoutHeaderButton}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Ionicons
                name={isEditing ? 'close' : 'create-outline'}
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            <Ionicons name="person" size={60} color={COLORS.textMuted} />
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Ionicons name="camera" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* User Information */}
        <View style={styles.userInfo}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textMuted}
              />
            ) : (
              <Text style={styles.fieldValue}>{user?.name}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Username</Text>
            {isEditing ? (
              <TextInput
                style={styles.fieldInput}
                value={editedUser.username}
                onChangeText={(text) => setEditedUser({ ...editedUser, username: text })}
                placeholder="Enter your username"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.fieldValue}>@{user?.username}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <Text style={[styles.fieldValue, styles.emailValue]}>{user?.email}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Member Since</Text>
            <Text style={styles.fieldValue}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Settings Options */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <Text style={styles.settingsItemText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="shield-outline" size={24} color={COLORS.text} />
            <Text style={styles.settingsItemText}>Privacy & Security</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.text} />
            <Text style={styles.settingsItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <Ionicons name="information-circle-outline" size={24} color={COLORS.text} />
            <Text style={styles.settingsItemText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <View style={styles.signOutButtonContent}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
              <View style={styles.signOutTextContainer}>
                <Text style={styles.signOutText}>Sign Out</Text>
                <Text style={styles.signOutSubtext}>You'll need to sign in again</Text>
              </View>
            </View>
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
  scrollContainer: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  logoutHeaderButton: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
    borderRadius: SPACING.xs,
    backgroundColor: COLORS.surface,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  changePhotoButton: {
    backgroundColor: COLORS.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    right: '35%',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  userInfo: {
    marginBottom: SPACING.xl,
  },
  fieldContainer: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
  },
  fieldInput: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emailValue: {
    color: COLORS.textMuted,
  },
  saveButton: {
    marginBottom: SPACING.xl,
    borderRadius: SPACING.base,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  settingsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
    marginBottom: SPACING.sm,
  },
  settingsItemText: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    marginLeft: SPACING.md,
  },
  signOutSection: {
    marginTop: SPACING.xl,
  },
  signOutButton: {
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.error + '40',
    padding: SPACING.md,
  },
  signOutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutTextContainer: {
    marginLeft: SPACING.md,
    alignItems: 'center',
  },
  signOutText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.error,
    fontWeight: '600',
  },
  signOutSubtext: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs / 2,
    marginLeft: SPACING.sm,
  },
});

export default ProfileScreen;