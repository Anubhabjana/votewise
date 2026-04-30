import Timeline from '../components/features/Timeline';
import EligibilityChecker from '../components/features/EligibilityChecker';
import MythBusters from '../components/features/MythBusters';
import PollingBooth from '../components/features/PollingBooth';
import Logo from '../components/ui/Logo';
import { useFirstTimer } from '../contexts/FirstTimerContext';
import { useTranslation } from '../hooks/useTranslation';

export default function LearnView() {
  const { isFirstTimer, toggleFirstTimer } = useFirstTimer();
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in transition-opacity">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-navy)] mb-4 flex items-center">
            <Logo size="large" className="mr-3" />
            {t('Learn About the Election Process')}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            {t('Understand how elections work, key timelines, and step-by-step voting procedures.')}
          </p>
        </div>
        
        {/* First Time Voter CTA */}
        <div className="mt-6 md:mt-0 relative group">
          <button 
            onClick={toggleFirstTimer}
            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center ${
              isFirstTimer 
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/30 ring-2 ring-green-600 ring-offset-2' 
                : 'bg-white hover:bg-gray-50 text-[var(--color-navy)] border-2 border-[var(--color-navy)]'
            }`}
          >
            {isFirstTimer ? t('First Timer Mode ON ✓') : t('First Time Voter? Start Here →')}
          </button>
          {!isFirstTimer && (
            <div className="absolute -bottom-10 right-0 w-48 text-center text-xs bg-gray-800 text-white rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {t('Turns on simpler language!')}
            </div>
          )}
        </div>
      </div>
      
      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Timeline />
        </div>
        <div className="space-y-8">
          <EligibilityChecker />
          <MythBusters />
        </div>
      </div>

      {/* Full width new section */}
      <PollingBooth />
      
    </div>
  );
}
