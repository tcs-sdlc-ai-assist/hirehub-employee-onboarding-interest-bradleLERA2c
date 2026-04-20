import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validateMobile, validateDepartment } from '../utils/validators';
import { addSubmission, isEmailDuplicate } from '../utils/storage';

const DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
];

const initialFormState = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

const initialErrorState = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

const styles = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '48px 24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    maxWidth: '560px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    padding: '40px 32px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#3b82f6',
    textDecoration: 'none',
    marginBottom: '24px',
    transition: 'color 0.15s ease',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: '0 0 32px 0',
    lineHeight: 1.5,
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
  inputError: {
    borderColor: '#dc2626',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
  },
  inputErrorFocus: {
    borderColor: '#dc2626',
    boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.15)',
  },
  select: {
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
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: '40px',
  },
  errorText: {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '4px',
  },
  submitButton: {
    width: '100%',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    marginTop: '8px',
  },
  submitButtonHover: {
    backgroundColor: '#2563eb',
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '24px',
    backgroundColor: '#d1fae5',
    color: '#047857',
    border: '1px solid #a7f3d0',
    animation: 'slideDown 0.25s ease',
  },
  bannerIcon: {
    flexShrink: 0,
    fontSize: '1.25rem',
    lineHeight: 1,
  },
  bannerContent: {
    flex: 1,
  },
  bannerStrong: {
    display: 'block',
    marginBottom: '2px',
    fontWeight: 600,
  },
};

export default function InterestForm() {
  const [formData, setFormData] = useState({ ...initialFormState });
  const [errors, setErrors] = useState({ ...initialErrorState });
  const [successVisible, setSuccessVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    let timer;
    if (successVisible) {
      timer = setTimeout(() => {
        setSuccessVisible(false);
      }, 4000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successVisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFocus = (e) => {
    setFocusedField(e.target.name);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
      department: validateDepartment(formData.department),
    };

    if (!newErrors.email && formData.email.trim()) {
      if (isEmailDuplicate(formData.email.trim())) {
        newErrors.email = 'This email has already been submitted.';
      }
    }

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.email && !newErrors.mobile && !newErrors.department;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessVisible(false);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const success = addSubmission({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      department: formData.department.trim(),
    });

    if (success) {
      setFormData({ ...initialFormState });
      setErrors({ ...initialErrorState });
      setSuccessVisible(true);
    } else {
      setErrors((prev) => ({
        ...prev,
        email: 'This email has already been submitted.',
      }));
    }

    setSubmitting(false);
  };

  const getInputStyle = (fieldName) => {
    const hasError = !!errors[fieldName];
    const isFocused = focusedField === fieldName;
    const baseStyle = fieldName === 'department' ? styles.select : styles.input;

    let computedStyle = { ...baseStyle };

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
      <div style={styles.container}>
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>

        <h1 style={styles.heading}>Express Your Interest</h1>
        <p style={styles.subtitle}>
          Fill out the form below to let us know you are interested in joining our team.
          We will review your submission and get back to you soon.
        </p>

        {successVisible && (
          <div style={styles.successBanner} role="alert">
            <span style={styles.bannerIcon}>✅</span>
            <div style={styles.bannerContent}>
              <strong style={styles.bannerStrong}>Submission Successful!</strong>
              Your interest has been recorded. We will be in touch shortly.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div style={styles.formGroup}>
            <label htmlFor="fullName" style={styles.label}>
              Full Name<span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Enter your full name"
              style={getInputStyle('fullName')}
              autoComplete="name"
            />
            {errors.fullName && (
              <div style={styles.errorText} role="alert">
                {errors.fullName}
              </div>
            )}
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email<span style={styles.required}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              style={getInputStyle('email')}
              autoComplete="email"
            />
            {errors.email && (
              <div style={styles.errorText} role="alert">
                {errors.email}
              </div>
            )}
          </div>

          {/* Mobile Number */}
          <div style={styles.formGroup}>
            <label htmlFor="mobile" style={styles.label}>
              Mobile Number<span style={styles.required}>*</span>
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Enter your 10-digit mobile number"
              style={getInputStyle('mobile')}
              autoComplete="tel"
            />
            {errors.mobile && (
              <div style={styles.errorText} role="alert">
                {errors.mobile}
              </div>
            )}
          </div>

          {/* Department */}
          <div style={styles.formGroup}>
            <label htmlFor="department" style={styles.label}>
              Department of Interest<span style={styles.required}>*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={getInputStyle('department')}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <div style={styles.errorText} role="alert">
                {errors.department}
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
                e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor;
              }
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Interest'}
          </button>
        </form>
      </div>
    </div>
  );
}