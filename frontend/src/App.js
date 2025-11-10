import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import BranchSelection from './pages/BranchSelection';
import BranchDetail from './pages/BranchDetail';
import ApplicationForm from './pages/ApplicationForm';
import MyApplications from './pages/MyApplications';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/sign-in" 
          element={
            <>
              <SignedOut>
                <SignIn />
              </SignedOut>
              <SignedIn>
                <Navigate to="/dashboard" replace />
              </SignedIn>
            </>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/branches" 
          element={
            <>
              <SignedIn>
                <BranchSelection />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/branch/:branchId" 
          element={
            <>
              <SignedIn>
                <BranchDetail />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/apply/:branchId/:roleId" 
          element={
            <>
              <SignedIn>
                <ApplicationForm />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } 
        />

        <Route 
          path="/my-applications" 
          element={
            <>
              <SignedIn>
                <MyApplications />
              </SignedIn>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/sign-in" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
