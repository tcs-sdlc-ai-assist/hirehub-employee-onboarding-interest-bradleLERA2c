import React from 'react';
import PropTypes from 'prop-types';

const DEPARTMENT_COLORS = {
  Engineering: { background: '#dbeafe', color: '#1e40af' },
  Marketing: { background: '#fce7f3', color: '#9d174d' },
  Sales: { background: '#d1fae5', color: '#065f46' },
  HR: { background: '#fef3c7', color: '#92400e' },
  Finance: { background: '#ede9fe', color: '#5b21b6' },
  Operations: { background: '#ffedd5', color: '#9a3412' },
  Design: { background: '#cffafe', color: '#155e75' },
  Support: { background: '#f3e8ff', color: '#6b21a8' },
};

const DEFAULT_BADGE_STYLE = { background: '#f3f4f6', color: '#374151' };

function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString || '—';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString || '—';
  }
}

function getDepartmentBadgeStyle(department) {
  return DEPARTMENT_COLORS[department] || DEFAULT_BADGE_STYLE;
}

const tableWrapperStyle = {
  width: '100%',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: '700px',
  fontSize: '14px',
};

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontWeight: '600',
  color: '#374151',
  backgroundColor: '#f9fafb',
  borderBottom: '2px solid #e5e7eb',
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  color: '#111827',
  verticalAlign: 'middle',
};

const badgeStyle = {
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: '600',
  whiteSpace: 'nowrap',
};

const actionButtonBase = {
  padding: '6px 14px',
  borderRadius: '6px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: '500',
  marginRight: '8px',
  transition: 'opacity 0.2s',
};

const editButtonStyle = {
  ...actionButtonBase,
  backgroundColor: '#3b82f6',
  color: '#ffffff',
};

const deleteButtonStyle = {
  ...actionButtonBase,
  backgroundColor: '#ef4444',
  color: '#ffffff',
  marginRight: '0',
};

const emptyMessageStyle = {
  textAlign: 'center',
  padding: '48px 16px',
  color: '#6b7280',
  fontSize: '16px',
};

export function SubmissionTable({ submissions, onEdit, onDelete }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div style={emptyMessageStyle} role="status" aria-label="No submissions">
        No submissions yet.
      </div>
    );
  }

  return (
    <div style={tableWrapperStyle}>
      <table style={tableStyle} role="table" aria-label="Candidate submissions">
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Mobile</th>
            <th style={thStyle}>Department</th>
            <th style={thStyle}>Submitted At</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => {
            const deptBadge = getDepartmentBadgeStyle(submission.department);
            return (
              <tr
                key={submission.id || index}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                }}
              >
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{submission.fullName || '—'}</td>
                <td style={{ ...tdStyle, wordBreak: 'break-all' }}>
                  {submission.email || '—'}
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  {submission.mobile || '—'}
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      ...badgeStyle,
                      backgroundColor: deptBadge.background,
                      color: deptBadge.color,
                    }}
                  >
                    {submission.department || '—'}
                  </span>
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  {formatDate(submission.submittedAt)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <button
                    type="button"
                    style={editButtonStyle}
                    onClick={() => onEdit(submission)}
                    aria-label={`Edit submission for ${submission.fullName || 'unknown'}`}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    style={deleteButtonStyle}
                    onClick={() => onDelete(submission)}
                    aria-label={`Delete submission for ${submission.fullName || 'unknown'}`}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fullName: PropTypes.string,
      email: PropTypes.string,
      mobile: PropTypes.string,
      department: PropTypes.string,
      submittedAt: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubmissionTable;