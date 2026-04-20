const STORAGE_KEY = 'hirehub_submissions';

/**
 * Retrieves all submissions from localStorage.
 * Returns an empty array if no data exists or if data is corrupted.
 * @returns {Array<Object>} Array of submission objects
 */
export function getSubmissions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.warn('hirehub: submissions data is not an array, resetting.');
      localStorage.setItem(STORAGE_KEY, '[]');
      return [];
    }
    return parsed;
  } catch (error) {
    console.warn('hirehub: failed to parse submissions from localStorage, resetting.', error);
    try {
      localStorage.setItem(STORAGE_KEY, '[]');
    } catch (writeError) {
      console.warn('hirehub: failed to reset localStorage.', writeError);
    }
    return [];
  }
}

/**
 * Saves the entire submissions array to localStorage.
 * @param {Array<Object>} submissions - Array of submission objects to persist
 */
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.warn('hirehub: failed to save submissions to localStorage.', error);
  }
}

/**
 * Adds a new submission to localStorage.
 * Generates a unique id and submittedAt timestamp.
 * Returns false if the email already exists (duplicate check).
 * @param {Object} submission - Submission object with fullName, email, mobile, department
 * @returns {boolean} true if added successfully, false if duplicate email or error
 */
export function addSubmission(submission) {
  try {
    const submissions = getSubmissions();
    const emailLower = submission.email.trim().toLowerCase();
    const duplicate = submissions.some(
      (s) => s.email && s.email.trim().toLowerCase() === emailLower
    );
    if (duplicate) {
      return false;
    }
    const newSubmission = {
      id: crypto.randomUUID(),
      fullName: submission.fullName,
      email: submission.email,
      mobile: submission.mobile,
      department: submission.department,
      submittedAt: new Date().toISOString(),
    };
    submissions.push(newSubmission);
    saveSubmissions(submissions);
    return true;
  } catch (error) {
    console.warn('hirehub: failed to add submission.', error);
    return false;
  }
}

/**
 * Updates an existing submission by id.
 * Merges the updates object into the existing submission.
 * @param {string} id - The unique id of the submission to update
 * @param {Object} updates - An object containing the fields to update
 * @returns {boolean} true if updated successfully, false if not found or error
 */
export function updateSubmission(id, updates) {
  try {
    const submissions = getSubmissions();
    const index = submissions.findIndex((s) => s.id === id);
    if (index === -1) {
      return false;
    }
    submissions[index] = { ...submissions[index], ...updates };
    saveSubmissions(submissions);
    return true;
  } catch (error) {
    console.warn('hirehub: failed to update submission.', error);
    return false;
  }
}

/**
 * Deletes a submission by id.
 * @param {string} id - The unique id of the submission to delete
 * @returns {boolean} true if deleted successfully, false if not found or error
 */
export function deleteSubmission(id) {
  try {
    const submissions = getSubmissions();
    const filtered = submissions.filter((s) => s.id !== id);
    if (filtered.length === submissions.length) {
      return false;
    }
    saveSubmissions(filtered);
    return true;
  } catch (error) {
    console.warn('hirehub: failed to delete submission.', error);
    return false;
  }
}

/**
 * Checks if an email already exists in the submissions.
 * @param {string} email - The email address to check
 * @returns {boolean} true if the email already exists, false otherwise
 */
export function isEmailDuplicate(email) {
  try {
    const submissions = getSubmissions();
    const emailLower = email.trim().toLowerCase();
    return submissions.some(
      (s) => s.email && s.email.trim().toLowerCase() === emailLower
    );
  } catch (error) {
    console.warn('hirehub: failed to check email duplicate.', error);
    return false;
  }
}