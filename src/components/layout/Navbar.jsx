import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDemo } from '../../contexts/DemoContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGES } from '../../constants/languages';
import { BookOpen, MessageCircleQuestion, HelpCircle, Activity, Globe, Search, Check, AlertCircle } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Navbar() {
  const location = useLocation();
  const { isDemoMode, toggleDemoMode } = useDemo();
  const { language, setLanguage, isTranslating, translationError } = useLanguage();
  const { t } = useTranslation();

  const [langOpen, setLangOpen] = useState(false);
  const [langQuery, setLangQuery] = useState('');
  const langRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: t('Learn'), path: '/', icon: <BookOpen className="w-5 h-5 mr-1" /> },
    { name: t('Ask'), path: '/ask', icon: <MessageCircleQuestion className="w-5 h-5 mr-1" /> },
    { name: t('Quiz'), path: '/quiz', icon: <HelpCircle className="w-5 h-5 mr-1" /> },
  ];

  const filteredLanguages = LANGUAGES.filter(l => 
    l.nativeName.toLowerCase().includes(langQuery.toLowerCase()) || 
    l.name.toLowerCase().includes(langQuery.toLowerCase())
  );

  return (
    <nav className="bg-[var(--color-navy)] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
               <Logo size="small" />
            </Link>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'border-[var(--color-saffron)] text-white'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setLangOpen(!langOpen)}
                disabled={isDemoMode}
                className={`flex items-center text-sm font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  isDemoMode ? 'opacity-50 cursor-not-allowed border-gray-600 bg-gray-700/50' : 'border-gray-500 hover:border-gray-300 bg-white/10 hover:bg-white/20'
                }`}
                aria-label="Select Language"
              >
                <Globe className={`w-4 h-4 mr-2 ${isTranslating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{LANGUAGES.find(l => l.code === language)?.nativeName || 'English'}</span>
                <span className="sm:hidden">{language.toUpperCase()}</span>
                {translationError && <AlertCircle className="w-3 h-3 ml-1 text-red-500" />}
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 text-gray-800 border border-gray-200">
                  <div className="px-3 pb-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder={t('Search languages...')}
                        value={langQuery}
                        onChange={(e) => setLangQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-navy)]"
                      />
                    </div>
                  </div>
                  <div className="max-h-60 overflow-y-auto mt-1">
                    {filteredLanguages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangOpen(false);
                          setLangQuery('');
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                          language === lang.code ? 'font-bold text-[var(--color-navy)] bg-blue-50' : ''
                        }`}
                      >
                        <span>{lang.nativeName} <span className="text-gray-500 font-normal">({lang.name})</span></span>
                        {language === lang.code && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                    {filteredLanguages.length === 0 && (
                       <div className="px-4 py-3 text-sm text-gray-500 text-center">No languages found.</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={toggleDemoMode}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-full shadow-sm text-white focus:outline-none transition-colors relative ${
                isDemoMode ? 'bg-[var(--color-saffron)] hover:bg-[var(--color-saffron-dark)]' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              <Activity className="w-4 h-4 mr-1"/>
              {isDemoMode ? t('Demo Mode Active') : t('Enable Demo Mode')}
              {isDemoMode && <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white border border-orange-500"></span>
              </span>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile nav placeholder - will be implemented fully later */}
      <div className="md:hidden flex justify-around border-t border-gray-700 bg-[var(--color-navy-dark)] pb-2 pt-2">
        {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center p-2 text-xs font-medium ${
                location.pathname === link.path
                  ? 'text-[var(--color-saffron)]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {link.icon}
              <span className="mt-1">{link.name}</span>
            </Link>
          ))}
      </div>
    </nav>
  );
}
