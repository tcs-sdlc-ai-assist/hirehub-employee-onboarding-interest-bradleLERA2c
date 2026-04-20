import React from 'react';
import PropTypes from 'prop-types';
import { useSession } from '../hooks/useSession';

export function ProtectedRoute({ children, fallback }) {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return fallback || null;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

ProtectedRoute.defaultProps = {
  fallback: null,
};

export default ProtectedRoute;