import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <LearningProvider>
              <App />
            </LearningProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
