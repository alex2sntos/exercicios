import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import CampaignCreationPage from './pages/CampaignCreationPage';
import ClientsManagementPage from './pages/ClientsManagementPage';
import AutomationFlowsPage from './pages/AutomationFlowsPage';
import SettingsPage from './pages/SettingsPage'; // Added import
// import LoginPage from './pages/LoginPage'; // Placeholder for future login page

// Simulate authentication status
const isAuthenticated = () => {
  // Replace with actual auth check (e.g., check for token in localStorage)
  // For now, always return true to show DashboardPage
  return true; 
};

// A simple protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect them to the /login page, but Navigate now needs to be used differently in v6
    // return <Navigate to="/login" replace />; // For a real login page
    return <Navigate to="/" replace />; // For now, if somehow not authenticated, redirect to home (which is dashboard)
  }
  return children;
};


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns/new" 
            element={
              <ProtectedRoute>
                <CampaignCreationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/campaigns/:campaignId/edit" 
            element={
              <ProtectedRoute>
                <CampaignCreationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <ProtectedRoute>
                <ClientsManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/automations" 
            element={
              <ProtectedRoute>
                <AutomationFlowsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          {/* Add other routes here */}
          <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown routes to dashboard */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
