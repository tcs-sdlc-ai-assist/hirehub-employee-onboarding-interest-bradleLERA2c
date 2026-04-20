import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../hooks/useSession';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

const styles = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow:
      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    padding: '40px 32px',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '8px',
  },
  logoIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    fontSize: '1.75rem',
    marginBottom: '16px',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 4px 0',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textAlign: 'center',
    margin: '0 0 32px 0',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
  },
  required: {
    color: '#dc2626',
    marginLeft: '2px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '15px',
    color: '#111827',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  inputErrorFocus: {
    borderColor: '#dc2626',
    boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.15)',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    animation: 'slideDown 0.25s ease',
  },
  errorBannerIcon: {
    flexShrink: 0,
    fontSize: '1.1rem',
    lineHeight: 1,
  },
  submitButton: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    marginTop: '8px',
  },
  submitButtonHover: {
    backgroundColor: '#1d4ed8',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  fieldError: {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '4px',
  },
  hint: {
    fontSize: '12px',
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: '24px',
    lineHeight: 1.5,
  },
};

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login } = useSession();
  const navigate = useNavigate();

  const validateFields = () => {
    const newFieldErrors = { username: '', password: '' };
    let valid = true;

    if (!username.trim()) {
      newFieldErrors.username = 'Username is required.';
      valid = false;
    }

    if (!password) {
      newFieldErrors.password = 'Password is required.';
      valid = false;
    }

    setFieldErrors(newFieldErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateFields()) {
      return;
    }

    setSubmitting(true);

    const trimmedUsername = username.trim();

    if (trimmedUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      login();
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid username or password. Please try again.');
    }

    setSubmitting(false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (fieldErrors.username) {
      setFieldErrors((prev) => ({ ...prev, username: '' }));
    }
    if (error) {
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
    if (error) {
      setError('');
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const getInputStyle = (fieldName) => {
    const hasError = fieldName === 'username' ? !!fieldErrors.username : !!fieldErrors.password;
    const isFocused = focusedField === fieldName;

    let computedStyle = { ...styles.input };

    if (hasError) {
      computedStyle = { ...computedStyle, ...styles.inputError };
      if (isFocused) {
        computedStyle = { ...computedStyle, ...styles.inputErrorFocus };
      }
    } else if (isFocused) {
      computedStyle = { ...computedStyle, ...styles.inputFocus };
    }

    return computedStyle;
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>🔒</div>
        </div>

        <h1 style={styles.heading}>Admin Login</h1>
        <p style={styles.subtitle}>
          Sign in to access the admin dashboard
        </p>

        {error && (
          <div style={styles.errorBanner} role="alert">
            <span style={styles.errorBannerIcon}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={styles.formGroup}>
            <label htmlFor="admin-username" style={styles.label}>
              Username<span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="admin-username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              onFocus={() => handleFocus('username')}
              onBlur={handleBlur}
              placeholder="Enter your username"
              style={getInputStyle('username')}
              autoComplete="username"
            />
            {fieldErrors.username && (
              <div style={styles.fieldError} role="alert">
                {fieldErrors.username}
              </div>
            )}
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label htmlFor="admin-password" style={styles.label}>
              Password<span style={styles.required}>*</span>
            </label>
            <input
              type="password"
              id="admin-password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              placeholder="Enter your password"
              style={getInputStyle('password')}
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <div style={styles.fieldError} role="alert">
                {fieldErrors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.submitButton,
              ...(submitting ? styles.submitButtonDisabled : {}),
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor =
                  styles.submitButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor =
                  styles.submitButton.backgroundColor;
              }
            }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.hint}>
          Demo credentials: <strong>admin</strong> / <strong>admin</strong>
        </p>
      </div>
    </div>
  );
}

AdminLogin.propTypes = {
  onLoginSuccess: PropTypes.func,
};