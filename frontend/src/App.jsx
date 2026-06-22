import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';

import CustomLinks from './pages/CustomLinks';
import AnalyticsPage from './pages/AnalyticsPage';
import QrGenerator from './pages/QrGenerator';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-300">
        <nav className="fixed w-full z-50 glass border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0 flex items-center">
                <a href="/" className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                  QuickLink
                </a>
              </div>
              <div className="flex items-center space-x-6">
                <a href="/dashboard" className="text-foreground hover:text-primary transition font-medium">Dashboard</a>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                >
                  {darkMode ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/custom-links" element={<CustomLinks />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/qr-generator" element={<QrGenerator />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
