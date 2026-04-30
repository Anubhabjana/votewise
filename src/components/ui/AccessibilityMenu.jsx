import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Settings, Type, Contrast, X } from 'lucide-react';

export default function AccessibilityMenu() {
  const { textSize, increaseTextSize, decreaseTextSize, highContrast, toggleHighContrast } = useAccessibility();
  const { t } = useTranslation();
  
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100]" ref={menuRef}>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[var(--color-navy)] text-white p-4 rounded-full shadow-2xl hover:bg-blue-900 transition-transform hover:scale-105 border-2 border-white focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Accessibility Settings"
      >
        {isOpen ? <X className="w-8 h-8" /> : <Settings className="w-8 h-8" />}
      </button>

      {/* Menu Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-72 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 overflow-hidden animate-fade-in origin-bottom-right">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-bold text-lg text-gray-800">{t('Accessibility')}</h3>
            <p className="text-sm text-gray-500">{t('Adjust the app to your needs')}</p>
          </div>
          
          <div className="p-2">
            {/* Text Size Control */}
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center text-gray-700 font-semibold mb-3">
                <Type className="w-5 h-5 mr-2" />
                {t('Text Size')}
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={decreaseTextSize}
                  className="flex-1 py-3 text-center rounded-md bg-white shadow-sm font-bold text-gray-800 hover:bg-gray-50"
                  aria-label="Decrease text size"
                >
                  A-
                </button>
                <div className="flex-1 py-3 text-center text-sm font-medium text-gray-500 flex items-center justify-center">
                  {textSize === 'normal' ? t('Normal') : textSize === 'large' ? t('Large') : t('Extra Large')}
                </div>
                <button 
                  onClick={increaseTextSize}
                  className="flex-1 py-3 text-center rounded-md bg-white shadow-sm font-bold text-lg text-gray-800 hover:bg-gray-50"
                  aria-label="Increase text size"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast Control */}
            <div className="p-3">
               <button
                 onClick={toggleHighContrast}
                 className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                   highContrast 
                     ? 'border-[var(--color-saffron)] bg-orange-50 text-[var(--color-navy)] font-bold' 
                     : 'border-gray-200 hover:border-gray-300 text-gray-700'
                 }`}
               >
                 <div className="flex items-center">
                   <Contrast className="w-6 h-6 mr-3" />
                   <span>{t('High Contrast')}</span>
                 </div>
                 <div className={`w-12 h-6 rounded-full p-1 transition-colors ${highContrast ? 'bg-[var(--color-saffron)]' : 'bg-gray-300'}`}>
                   <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'transform translate-x-6' : ''}`} />
                 </div>
               </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
