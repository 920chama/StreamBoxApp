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
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.surface }, getFieldError('name') && [styles.inputError, { borderColor: themeColors.error }]]}>
                <Feather name="user" size={20} color={themeColors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: themeColors.textPrimary }]}
                  placeholder="Full Name"
                  placeholderTextColor={themeColors.textSecondary}
                  value={values.name}
                  onChangeText={(text) => handleChange('name', text)}
                  onBlur={() => handleBlur('name')}
                  autoCapitalize="words"
                />
              </View>
              {getFieldError('name') && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{getFieldError('name')}</Text>
              )}
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.surface }, getFieldError('username') && [styles.inputError, { borderColor: themeColors.error }]]}>
                <Feather name="at-sign" size={20} color={themeColors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: themeColors.textPrimary }]}
                  placeholder="Username"
                  placeholderTextColor={themeColors.textSecondary}
                  value={values.username}
                  onChangeText={(text) => handleChange('username', text)}
                  onBlur={() => handleBlur('username')}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {getFieldError('username') && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{getFieldError('username')}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.surface }, getFieldError('email') && [styles.inputError, { borderColor: themeColors.error }]]}>
                <Feather name="mail" size={20} color={themeColors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: themeColors.textPrimary }]}
                  placeholder="Email address"
                  placeholderTextColor={themeColors.textSecondary}
                  value={values.email}
                  onChangeText={(text) => handleChange('email', text)}
                  onBlur={() => handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {getFieldError('email') && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{getFieldError('email')}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.surface }, getFieldError('password') && [styles.inputError, { borderColor: themeColors.error }]]}>
                <Ionicons name="lock-closed-outline" size={20} color={themeColors.textSecondary} />
                <TextInput
                  style={[styles.input, styles.passwordInput, { color: themeColors.textPrimary }]}
                  placeholder="Password"
                  placeholderTextColor={themeColors.textSecondary}
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
                    color={themeColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {getFieldError('password') && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{getFieldError('password')}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.surface }, getFieldError('confirmPassword') && [styles.inputError, { borderColor: themeColors.error }]]}>
                <Feather name="lock" size={20} color={themeColors.textSecondary} />
                <TextInput
                  style={[styles.input, styles.passwordInput, { color: themeColors.textPrimary }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={themeColors.textSecondary}
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
                    color={themeColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {getFieldError('confirmPassword') && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{getFieldError('confirmPassword')}</Text>
              )}
            </View>

            {/* Password Requirements */}
            <View style={[styles.passwordRequirements, { backgroundColor: themeColors.surface }]}>
              <Text style={[styles.requirementsTitle, { color: themeColors.textSecondary }]}>Password requirements:</Text>
              <View style={styles.requirement}>
                <Ionicons
                  name={values.password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={values.password.length >= 8 ? COLORS.success : themeColors.textSecondary}
                />
                <Text style={[styles.requirementText, { color: themeColors.textSecondary }, values.password.length >= 8 && [styles.requirementMet, { color: themeColors.success }]]}>
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={/(?=.*[a-z])(?=.*[A-Z])/.test(values.password) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/(?=.*[a-z])(?=.*[A-Z])/.test(values.password) ? COLORS.success : themeColors.textSecondary}
                />
                <Text style={[styles.requirementText, { color: themeColors.textSecondary }, /(?=.*[a-z])(?=.*[A-Z])/.test(values.password) && [styles.requirementMet, { color: themeColors.success }]]}>
                  Upper and lowercase letters
                </Text>
              </View>
              <View style={styles.requirement}>
                <Ionicons
                  name={/(?=.*\d)/.test(values.password) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={/(?=.*\d)/.test(values.password) ? COLORS.success : themeColors.textSecondary}
                />
                <Text style={[styles.requirementText, { color: themeColors.textSecondary }, /(?=.*\d)/.test(values.password) && [styles.requirementMet, { color: themeColors.success }]]}>
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
                  <ActivityIndicator color={themeColors.textPrimary} size="small" />
                ) : (
                  <Text style={[styles.registerButtonText, { color: themeColors.textPrimary }]}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[styles.signInText, { color: themeColors.textSecondary }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={[styles.signInLink, { color: themeColors.primary }]}>Sign In</Text>
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
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
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
    borderRadius: SPACING.base,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
  },
  input: {
    flex: 1,
    marginLeft: SPACING.base,
    fontSize: FONT_SIZES.base,
  },
  passwordInput: {
    flex: 1,
  },
  passwordToggle: {
    padding: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  passwordRequirements: {
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    borderRadius: SPACING.base,
  },
  requirementsTitle: {
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
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
  },
  requirementMet: {
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
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: FONT_SIZES.base,
  },
  signInLink: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});

export default RegisterScreen;