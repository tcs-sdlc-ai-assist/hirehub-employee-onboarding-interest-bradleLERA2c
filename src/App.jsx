import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import InterestForm from './components/InterestForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/apply" element={<InterestForm />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute fallback={<AdminLogin />}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute fallback={<Navigate to="/admin" replace />}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}