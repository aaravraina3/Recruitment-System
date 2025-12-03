import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey =
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY ||
  'pk_test_cG9zaXRpdmUtY2ljYWRhLTI4LmNsZXJrLmFjY291bnRzLmRldiQ';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
