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

const LoginScreen = ({ navigation }) => {
  const { signIn, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const themeColors = getThemeColors(isDarkMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    getFieldError,
    isValid,
  } = useFormValidation(
    { email: '', password: '' },
    validationSchemas.login
  );

  const handleLogin = async () => {
    if (!isValid) {
      Alert.alert('Validation Error', 'Please fix the form errors before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signIn(values.email, values.password);
      
      if (!result.success) {
        Alert.alert('Login Failed', result.error || 'Invalid email or password.');
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
            <Text style={[styles.logo, { color: themeColors.primary }]}>StreamBox</Text>
            <Text style={[styles.tagline, { color: themeColors.textSecondary }]}>Your entertainment universe</Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: themeColors.textPrimary }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Sign in to continue your entertainment journey</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.surface }, getFieldError('email') && styles.inputError]}>
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
              <View style={[styles.inputWrapper, { backgroundColor: themeColors.surface }, getFieldError('password') && styles.inputError]}>
                <Feather name="lock" size={20} color={themeColors.textSecondary} />
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
                  <Feather 
                    name={showPassword ? 'eye-off' : 'eye'} 
                    size={20} 
                    color={themeColors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
              {getFieldError('password') && (
                <Text style={[styles.errorText, { color: themeColors.error }]}>{getFieldError('password')}</Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: themeColors.primary }]}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, (!isValid || isSubmitting) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={!isValid || isSubmitting}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.loginButtonGradient}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>



            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: themeColors.textSecondary }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.signUpLink, { color: themeColors.primary }]}>Sign Up</Text>
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
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  logo: {
    fontSize: FONT_SIZES['4xl'],
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: FONT_SIZES['2xl'],
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
    marginBottom: SPACING['2xl'],
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
    borderColor: COLORS.error,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZES.sm,
  },
  loginButton: {
    marginBottom: SPACING.xl,
    borderRadius: SPACING.base,
    overflow: 'hidden',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  loginButtonText: {
    color: '#000',
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },

  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.base,
  },
  signUpLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },
});

export default LoginScreen;