/**
 * Form field validation utilities for candidate interest form.
 * Each validator returns an empty string if valid, or an error message string if invalid.
 */

const ALLOWED_DEPARTMENTS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Product',
  'Legal',
  'Support',
];

/**
 * Validates a candidate's full name.
 * @param {string} name - The full name to validate.
 * @returns {string} Empty string if valid, error message otherwise.
 */
export function validateName(name) {
  if (name === undefined || name === null) {
    return 'Full name is required.';
  }

  const trimmed = String(name).trim();

  if (trimmed.length === 0) {
    return 'Full name is required.';
  }

  if (trimmed.length > 100) {
    return 'Full name must not exceed 100 characters.';
  }

  const namePattern = /^[A-Za-z ]+$/;
  if (!namePattern.test(trimmed)) {
    return 'Full name must contain only alphabets and spaces.';
  }

  return '';
}

/**
 * Validates a candidate's email address.
 * @param {string} email - The email to validate.
 * @returns {string} Empty string if valid, error message otherwise.
 */
export function validateEmail(email) {
  if (email === undefined || email === null) {
    return 'Email is required.';
  }

  const trimmed = String(email).trim();

  if (trimmed.length === 0) {
    return 'Email is required.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) {
    return 'Please enter a valid email address.';
  }

  return '';
}

/**
 * Validates a candidate's mobile number.
 * @param {string} mobile - The mobile number to validate.
 * @returns {string} Empty string if valid, error message otherwise.
 */
export function validateMobile(mobile) {
  if (mobile === undefined || mobile === null) {
    return 'Mobile number is required.';
  }

  const trimmed = String(mobile).trim();

  if (trimmed.length === 0) {
    return 'Mobile number is required.';
  }

  const mobilePattern = /^\d{10}$/;
  if (!mobilePattern.test(trimmed)) {
    return 'Mobile number must be exactly 10 digits.';
  }

  return '';
}

/**
 * Validates a candidate's department selection.
 * @param {string} department - The department to validate.
 * @returns {string} Empty string if valid, error message otherwise.
 */
export function validateDepartment(department) {
  if (department === undefined || department === null) {
    return 'Department selection is required.';
  }

  const trimmed = String(department).trim();

  if (trimmed.length === 0) {
    return 'Department selection is required.';
  }

  if (!ALLOWED_DEPARTMENTS.includes(trimmed)) {
    return 'Please select a valid department.';
  }

  return '';
}

export { ALLOWED_DEPARTMENTS };