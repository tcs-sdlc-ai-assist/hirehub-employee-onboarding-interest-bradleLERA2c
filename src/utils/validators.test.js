import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
  ALLOWED_DEPARTMENTS,
} from './validators';

describe('validateName', () => {
  it('returns empty string for a valid name', () => {
    expect(validateName('John Doe')).toBe('');
  });

  it('returns empty string for a single valid name', () => {
    expect(validateName('Alice')).toBe('');
  });

  it('returns empty string for a name with multiple spaces', () => {
    expect(validateName('Mary Jane Watson')).toBe('');
  });

  it('returns error when name is empty string', () => {
    expect(validateName('')).toBe('Full name is required.');
  });

  it('returns error when name is only whitespace', () => {
    expect(validateName('   ')).toBe('Full name is required.');
  });

  it('returns error when name is undefined', () => {
    expect(validateName(undefined)).toBe('Full name is required.');
  });

  it('returns error when name is null', () => {
    expect(validateName(null)).toBe('Full name is required.');
  });

  it('returns error when name contains special characters', () => {
    expect(validateName('John@Doe')).toBe('Full name must contain only alphabets and spaces.');
  });

  it('returns error when name contains numbers', () => {
    expect(validateName('John123')).toBe('Full name must contain only alphabets and spaces.');
  });

  it('returns error when name contains hyphens', () => {
    expect(validateName('Mary-Jane')).toBe('Full name must contain only alphabets and spaces.');
  });

  it('returns error when name exceeds 100 characters', () => {
    const longName = 'A'.repeat(101);
    expect(validateName(longName)).toBe('Full name must not exceed 100 characters.');
  });

  it('returns empty string when name is exactly 100 characters', () => {
    const exactName = 'A'.repeat(100);
    expect(validateName(exactName)).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns empty string for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe('');
  });

  it('returns empty string for email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe('');
  });

  it('returns empty string for email with plus addressing', () => {
    expect(validateEmail('user+tag@example.com')).toBe('');
  });

  it('returns error when email is empty string', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  it('returns error when email is undefined', () => {
    expect(validateEmail(undefined)).toBe('Email is required.');
  });

  it('returns error when email is null', () => {
    expect(validateEmail(null)).toBe('Email is required.');
  });

  it('returns error when email has no @ symbol', () => {
    expect(validateEmail('userexample.com')).toBe('Please enter a valid email address.');
  });

  it('returns error when email has no domain', () => {
    expect(validateEmail('user@')).toBe('Please enter a valid email address.');
  });

  it('returns error when email has no local part', () => {
    expect(validateEmail('@example.com')).toBe('Please enter a valid email address.');
  });

  it('returns error when email has no TLD', () => {
    expect(validateEmail('user@example')).toBe('Please enter a valid email address.');
  });

  it('returns error when email contains spaces', () => {
    expect(validateEmail('user @example.com')).toBe('Please enter a valid email address.');
  });

  it('returns error when email is only whitespace', () => {
    expect(validateEmail('   ')).toBe('Email is required.');
  });
});

describe('validateMobile', () => {
  it('returns empty string for a valid 10-digit mobile number', () => {
    expect(validateMobile('1234567890')).toBe('');
  });

  it('returns empty string for another valid 10-digit number', () => {
    expect(validateMobile('9876543210')).toBe('');
  });

  it('returns error when mobile is empty string', () => {
    expect(validateMobile('')).toBe('Mobile number is required.');
  });

  it('returns error when mobile is undefined', () => {
    expect(validateMobile(undefined)).toBe('Mobile number is required.');
  });

  it('returns error when mobile is null', () => {
    expect(validateMobile(null)).toBe('Mobile number is required.');
  });

  it('returns error when mobile is too short (less than 10 digits)', () => {
    expect(validateMobile('12345')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile is 9 digits', () => {
    expect(validateMobile('123456789')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile is too long (more than 10 digits)', () => {
    expect(validateMobile('12345678901')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile contains non-numeric characters', () => {
    expect(validateMobile('12345abcde')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile contains special characters', () => {
    expect(validateMobile('+123456789')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile contains spaces', () => {
    expect(validateMobile('123 456 78')).toBe('Mobile number must be exactly 10 digits.');
  });

  it('returns error when mobile is only whitespace', () => {
    expect(validateMobile('   ')).toBe('Mobile number is required.');
  });
});

describe('validateDepartment', () => {
  it('returns empty string for each allowed department', () => {
    ALLOWED_DEPARTMENTS.forEach((dept) => {
      expect(validateDepartment(dept)).toBe('');
    });
  });

  it('returns empty string for Engineering', () => {
    expect(validateDepartment('Engineering')).toBe('');
  });

  it('returns empty string for Human Resources', () => {
    expect(validateDepartment('Human Resources')).toBe('');
  });

  it('returns error when department is empty string', () => {
    expect(validateDepartment('')).toBe('Department selection is required.');
  });

  it('returns error when department is undefined', () => {
    expect(validateDepartment(undefined)).toBe('Department selection is required.');
  });

  it('returns error when department is null', () => {
    expect(validateDepartment(null)).toBe('Department selection is required.');
  });

  it('returns error when department is only whitespace', () => {
    expect(validateDepartment('   ')).toBe('Department selection is required.');
  });

  it('returns error for an invalid department name', () => {
    expect(validateDepartment('Accounting')).toBe('Please select a valid department.');
  });

  it('returns error for a department with wrong casing', () => {
    expect(validateDepartment('engineering')).toBe('Please select a valid department.');
  });

  it('returns error for a department with extra whitespace around valid name', () => {
    expect(validateDepartment(' Engineering ')).toBe('Please select a valid department.');
  });
});