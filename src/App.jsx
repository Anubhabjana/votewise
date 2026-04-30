import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LearnView from './views/LearnView';
import AskView from './views/AskView';
import QuizView from './views/QuizView';
import { useFirstTimer } from './contexts/FirstTimerContext';
import { useTranslation } from './hooks/useTranslation';
import { X, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';

import LanguageWelcomeModal from './components/layout/LanguageWelcomeModal';
import AccessibilityMenu from './components/ui/AccessibilityMenu';

function App() {
  const { isFirstTimer, setIsFirstTimer } = useFirstTimer();
  const { t } = useTranslation();
  const [toast, setToast] = useState('');

  useEffect(() => {
    const handleLanguageChanged = (e) => {
      setToast(e.detail);
      setTimeout(() => setToast(''), 2000);
    };

    window.addEventListener('language-changed', handleLanguageChanged);
    return () => window.removeEventListener('language-changed', handleLanguageChanged);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] relative">
      <LanguageWelcomeModal />
      <AccessibilityMenu />
      
      {/* Language Toast Notification */}
      <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg flex items-center transition-all duration-300 z-[100] pointer-events-none ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <Globe className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium">{t('Language changed to')} {toast}</span>
      </div>

      {isFirstTimer && (
        <div className="bg-green-600 text-white text-sm font-semibold py-2 px-4 flex justify-between items-center relative z-[60] shadow-md animate-fade-in">
          <div className="flex-1 text-center">{t('First Timer Mode ON — Everything explained simply ✓')}</div>
          <button 
            onClick={() => setIsFirstTimer(false)}
            className="hover:bg-green-700 p-1 rounded-full transition-colors flex-shrink-0"
            aria-label={t("Exit First Timer Mode")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LearnView />} />
          <Route path="/ask" element={<AskView />} />
          <Route path="/quiz" element={<QuizView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
