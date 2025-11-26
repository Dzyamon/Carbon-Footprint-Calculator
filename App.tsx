import React from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Calculator } from './pages/Calculator';
import { Results } from './pages/Results';
import { FAQ } from './pages/FAQ';
import { History } from './pages/History';

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 flex flex-col transition-colors duration-200">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/results" element={<Results />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="bg-slate-900 text-slate-400 py-6 text-center print:hidden">
              <p>&copy; {new Date().getFullYear()} EcoCalc MVP. All rights reserved.</p>
            </footer>
          </div>
        </Router>
      </LanguageProvider>
    </AccessibilityProvider>
  );
};

export default App;
