import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';
import { useSession } from '../hooks/useSession';
import { SubmissionTable } from './SubmissionTable';
import { EditModal } from './EditModal';

const styles = {
  page: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '32px 24px',
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoutButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 20px',
    fontSize: '0.875rem',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
  },
  statCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    transition: 'box-shadow 150ms ease',
  },
  statCardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  statCardIconPrimary: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
  },
  statCardIconSuccess: {
    backgroundColor: '#d1fae5',
    color: '#059669',
  },
  statCardIconInfo: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
  },
  statCardLabel: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
    margin: 0,
  },
  statCardValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  tableHeaderTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },
  banner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    marginBottom: '24px',
    animation: 'slideDown 250ms ease',
  },
  bannerSuccess: {
    backgroundColor: '#d1fae5',
    color: '#047857',
    border: '1px solid #a7f3d0',
  },
  bannerError: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
  },
  bannerIcon: {
    flexShrink: 0,
    fontSize: '1.25rem',
    lineHeight: 1,
  },
  bannerContent: {
    flex: 1,
  },
  bannerDismiss: {
    flexShrink: 0,
    padding: '2px',
    color: 'inherit',
    opacity: 0.7,
    fontSize: '1.125rem',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    transition: 'opacity 150ms ease',
  },
};

const responsiveStatCards = {
  ...styles.statCards,
};

/**
 * Formats a date string for display.
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date or 'N/A'
 */
function formatLatestDate(dateString) {
  if (!dateString) {
    return 'N/A';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [banner, setBanner] = useState(null);
  const { logout } = useSession();
  const navigate = useNavigate();

  const loadSubmissions = useCallback(() => {
    const data = getSubmissions();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  useEffect(() => {
    let timer;
    if (banner) {
      timer = setTimeout(() => {
        setBanner(null);
      }, 4000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [banner]);

  const totalSubmissions = submissions.length;

  const uniqueDepartments = (() => {
    const depts = new Set();
    submissions.forEach((s) => {
      if (s.department && s.department.trim()) {
        depts.add(s.department.trim());
      }
    });
    return depts.size;
  })();

  const latestSubmissionDate = (() => {
    if (submissions.length === 0) {
      return 'N/A';
    }
    let latest = null;
    submissions.forEach((s) => {
      if (s.submittedAt) {
        try {
          const d = new Date(s.submittedAt);
          if (!isNaN(d.getTime())) {
            if (!latest || d > latest) {
              latest = d;
            }
          }
        } catch {
          // skip invalid dates
        }
      }
    });
    if (!latest) {
      return 'N/A';
    }
    return formatLatestDate(latest.toISOString());
  })();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const handleEdit = (submission) => {
    setEditingSubmission(submission);
  };

  const handleEditSave = (updatedData) => {
    const result = updateSubmission(updatedData.id, {
      fullName: updatedData.fullName,
      mobile: updatedData.mobile,
      department: updatedData.department,
    });
    if (result) {
      setBanner({ type: 'success', message: 'Submission updated successfully.' });
      loadSubmissions();
    } else {
      setBanner({ type: 'error', message: 'Failed to update submission. Please try again.' });
    }
    setEditingSubmission(null);
  };

  const handleEditClose = () => {
    setEditingSubmission(null);
  };

  const handleDelete = (submission) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the submission for "${submission.fullName || 'this entry'}"? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }
    const result = deleteSubmission(submission.id);
    if (result) {
      setBanner({ type: 'success', message: 'Submission deleted successfully.' });
      loadSubmissions();
    } else {
      setBanner({ type: 'error', message: 'Failed to delete submission. Please try again.' });
    }
  };

  const handleDismissBanner = () => {
    setBanner(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Dashboard Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Admin Dashboard</h1>
          <div style={styles.headerActions}>
            <button
              type="button"
              style={styles.logoutButton}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Banner */}
        {banner && (
          <div
            style={{
              ...styles.banner,
              ...(banner.type === 'success' ? styles.bannerSuccess : styles.bannerError),
            }}
            role="alert"
          >
            <span style={styles.bannerIcon}>
              {banner.type === 'success' ? '✅' : '❌'}
            </span>
            <div style={styles.bannerContent}>{banner.message}</div>
            <button
              type="button"
              style={styles.bannerDismiss}
              onClick={handleDismissBanner}
              aria-label="Dismiss notification"
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Stat Cards */}
        <div style={responsiveStatCards}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statCardIcon, ...styles.statCardIconPrimary }}>
              📋
            </div>
            <div>
              <h3 style={styles.statCardLabel}>Total Submissions</h3>
              <p style={styles.statCardValue}>{totalSubmissions}</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statCardIcon, ...styles.statCardIconSuccess }}>
              🏢
            </div>
            <div>
              <h3 style={styles.statCardLabel}>Unique Departments</h3>
              <p style={styles.statCardValue}>{uniqueDepartments}</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statCardIcon, ...styles.statCardIconInfo }}>
              🕐
            </div>
            <div>
              <h3 style={styles.statCardLabel}>Latest Submission</h3>
              <p style={styles.statCardValue}>{latestSubmissionDate}</p>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableHeaderTitle}>All Submissions</h2>
          </div>
          <SubmissionTable
            submissions={submissions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Edit Modal */}
        {editingSubmission && (
          <EditModal
            submission={editingSubmission}
            onSave={handleEditSave}
            onClose={handleEditClose}
          />
        )}
      </div>
    </div>
  );
}