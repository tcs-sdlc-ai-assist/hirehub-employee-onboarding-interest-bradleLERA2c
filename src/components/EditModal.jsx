import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { validateName, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators';

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
  padding: '16px',
  animation: 'fadeIn 150ms ease',
};

const modalStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '560px',
  maxHeight: '90vh',
  overflowY: 'auto',
  animation: 'slideUp 250ms ease',
};

const modalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 24px',
  borderBottom: '1px solid #e5e7eb',
};

const modalHeaderTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#111827',
  margin: 0,
};

const modalCloseStyle = {
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '6px',
  color: '#9ca3af',
  fontSize: '1.25rem',
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  transition: 'background-color 150ms ease, color 150ms ease',
};

const modalBodyStyle = {
  padding: '24px',
};

const modalFooterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '12px',
  padding: '16px 24px',
  borderTop: '1px solid #e5e7eb',
};

const formGroupStyle = {
  marginBottom: '16px',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '4px',
};

const requiredStyle = {
  color: '#dc2626',
  marginLeft: '2px',
};

const inputStyle = {
  width: '100%',
  padding: '8px 16px',
  fontSize: '1rem',
  color: '#1f2937',
  backgroundColor: '#ffffff',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  boxSizing: 'border-box',
};

const inputErrorStyle = {
  ...inputStyle,
  borderColor: '#dc2626',
};

const inputDisabledStyle = {
  ...inputStyle,
  backgroundColor: '#f3f4f6',
  color: '#6b7280',
  cursor: 'not-allowed',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: '40px',
};

const selectErrorStyle = {
  ...selectStyle,
  borderColor: '#dc2626',
};

const errorTextStyle = {
  fontSize: '0.75rem',
  color: '#dc2626',
  marginTop: '4px',
};

const hintTextStyle = {
  fontSize: '0.75rem',
  color: '#9ca3af',
  marginTop: '4px',
};

const cancelButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 24px',
  fontSize: '0.875rem',
  fontWeight: 600,
  borderRadius: '8px',
  border: '2px solid #d1d5db',
  backgroundColor: 'transparent',
  color: '#4b5563',
  cursor: 'pointer',
  transition: 'all 150ms ease',
};

const saveButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 24px',
  fontSize: '0.875rem',
  fontWeight: 600,
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  cursor: 'pointer',
  transition: 'all 150ms ease',
};

const saveButtonDisabledStyle = {
  ...saveButtonStyle,
  opacity: 0.6,
  cursor: 'not-allowed',
};

export function EditModal({ submission, onSave, onClose }) {
  const [fullName, setFullName] = useState(submission.fullName || '');
  const [mobile, setMobile] = useState(submission.mobile || '');
  const [department, setDepartment] = useState(submission.department || '');
  const [errors, setErrors] = useState({ fullName: '', mobile: '', department: '' });
  const [touched, setTouched] = useState({ fullName: false, mobile: false, department: false });

  useEffect(() => {
    setFullName(submission.fullName || '');
    setMobile(submission.mobile || '');
    setDepartment(submission.department || '');
    setErrors({ fullName: '', mobile: '', department: '' });
    setTouched({ fullName: false, mobile: false, department: false });
  }, [submission]);

  const validateField = useCallback((field, value) => {
    switch (field) {
      case 'fullName':
        return validateName(value);
      case 'mobile':
        return validateMobile(value);
      case 'department':
        return validateDepartment(value);
      default:
        return '';
    }
  }, []);

  const validateAll = useCallback(() => {
    const nameError = validateName(fullName);
    const mobileError = validateMobile(mobile);
    const deptError = validateDepartment(department);
    const newErrors = {
      fullName: nameError,
      mobile: mobileError,
      department: deptError,
    };
    setErrors(newErrors);
    setTouched({ fullName: true, mobile: true, department: true });
    return !nameError && !mobileError && !deptError;
  }, [fullName, mobile, department]);

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'fullName':
        setFullName(value);
        break;
      case 'mobile':
        setMobile(value);
        break;
      case 'department':
        setDepartment(value);
        break;
      default:
        break;
    }
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let value;
    switch (field) {
      case 'fullName':
        value = fullName;
        break;
      case 'mobile':
        value = mobile;
        break;
      case 'department':
        value = department;
        break;
      default:
        return;
    }
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSave = () => {
    if (!validateAll()) {
      return;
    }
    onSave({
      id: submission.id,
      fullName: fullName.trim(),
      email: submission.email,
      mobile: mobile.trim(),
      department: department.trim(),
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const hasErrors = !!(errors.fullName || errors.mobile || errors.department);

  return (
    <div
      style={overlayStyle}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Edit submission"
    >
      <div style={modalStyle}>
        <div style={modalHeaderStyle}>
          <h2 style={modalHeaderTitleStyle}>Edit Submission</h2>
          <button
            type="button"
            style={modalCloseStyle}
            onClick={onClose}
            aria-label="Close modal"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9ca3af';
            }}
          >
            ✕
          </button>
        </div>

        <div style={modalBodyStyle}>
          {/* Full Name */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="edit-fullName">
              Full Name<span style={requiredStyle}>*</span>
            </label>
            <input
              id="edit-fullName"
              type="text"
              style={touched.fullName && errors.fullName ? inputErrorStyle : inputStyle}
              value={fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="Enter full name"
              autoComplete="name"
            />
            {touched.fullName && errors.fullName && (
              <div style={errorTextStyle}>{errors.fullName}</div>
            )}
          </div>

          {/* Email (read-only) */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="edit-email">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              style={inputDisabledStyle}
              value={submission.email || ''}
              disabled
              readOnly
              aria-readonly="true"
            />
            <div style={hintTextStyle}>Email cannot be changed.</div>
          </div>

          {/* Mobile */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="edit-mobile">
              Mobile<span style={requiredStyle}>*</span>
            </label>
            <input
              id="edit-mobile"
              type="tel"
              style={touched.mobile && errors.mobile ? inputErrorStyle : inputStyle}
              value={mobile}
              onChange={(e) => handleFieldChange('mobile', e.target.value)}
              onBlur={() => handleBlur('mobile')}
              placeholder="Enter 10-digit mobile number"
              autoComplete="tel"
              maxLength={10}
            />
            {touched.mobile && errors.mobile && (
              <div style={errorTextStyle}>{errors.mobile}</div>
            )}
          </div>

          {/* Department */}
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="edit-department">
              Department<span style={requiredStyle}>*</span>
            </label>
            <select
              id="edit-department"
              style={touched.department && errors.department ? selectErrorStyle : selectStyle}
              value={department}
              onChange={(e) => handleFieldChange('department', e.target.value)}
              onBlur={() => handleBlur('department')}
            >
              <option value="">Select a department</option>
              {ALLOWED_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {touched.department && errors.department && (
              <div style={errorTextStyle}>{errors.department}</div>
            )}
          </div>
        </div>

        <div style={modalFooterStyle}>
          <button
            type="button"
            style={cancelButtonStyle}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#1f2937';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#4b5563';
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            style={hasErrors ? saveButtonDisabledStyle : saveButtonStyle}
            onClick={handleSave}
            onMouseEnter={(e) => {
              if (!hasErrors) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseLeave={(e) => {
              if (!hasErrors) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string,
    fullName: PropTypes.string,
    email: PropTypes.string,
    mobile: PropTypes.string,
    department: PropTypes.string,
    submittedAt: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EditModal;