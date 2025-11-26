import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, TYPOGRAPHY, SPACING, LAYOUT, COMMON_STYLES, FONT_SIZES, getResponsiveFontSize, getThemeColors } from '../styles/globalStyles';
import { useFormValidation, validationSchemas } from '../hooks/useFormValidation';

const RegisterScreen = ({ navigation }) => {
  const { signUp, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    getFieldError,
    isValid,
  } = useFormValidation(
    { 
      name: '', 
      username: '', 
      email: '', 
      password: '', 
      confirmPassword: '' 
    },
    validationSchemas.register
  );

  const handleRegister = async () => {
    if (!isValid) {
      Alert.alert('Validation Error', 'Please fix the form errors before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      const userData = {
        name: values.name.trim(),
        username: values.username.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };

      const result = await signUp(userData);
      
      if (!result.success) {
        Alert.alert('Registration Failed', result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={24} color={themeColors.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: themeColors.textPrimary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Join StreamBox and discover amazing content</Text>
          </View>

          {/* Registration Form */}
          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, getFieldError('name') && styles.inputError]}>
                <Feather name="user" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={values.name}
                  onChangeText={(text) => handleChange('name', text)}
                  onBlur={() => handleBlur('name')}
                  autoCapitalize="words"
                />
              </View>
              {getFieldError('name') && (
                <Text style={styles.errorText}>{getFieldError('name')}</Text>
              )}
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, getFieldError('username') && styles.inputError]}>
                <Feather name="at-sign" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor={COLORS.textMuted}
                  value={values.username}
                  onChangeText={(text) => handleChange('username', text)}
                  onBlur={() => handleBlur('username')}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {getFieldError('username') && (
                <Text style={styles.errorText}>{getFieldError('username')}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, getFieldError('email') && styles.inputError]}>
                <Feather name="mail" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={COLORS.textMuted}
                  value={values.email}
                  onChangeText={(text) => handleChange('email', text)}
                  onBlur={() => handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {getFieldError('email') && (
                <Text style={styles.errorText}>{getFieldError('email')}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, getFieldError('password') && styles.inputError]}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={values.password}
                  onChangeText={(text) => handleChange('password', text)}
                  onBlur={() => handleBlur('password')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {getFieldError('password') && (
                <Text style={styles.errorText}>{getFieldError('password')}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, getFieldError('confirmPassword') && styles.inputError]}>
                <Feather name="lock" size={20} color={COLORS.textMuted} />
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={values.confirmPassword}
                  onChangeText={(text) => handleChange('confirmPassword', text)}
                  onBlur={() => handleBlur('confirmPassword')}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {getFieldError('confirmPassword') && (
                <Text style={styles.errorText}>{getFieldError('confirmPassword')}</Text>
              )}
            </View>

            {/* Password Requirements */}
            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementsTitle}>Password requirements:</Text>
              <View style={styles.requirement}>
                <Ionicons
                  name={values.password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={values.password.length >= 8 ? COLORS.success : COLORS.textMuted}
                />
                <Text style={[styles.requirementText, values.password.length >= 8 && styles.requirementMet]}>
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={/(?=.*[a-z])(?=.*[A-Z])/.test(values.password) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/(?=.*[a-z])(?=.*[A-Z])/.test(values.password) ? COLORS.success : COLORS.textMuted}
                />
                <Text style={[styles.requirementText, /(?=.*[a-z])(?=.*[A-Z])/.test(values.password) && styles.requirementMet]}>
                  Upper and lowercase letters
                </Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={/(?=.*\d)/.test(values.password) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/(?=.*\d)/.test(values.password) ? COLORS.success : COLORS.textMuted}
                />
                <Text style={[styles.requirementText, /(?=.*\d)/.test(values.password) && styles.requirementMet]}>
                  At least one number
                </Text>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, (!isValid || isSubmitting) && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={!isValid || isSubmitting}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.registerButtonGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={styles.registerButtonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  backButton: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    marginLeft: SPACING.base,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
  },
  passwordInput: {
    flex: 1,
  },
  passwordToggle: {
    padding: SPACING.xs,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  passwordRequirements: {
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: SPACING.base,
  },
  requirementsTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  requirementText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
  },
  requirementMet: {
    color: COLORS.success,
  },
  registerButton: {
    marginBottom: SPACING.xl,
    borderRadius: SPACING.base,
    overflow: 'hidden',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  registerButtonText: {
    color: '#000',
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.base,
  },
  signInLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});

export default RegisterScreen;