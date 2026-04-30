import { useState } from 'react';
import { Copy, Check, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

import { MYTHS } from '../../constants/componentData';

export default function MythBusters() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const { speak, stop, isSpeaking, supported } = useTextToSpeech();

  const currentItem = MYTHS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MYTHS.length);
    setCopied(false);
    stop();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MYTHS.length) % MYTHS.length);
    setCopied(false);
    stop();
  };

  const shareFact = () => {
    const textToShare = `${t('Myth')}: ${t(currentItem.myth)}\n${t('Fact')}: ${t(currentItem.fact)}\n- ${t('Learn more on VoteWise PWA')}`;
    navigator.clipboard.writeText(textToShare).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleReadAloud = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(`${t('Myth')}: ${t(currentItem.myth)}. ${t('Fact')}: ${t(currentItem.fact)}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden w-full">
      <div className="bg-[var(--color-navy)] px-6 py-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-wide">{t('Myth vs Fact')}</h2>
        {supported && (
          <button 
            onClick={handleReadAloud}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Read Aloud"
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      <div className="p-6 relative min-h-[220px] flex flex-col justify-center">
        
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev} 
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={t("Previous card")}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleNext} 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={t("Next card")}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Card Content */}
        <div className="px-10 md:px-14 text-center animate-fade-in" key={currentIndex}>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-bold uppercase rounded mb-2">{t('Myth')}</span>
            <p className="text-xl font-medium text-gray-900 border-b border-gray-200 pb-3">"{t(currentItem.myth)}"</p>
          </div>
          <div>
             <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-bold uppercase rounded mb-2">{t('Fact')}</span>
            <p className="text-lg text-gray-700">{t(currentItem.fact)}</p>
          </div>
        </div>
      </div>
      
      {/* Footer Info & Share */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">
          {t('Card {current} of {total}').replace('{current}', currentIndex + 1).replace('{total}', MYTHS.length)}
        </span>
        <button 
          onClick={shareFact}
          className="inline-flex items-center text-sm font-medium text-[var(--color-navy)] hover:text-[var(--color-navy-light)] transition-colors"
          aria-label={t("Share this fact via clipboard")}
        >
          {copied ? <Check className="w-4 h-4 mr-1 text-green-600" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? <span className="text-green-600">{t('Copied!')}</span> : t('Share this fact')}
        </button>
      </div>
    </div>
  );
}
