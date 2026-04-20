import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InterestForm from './InterestForm';
import * as storage from '../utils/storage';

vi.mock('../utils/storage', () => ({
  addSubmission: vi.fn(),
  isEmailDuplicate: vi.fn(),
}));

function renderInterestForm() {
  return render(
    <MemoryRouter>
      <InterestForm />
    </MemoryRouter>
  );
}

describe('InterestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.addSubmission.mockReturnValue(true);
    storage.isEmailDuplicate.mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the form heading and subtitle', () => {
      renderInterestForm();

      expect(screen.getByText('Express Your Interest')).toBeInTheDocument();
      expect(
        screen.getByText(/Fill out the form below to let us know you are interested/)
      ).toBeInTheDocument();
    });

    it('renders all form fields with labels', () => {
      renderInterestForm();

      expect(screen.getByLabelText(/Full Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mobile Number/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Department of Interest/)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderInterestForm();

      expect(screen.getByRole('button', { name: /Submit Interest/i })).toBeInTheDocument();
    });

    it('renders the Back to Home link', () => {
      renderInterestForm();

      const backLink = screen.getByText(/Back to Home/);
      expect(backLink).toBeInTheDocument();
      expect(backLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('renders department select with placeholder option and all departments', () => {
      renderInterestForm();

      const select = screen.getByLabelText(/Department of Interest/);
      expect(select).toBeInTheDocument();

      const options = select.querySelectorAll('option');
      expect(options.length).toBe(7); // placeholder + 6 departments
      expect(options[0].textContent).toBe('Select a department');
      expect(options[1].textContent).toBe('Engineering');
      expect(options[2].textContent).toBe('Design');
      expect(options[3].textContent).toBe('Marketing');
      expect(options[4].textContent).toBe('Sales');
      expect(options[5].textContent).toBe('Human Resources');
      expect(options[6].textContent).toBe('Finance');
    });
  });

  describe('field validation error display', () => {
    it('shows validation errors when submitting empty form', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      const submitButton = screen.getByRole('button', { name: /Submit Interest/i });
      await user.click(submitButton);

      expect(screen.getByText('Full name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Mobile number is required.')).toBeInTheDocument();
      expect(screen.getByText('Department selection is required.')).toBeInTheDocument();
    });

    it('shows error for invalid name with special characters', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'John@Doe');
      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Full name must contain only alphabets and spaces.')).toBeInTheDocument();
    });

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Email/), 'notanemail');
      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });

    it('shows error for mobile number with less than 10 digits', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Mobile Number/), '12345');
      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Mobile number must be exactly 10 digits.')).toBeInTheDocument();
    });

    it('shows error for mobile number with non-numeric characters', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Mobile Number/), '12345abcde');
      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Mobile number must be exactly 10 digits.')).toBeInTheDocument();
    });

    it('clears field error when user starts typing in that field', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));
      expect(screen.getByText('Full name is required.')).toBeInTheDocument();

      await user.type(screen.getByLabelText(/Full Name/), 'J');

      expect(screen.queryByText('Full name is required.')).not.toBeInTheDocument();
    });
  });

  describe('duplicate email error', () => {
    it('shows duplicate email error when email already exists', async () => {
      const user = userEvent.setup();
      storage.isEmailDuplicate.mockReturnValue(true);

      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Engineering');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('This email has already been submitted.')).toBeInTheDocument();
      expect(storage.addSubmission).not.toHaveBeenCalled();
    });

    it('shows duplicate email error when addSubmission returns false', async () => {
      const user = userEvent.setup();
      storage.isEmailDuplicate.mockReturnValue(false);
      storage.addSubmission.mockReturnValue(false);

      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Engineering');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('This email has already been submitted.')).toBeInTheDocument();
    });
  });

  describe('successful submission flow', () => {
    it('calls addSubmission with correct data on valid form submission', async () => {
      const user = userEvent.setup();
      storage.addSubmission.mockReturnValue(true);

      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Design');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(storage.addSubmission).toHaveBeenCalledWith({
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '9876543210',
        department: 'Design',
      });
    });

    it('displays success banner after successful submission', async () => {
      const user = userEvent.setup();
      storage.addSubmission.mockReturnValue(true);

      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Design');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Submission Successful!')).toBeInTheDocument();
      expect(screen.getByText(/Your interest has been recorded/)).toBeInTheDocument();
    });

    it('clears all form fields after successful submission', async () => {
      const user = userEvent.setup();
      storage.addSubmission.mockReturnValue(true);

      renderInterestForm();

      const nameInput = screen.getByLabelText(/Full Name/);
      const emailInput = screen.getByLabelText(/Email/);
      const mobileInput = screen.getByLabelText(/Mobile Number/);
      const departmentSelect = screen.getByLabelText(/Department of Interest/);

      await user.type(nameInput, 'Jane Smith');
      await user.type(emailInput, 'jane@example.com');
      await user.type(mobileInput, '9876543210');
      await user.selectOptions(departmentSelect, 'Design');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(mobileInput).toHaveValue('');
      expect(departmentSelect).toHaveValue('');
    });
  });

  describe('success banner auto-dismiss', () => {
    it('auto-dismisses the success banner after timeout', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      storage.addSubmission.mockReturnValue(true);

      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Design');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Submission Successful!')).toBeInTheDocument();

      vi.advanceTimersByTime(4100);

      await waitFor(() => {
        expect(screen.queryByText('Submission Successful!')).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('form does not submit with validation errors', () => {
    it('does not call addSubmission when form has validation errors', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'John123');
      await user.type(screen.getByLabelText(/Email/), 'invalid');
      await user.type(screen.getByLabelText(/Mobile Number/), '123');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(storage.addSubmission).not.toHaveBeenCalled();
      expect(screen.queryByText('Submission Successful!')).not.toBeInTheDocument();
    });
  });
});