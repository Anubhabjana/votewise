import { useState, useEffect } from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { useFirstTimer } from '../../contexts/FirstTimerContext';
import { useTranslation } from '../../hooks/useTranslation';
import { ChevronDown, ChevronUp, CheckCircle, Circle, ArrowRight } from 'lucide-react';

import { ELECTION_PHASES } from '../../constants/componentData';

export default function Timeline() {
  const { isDemoMode } = useDemo();
  const { isFirstTimer } = useFirstTimer();
  const [activePhaseIndex, setActivePhaseIndex] = useState(-1);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const { t } = useTranslation();

  // In demo mode, highlight "Voting Day" (index 4 now)
  useEffect(() => {
    setActivePhaseIndex(isDemoMode ? 4 : -1);
  }, [isDemoMode]);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-[var(--color-navy)]">{t('Election Lifecycle')}</h2>
          {isFirstTimer && <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full border border-green-300">{t('Beginner Friendly')}</span>}
        </div>
        {(activePhaseIndex >= 0) && (
          <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-700">
            {t('Current Phase:')} {t(ELECTION_PHASES[activePhaseIndex].title)}
          </span>
        )}
      </div>

      <div className="relative border-l-4 border-gray-200 ml-4 md:ml-6 space-y-8">
        {ELECTION_PHASES.map((phase, index) => {
          const isActive = activePhaseIndex === index;
          const isPassed = activePhaseIndex > index;
          const isExpanded = expandedIndex === index;

          return (
            <div key={index} className="relative pl-6 sm:pl-8">
              {/* Timeline dot */}
              <div className={`absolute -left-[18px] top-1 bg-white rounded-full ${
                isActive ? 'text-green-500' : isPassed ? 'text-[var(--color-navy)]' : 'text-gray-300'
              }`}>
                {isActive ? <Circle className="w-8 h-8 fill-green-100" /> : 
                 isPassed ? <CheckCircle className="w-8 h-8" /> : 
                 <Circle className="w-8 h-8" />}
              </div>

              {/* Content Card */}
              <div 
                className={`w-full text-left bg-white border-2 rounded-xl shadow-sm transition-all ${
                  isActive ? 'border-[var(--color-navy)] shadow-md transform scale-[1.02]' : 'border-gray-100'
                }`}
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className={`text-xl font-bold ${isActive ? 'text-[var(--color-navy)]' : 'text-gray-900'}`}>
                      {t(phase.title)}
                    </h3>
                    <p className="text-gray-600 mt-1">{isFirstTimer && phase.simpleDescription ? t(phase.simpleDescription) : t(phase.description)}</p>
                  </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
