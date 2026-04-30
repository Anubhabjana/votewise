import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LANGUAGES } from '../../constants/languages';
import { Globe } from 'lucide-react';

export default function LanguageWelcomeModal() {
  const { setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal if the user hasn't made an explicit language choice yet
    const hasChosen = localStorage.getItem('votewise_lang_prompted');
    if (!hasChosen) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleSelect = (code) => {
    setLanguage(code);
    localStorage.setItem('votewise_lang_prompted', 'true');
    setIsOpen(false);
  };

  // We highlight the most widely spoken languages in India for easy access
  const topLanguages = ['hi', 'bn', 'te', 'mr', 'ta', 'ur', 'gu', 'en'];
  const topLangs = LANGUAGES.filter(l => topLanguages.includes(l.code)).sort((a,b) => topLanguages.indexOf(a.code) - topLanguages.indexOf(b.code));
  const otherLangs = LANGUAGES.filter(l => !topLanguages.includes(l.code));

  return (
    <div className="fixed inset-0 z-[200] bg-[var(--color-navy)] bg-opacity-95 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-[var(--color-saffron)] p-6 text-center text-white flex flex-col items-center justify-center flex-shrink-0">
          <Globe className="w-12 h-12 mb-3 opacity-90" />
          <h2 className="text-3xl font-bold mb-2">Select Your Language</h2>
          <p className="text-lg opacity-90">Please choose your preferred language to continue</p>
          <p className="text-xl font-bold mt-2 font-hindi">अपनी भाषा चुनें</p>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">Most Common</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {topLangs.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--color-saffron)] hover:bg-orange-50 transition-all group"
              >
                <span className="text-2xl font-bold text-[var(--color-navy)] group-hover:text-[var(--color-saffron)] mb-1">
                  {lang.nativeName}
                </span>
                <span className="text-sm text-gray-500">
                  {lang.name}
                </span>
              </button>
            ))}
          </div>

          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4 border-b pb-2">More Languages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {otherLangs.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                <span className="text-lg font-bold text-gray-800 mb-1">
                  {lang.nativeName}
                </span>
                <span className="text-xs text-gray-500">
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
