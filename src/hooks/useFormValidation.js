import { useState, useEffect } from 'react';
import * as Yup from 'yup';

// Custom hook for form validation using Yup
export const useFormValidation = (initialValues, validationSchema) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Validate form whenever values change
  useEffect(() => {
    validateForm();
  }, [values]);

  const validateForm = async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      setIsValid(true);
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      setIsValid(false);
    }
  };

  const validateField = async (fieldName, value) => {
    try {
      await validationSchema.validateAt(fieldName, { [fieldName]: value });
      setErrors(prev => ({ ...prev, [fieldName]: undefined }));
    } catch (err) {
      setErrors(prev => ({ ...prev, [fieldName]: err.message }));
    }
  };

  const handleChange = (fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    validateField(fieldName, value);
  };

  const handleBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsValid(false);
  };

  const setFieldError = (fieldName, error) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : null;
  };

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    resetForm,
    setFieldError,
    getFieldError,
    validateForm,
  };
};

// Predefined validation schemas
export const validationSchemas = {
  login: Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  }),

  register: Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Full name is required'),
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .required('Username is required'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      )
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  }),

  forgotPassword: Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
  }),

  profile: Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Full name is required'),
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username must be less than 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .required('Username is required'),
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
  }),
};

// Custom hook for input field state management
export const useInput = (initialValue = '', validator = null) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const validate = (inputValue) => {
    if (validator) {
      try {
        validator(inputValue);
        setError('');
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      }
    }
    return true;
  };

  const onChange = (newValue) => {
    setValue(newValue);
    if (touched) {
      validate(newValue);
    }
  };

  const onBlur = () => {
    setTouched(true);
    validate(value);
  };

  const reset = () => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  };

  return {
    value,
    error: touched ? error : '',
    touched,
    onChange,
    onBlur,
    reset,
    isValid: !error && touched,
  };
};

// Email validation helper
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    throw new Error('Email is required');
  }
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address');
  }
};

// Password validation helper
export const validatePassword = (password) => {
  if (!password) {
    throw new Error('Password is required');
  }
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!/(?=.*[a-z])/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/(?=.*\d)/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
};

// Username validation helper
export const validateUsername = (username) => {
  if (!username) {
    throw new Error('Username is required');
  }
  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }
  if (username.length > 20) {
    throw new Error('Username must be less than 20 characters');
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }
};