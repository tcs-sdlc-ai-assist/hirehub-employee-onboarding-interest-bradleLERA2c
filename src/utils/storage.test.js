import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
} from './storage';

describe('storage utilities', () => {
  let store;

  beforeEach(() => {
    store = {};

    const localStorageMock = {
      getItem: vi.fn((key) => {
        return key in store ? store[key] : null;
      }),
      setItem: vi.fn((key, value) => {
        store[key] = String(value);
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });

    // Mock crypto.randomUUID for deterministic ids
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'test-uuid-1234'),
    });
  });

  describe('getSubmissions', () => {
    it('returns an empty array when localStorage has no data', () => {
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem).toHaveBeenCalledWith('hirehub_submissions');
    });

    it('returns parsed submissions when localStorage has valid data', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-01-15T10:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(submissions);

      const result = getSubmissions();
      expect(result).toEqual(submissions);
    });

    it('returns an empty array and resets storage when data is corrupted JSON', () => {
      store['hirehub_submissions'] = '{not valid json!!!';

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = getSubmissions();

      expect(result).toEqual([]);
      expect(store['hirehub_submissions']).toBe('[]');
      warnSpy.mockRestore();
    });

    it('returns an empty array and resets storage when data is not an array', () => {
      store['hirehub_submissions'] = JSON.stringify({ foo: 'bar' });

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = getSubmissions();

      expect(result).toEqual([]);
      expect(store['hirehub_submissions']).toBe('[]');
      warnSpy.mockRestore();
    });

    it('returns an empty array when localStorage.getItem throws', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = getSubmissions();

      expect(result).toEqual([]);
      warnSpy.mockRestore();
    });
  });

  describe('saveSubmissions', () => {
    it('writes the submissions array to localStorage as JSON', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          mobile: '9876543210',
          department: 'Design',
          submittedAt: '2024-01-15T12:00:00.000Z',
        },
      ];

      saveSubmissions(submissions);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'hirehub_submissions',
        JSON.stringify(submissions)
      );
      expect(store['hirehub_submissions']).toBe(JSON.stringify(submissions));
    });

    it('handles empty array correctly', () => {
      saveSubmissions([]);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'hirehub_submissions',
        '[]'
      );
    });

    it('does not throw when localStorage.setItem fails', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(() => saveSubmissions([{ id: '1' }])).not.toThrow();
      warnSpy.mockRestore();
    });
  });

  describe('addSubmission', () => {
    it('adds a new submission with generated id and timestamp', () => {
      const submission = {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        mobile: '5551234567',
        department: 'Marketing',
      };

      const result = addSubmission(submission);

      expect(result).toBe(true);

      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(1);
      expect(saved[0].id).toBe('test-uuid-1234');
      expect(saved[0].fullName).toBe('Alice Johnson');
      expect(saved[0].email).toBe('alice@example.com');
      expect(saved[0].mobile).toBe('5551234567');
      expect(saved[0].department).toBe('Marketing');
      expect(saved[0].submittedAt).toBeDefined();
      // Verify submittedAt is a valid ISO string
      expect(new Date(saved[0].submittedAt).toISOString()).toBe(saved[0].submittedAt);
    });

    it('returns false when email already exists (duplicate check)', () => {
      const existing = [
        {
          id: 'existing-1',
          fullName: 'Bob Brown',
          email: 'bob@example.com',
          mobile: '1112223333',
          department: 'Sales',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const submission = {
        fullName: 'Bob Brown Jr',
        email: 'bob@example.com',
        mobile: '4445556666',
        department: 'Engineering',
      };

      const result = addSubmission(submission);

      expect(result).toBe(false);
      // Should not have added a second entry
      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(1);
    });

    it('returns false for duplicate email with different casing', () => {
      const existing = [
        {
          id: 'existing-1',
          fullName: 'Carol White',
          email: 'carol@example.com',
          mobile: '1112223333',
          department: 'HR',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const submission = {
        fullName: 'Carol White',
        email: '  CAROL@EXAMPLE.COM  ',
        mobile: '9998887777',
        department: 'Finance',
      };

      const result = addSubmission(submission);
      expect(result).toBe(false);
    });

    it('appends to existing submissions', () => {
      const existing = [
        {
          id: 'existing-1',
          fullName: 'First User',
          email: 'first@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const submission = {
        fullName: 'Second User',
        email: 'second@example.com',
        mobile: '2222222222',
        department: 'Design',
      };

      const result = addSubmission(submission);

      expect(result).toBe(true);
      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(2);
      expect(saved[0].email).toBe('first@example.com');
      expect(saved[1].email).toBe('second@example.com');
    });
  });

  describe('updateSubmission', () => {
    it('updates the correct submission by id', () => {
      const existing = [
        {
          id: 'id-1',
          fullName: 'Original Name',
          email: 'original@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
        {
          id: 'id-2',
          fullName: 'Other Person',
          email: 'other@example.com',
          mobile: '2222222222',
          department: 'Design',
          submittedAt: '2024-01-11T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const result = updateSubmission('id-1', {
        fullName: 'Updated Name',
        department: 'Marketing',
      });

      expect(result).toBe(true);
      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved[0].fullName).toBe('Updated Name');
      expect(saved[0].department).toBe('Marketing');
      // Unchanged fields should remain
      expect(saved[0].email).toBe('original@example.com');
      expect(saved[0].mobile).toBe('1111111111');
      // Other submission should be untouched
      expect(saved[1].fullName).toBe('Other Person');
    });

    it('returns false when submission id is not found', () => {
      const existing = [
        {
          id: 'id-1',
          fullName: 'Some Person',
          email: 'some@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const result = updateSubmission('nonexistent-id', { fullName: 'New Name' });

      expect(result).toBe(false);
      // Original data should be unchanged
      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved[0].fullName).toBe('Some Person');
    });

    it('returns false when submissions list is empty', () => {
      store['hirehub_submissions'] = '[]';

      const result = updateSubmission('any-id', { fullName: 'New Name' });
      expect(result).toBe(false);
    });
  });

  describe('deleteSubmission', () => {
    it('removes the correct submission by id', () => {
      const existing = [
        {
          id: 'id-1',
          fullName: 'First',
          email: 'first@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
        {
          id: 'id-2',
          fullName: 'Second',
          email: 'second@example.com',
          mobile: '2222222222',
          department: 'Design',
          submittedAt: '2024-01-11T08:00:00.000Z',
        },
        {
          id: 'id-3',
          fullName: 'Third',
          email: 'third@example.com',
          mobile: '3333333333',
          department: 'Sales',
          submittedAt: '2024-01-12T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const result = deleteSubmission('id-2');

      expect(result).toBe(true);
      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(2);
      expect(saved.find((s) => s.id === 'id-2')).toBeUndefined();
      expect(saved[0].id).toBe('id-1');
      expect(saved[1].id).toBe('id-3');
    });

    it('returns false when submission id is not found', () => {
      const existing = [
        {
          id: 'id-1',
          fullName: 'Only Entry',
          email: 'only@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      const result = deleteSubmission('nonexistent-id');

      expect(result).toBe(false);
      const saved = JSON.parse(store['hirehub_submissions']);
      expect(saved).toHaveLength(1);
    });

    it('returns false when submissions list is empty', () => {
      store['hirehub_submissions'] = '[]';

      const result = deleteSubmission('any-id');
      expect(result).toBe(false);
    });
  });

  describe('isEmailDuplicate', () => {
    it('returns true when email exists in submissions', () => {
      const existing = [
        {
          id: 'id-1',
          fullName: 'Test User',
          email: 'test@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      expect(isEmailDuplicate('test@example.com')).toBe(true);
    });

    it('returns true for case-insensitive email match', () => {
      const existing = [
        {
          id: 'id-1',
          fullName: 'Test User',
          email: 'Test@Example.COM',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      expect(isEmailDuplicate('test@example.com')).toBe(true);
      expect(isEmailDuplicate('TEST@EXAMPLE.COM')).toBe(true);
    });

    it('returns true when email has leading/trailing whitespace', () => {
      const existing = [
        {
          id: 'id-1',
          fullName: 'Test User',
          email: 'test@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      expect(isEmailDuplicate('  test@example.com  ')).toBe(true);
    });

    it('returns false when email does not exist in submissions', () => {
      const existing = [
        {
          id: 'id-1',
          fullName: 'Test User',
          email: 'test@example.com',
          mobile: '1111111111',
          department: 'Engineering',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      store['hirehub_submissions'] = JSON.stringify(existing);

      expect(isEmailDuplicate('other@example.com')).toBe(false);
    });

    it('returns false when submissions list is empty', () => {
      store['hirehub_submissions'] = '[]';

      expect(isEmailDuplicate('any@example.com')).toBe(false);
    });

    it('returns false when no submissions exist in storage', () => {
      expect(isEmailDuplicate('any@example.com')).toBe(false);
    });
  });
});