import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import * as storage from '../utils/storage';
import * as sessionHook from '../hooks/useSession';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../utils/storage', () => ({
  getSubmissions: vi.fn(),
  updateSubmission: vi.fn(),
  deleteSubmission: vi.fn(),
}));

vi.mock('../hooks/useSession', () => ({
  useSession: vi.fn(),
}));

const mockLogout = vi.fn();

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
}

const sampleSubmissions = [
  {
    id: 'id-1',
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    mobile: '1234567890',
    department: 'Engineering',
    submittedAt: '2024-06-10T10:00:00.000Z',
  },
  {
    id: 'id-2',
    fullName: 'Bob Smith',
    email: 'bob@example.com',
    mobile: '9876543210',
    department: 'Design',
    submittedAt: '2024-06-12T14:30:00.000Z',
  },
  {
    id: 'id-3',
    fullName: 'Carol White',
    email: 'carol@example.com',
    mobile: '5551234567',
    department: 'Engineering',
    submittedAt: '2024-06-15T09:15:00.000Z',
  },
];

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockLogout.mockReset();
    sessionHook.useSession.mockReturnValue({
      isAuthenticated: true,
      login: vi.fn(),
      logout: mockLogout,
    });
    storage.getSubmissions.mockReturnValue([]);
    storage.updateSubmission.mockReturnValue(true);
    storage.deleteSubmission.mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the dashboard header with title and logout button', () => {
      renderDashboard();

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
    });

    it('renders stat cards with correct values when submissions exist', () => {
      storage.getSubmissions.mockReturnValue(sampleSubmissions);

      renderDashboard();

      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      expect(screen.getByText('Unique Departments')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();

      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
      expect(screen.getByText('Jun 15, 2024')).toBeInTheDocument();
    });

    it('renders stat cards with zero and N/A when no submissions exist', () => {
      storage.getSubmissions.mockReturnValue([]);

      renderDashboard();

      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();

      expect(screen.getByText('Unique Departments')).toBeInTheDocument();

      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
      const latestValues = screen.getAllByText('N/A');
      expect(latestValues.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the All Submissions table header', () => {
      renderDashboard();

      expect(screen.getByText('All Submissions')).toBeInTheDocument();
    });
  });

  describe('table display', () => {
    it('displays submissions in the table', () => {
      storage.getSubmissions.mockReturnValue(sampleSubmissions);

      renderDashboard();

      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();

      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();

      expect(screen.getByText('Carol White')).toBeInTheDocument();
      expect(screen.getByText('carol@example.com')).toBeInTheDocument();
    });

    it('displays empty state when no submissions exist', () => {
      storage.getSubmissions.mockReturnValue([]);

      renderDashboard();

      expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
    });

    it('renders edit and delete buttons for each submission', () => {
      storage.getSubmissions.mockReturnValue(sampleSubmissions);

      renderDashboard();

      const editButtons = screen.getAllByRole('button', { name: /Edit submission for/i });
      expect(editButtons).toHaveLength(3);

      const deleteButtons = screen.getAllByRole('button', { name: /Delete submission for/i });
      expect(deleteButtons).toHaveLength(3);
    });
  });

  describe('edit modal', () => {
    it('opens edit modal with pre-filled data when edit button is clicked', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);

      renderDashboard();

      const editButton = screen.getByRole('button', { name: /Edit submission for Alice Johnson/i });
      await user.click(editButton);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const nameInput = screen.getByLabelText(/Full Name/);
      expect(nameInput).toHaveValue('Alice Johnson');

      const emailInput = screen.getByLabelText(/Email/);
      expect(emailInput).toHaveValue('alice@example.com');
      expect(emailInput).toBeDisabled();

      const mobileInput = screen.getByLabelText(/Mobile/);
      expect(mobileInput).toHaveValue('1234567890');
    });

    it('closes edit modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);

      renderDashboard();

      const editButton = screen.getByRole('button', { name: /Edit submission for Alice Johnson/i });
      await user.click(editButton);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('saves changes and shows success banner when edit is submitted', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);
      storage.updateSubmission.mockReturnValue(true);

      renderDashboard();

      const editButton = screen.getByRole('button', { name: /Edit submission for Alice Johnson/i });
      await user.click(editButton);

      const nameInput = screen.getByLabelText(/Full Name/);
      await user.clear(nameInput);
      await user.type(nameInput, 'Alice Updated');

      const saveButton = screen.getByRole('button', { name: /Save Changes/i });
      await user.click(saveButton);

      expect(storage.updateSubmission).toHaveBeenCalledWith('id-1', {
        fullName: 'Alice Updated',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(screen.getByText('Submission updated successfully.')).toBeInTheDocument();
      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('shows error banner when update fails', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);
      storage.updateSubmission.mockReturnValue(false);

      renderDashboard();

      const editButton = screen.getByRole('button', { name: /Edit submission for Alice Johnson/i });
      await user.click(editButton);

      const saveButton = screen.getByRole('button', { name: /Save Changes/i });
      await user.click(saveButton);

      expect(screen.getByText('Failed to update submission. Please try again.')).toBeInTheDocument();
    });

    it('closes edit modal when close button (X) is clicked', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);

      renderDashboard();

      const editButton = screen.getByRole('button', { name: /Edit submission for Bob Smith/i });
      await user.click(editButton);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const closeButton = screen.getByRole('button', { name: /Close modal/i });
      await user.click(closeButton);

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });
  });

  describe('delete confirmation flow', () => {
    it('calls deleteSubmission and shows success banner when confirmed', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);
      storage.deleteSubmission.mockReturnValue(true);

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      renderDashboard();

      const deleteButton = screen.getByRole('button', { name: /Delete submission for Alice Johnson/i });
      await user.click(deleteButton);

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to delete the submission for "Alice Johnson"? This action cannot be undone.'
      );
      expect(storage.deleteSubmission).toHaveBeenCalledWith('id-1');
      expect(screen.getByText('Submission deleted successfully.')).toBeInTheDocument();

      confirmSpy.mockRestore();
    });

    it('does not delete when confirmation is cancelled', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      renderDashboard();

      const deleteButton = screen.getByRole('button', { name: /Delete submission for Bob Smith/i });
      await user.click(deleteButton);

      expect(confirmSpy).toHaveBeenCalled();
      expect(storage.deleteSubmission).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('shows error banner when delete fails', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);
      storage.deleteSubmission.mockReturnValue(false);

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      renderDashboard();

      const deleteButton = screen.getByRole('button', { name: /Delete submission for Alice Johnson/i });
      await user.click(deleteButton);

      expect(screen.getByText('Failed to delete submission. Please try again.')).toBeInTheDocument();

      confirmSpy.mockRestore();
    });
  });

  describe('logout functionality', () => {
    it('calls logout and navigates to /admin when logout button is clicked', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue([]);

      renderDashboard();

      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      await user.click(logoutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  describe('banner dismiss', () => {
    it('dismisses the success banner when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);
      storage.deleteSubmission.mockReturnValue(true);

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      renderDashboard();

      const deleteButton = screen.getByRole('button', { name: /Delete submission for Alice Johnson/i });
      await user.click(deleteButton);

      expect(screen.getByText('Submission deleted successfully.')).toBeInTheDocument();

      const dismissButton = screen.getByRole('button', { name: /Dismiss notification/i });
      await user.click(dismissButton);

      expect(screen.queryByText('Submission deleted successfully.')).not.toBeInTheDocument();

      confirmSpy.mockRestore();
    });

    it('auto-dismisses the banner after timeout', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      storage.getSubmissions.mockReturnValue(sampleSubmissions);
      storage.deleteSubmission.mockReturnValue(true);

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      renderDashboard();

      const deleteButton = screen.getByRole('button', { name: /Delete submission for Alice Johnson/i });
      await user.click(deleteButton);

      expect(screen.getByText('Submission deleted successfully.')).toBeInTheDocument();

      vi.advanceTimersByTime(4100);

      await waitFor(() => {
        expect(screen.queryByText('Submission deleted successfully.')).not.toBeInTheDocument();
      });

      confirmSpy.mockRestore();
      vi.useRealTimers();
    });
  });

  describe('data reload', () => {
    it('reloads submissions after a successful edit', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);
      storage.updateSubmission.mockReturnValue(true);

      renderDashboard();

      // getSubmissions called once on mount
      expect(storage.getSubmissions).toHaveBeenCalledTimes(1);

      const editButton = screen.getByRole('button', { name: /Edit submission for Alice Johnson/i });
      await user.click(editButton);

      const saveButton = screen.getByRole('button', { name: /Save Changes/i });
      await user.click(saveButton);

      // getSubmissions called again after save
      expect(storage.getSubmissions).toHaveBeenCalledTimes(2);
    });

    it('reloads submissions after a successful delete', async () => {
      const user = userEvent.setup();
      storage.getSubmissions.mockReturnValue(sampleSubmissions);
      storage.deleteSubmission.mockReturnValue(true);

      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      renderDashboard();

      expect(storage.getSubmissions).toHaveBeenCalledTimes(1);

      const deleteButton = screen.getByRole('button', { name: /Delete submission for Bob Smith/i });
      await user.click(deleteButton);

      expect(storage.getSubmissions).toHaveBeenCalledTimes(2);

      confirmSpy.mockRestore();
    });
  });
});