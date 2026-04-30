import React, { useRef, useEffect } from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  CreditCard, Droplet, PenTool, FileText, 
  DoorClosed, CheckSquare, Printer, CheckCircle2 
} from 'lucide-react';

import { BOOTH_STEPS } from '../../constants/componentData';

export default function PollingBooth() {
  const { isDemoMode } = useDemo();
  const step2Ref = useRef(null);
  const containerRef = useRef(null);
  const { t } = useTranslation();

  // If Demo Mode is active, playfully scroll to Step 2 to draw attention
  useEffect(() => {
    if (isDemoMode && step2Ref.current && containerRef.current) {
      setTimeout(() => {
        containerRef.current.scrollTo({
          left: step2Ref.current.offsetLeft - 20,
          behavior: 'smooth'
        });
      }, 500);
    }
  }, [isDemoMode]);

  return (
    <div className="w-full space-y-12 animate-fade-in mt-12 mb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[var(--color-navy)] mb-2">{t('Inside the Polling Booth')}</h2>
        <p className="text-gray-700">{t('What exactly happens when you walk in? Follow the 8 steps.')}</p>
      </div>

      {/* Horizontal Scroll Deck / Grid */}
      <div 
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory pb-6 pt-2 hide-scrollbar lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible gap-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {BOOTH_STEPS.map((step, idx) => (
          <div 
            key={idx}
            ref={step.isHighlight ? step2Ref : null}
            className={`flex-none w-[85vw] sm:w-[300px] lg:w-auto snap-center flex flex-col bg-white rounded-xl shadow-md overflow-hidden border ${
              step.isHighlight && isDemoMode ? 'border-[var(--color-saffron)] shadow-[var(--color-saffron)] shadow-lg ring-2 ring-[var(--color-saffron)]' : 'border-gray-200'
            } transition-all`}
          >
            <div className={`flex flex-col items-center justify-center p-6 ${
               step.isHighlight && isDemoMode ? 'bg-[var(--color-saffron)] text-navy' : 'bg-[var(--color-navy)]'
            }`}>
              <div className="mb-2">{step.icon}</div>
              <span className={`text-xs font-bold uppercase tracking-widest ${
                step.isHighlight && isDemoMode ? 'text-[var(--color-navy)]' : 'text-[var(--color-saffron)]'
              }`}>{t('Step')} {idx + 1}</span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-3">{t(step.title)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(step.text)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* VVPAT Diagram */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
        <h3 className="text-2xl font-bold text-[var(--color-navy)] mb-6 text-center">{t('Understanding VVPAT')}</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          
          <div className="relative w-64 h-80 bg-gray-100 rounded-lg border-4 border-gray-300 shadow-inner flex flex-col items-center p-4">
            {/* Status Light */}
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] border border-green-700"></div>
            <div className="text-xs font-bold text-gray-400 absolute top-4 left-4">{t('VVPAT')}</div>
            
            {/* Thermal Printer Unit Area */}
            <div className="w-full h-1/3 bg-gray-200 rounded-t border-b-2 border-gray-300 flex items-center justify-center mt-6">
              <span className="text-xs text-gray-500 font-bold">{t('Thermal Printer Unit')}</span>
            </div>
            
            {/* Transparent Window */}
            <div className="w-48 h-32 bg-white border-4 border-gray-800 rounded mt-2 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute top-0 w-full h-full bg-blue-50/30"></div>
               {/* Vote Slip simulation */}
               <div className="w-3/4 h-3/4 bg-white shadow-sm border border-gray-200 flex flex-col px-2 py-1 relative z-10">
                  <div className="h-2 w-12 bg-gray-300 mb-2"></div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-4 rounded-full bg-[var(--color-navy)]"></div>
                    <div className="h-2 w-16 bg-gray-200"></div>
                  </div>
                  <div className="h-2 w-8 bg-gray-300"></div>
               </div>
               <span className="absolute bottom-1 right-2 text-[10px] font-bold text-gray-800 z-20">{t('Transparent Window')}</span>
            </div>

            {/* Drop Box */}
            <div className="flex-1 w-full mt-2 bg-gray-800 rounded-b flex items-center justify-center border-t-4 border-gray-900 border-dashed">
               <span className="text-xs text-gray-300 font-bold">{t('Sealed Drop Box')}</span>
            </div>

            {/* Cable */}
            <div className="absolute -left-12 bottom-12 w-12 h-4 bg-gray-600 rounded-l"></div>
          </div>

          <div className="max-w-md">
            <h4 className="text-lg font-bold text-gray-900 mb-4">{t('Voter Verifiable Paper Audit Trail')}</h4>
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex items-start"><span className="text-[var(--color-saffron)] font-bold mr-2">1.</span> <strong>{t('Transparent Window')}:</strong> {t('Where you see the printed slip for exactly 7 seconds.')}</li>
              <li className="flex items-start"><span className="text-[var(--color-saffron)] font-bold mr-2">2.</span> <strong>{t('Thermal Printer Unit')}:</strong> {t('Instantly prints the slip based on your EVM selection.')}</li>
              <li className="flex items-start"><span className="text-[var(--color-saffron)] font-bold mr-2">3.</span> <strong>{t('Drop Box')}:</strong> {t('The slip automatically cuts and falls into this sealed box.')}</li>
              <li className="flex items-start"><span className="text-[var(--color-saffron)] font-bold mr-2">4.</span> <strong>{t('EVM Connection Port')}:</strong> {t('Connects securely to the main voting machine.')}</li>
            </ul>
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-[var(--color-navy)] rounded text-sm text-gray-800">
              {t('The VVPAT was introduced in Indian elections in 2013. As of 2019, every polling booth in India uses a VVPAT.')}
            </div>
          </div>
        </div>
      </div>

      {/* Indelible Ink Card */}
      <div className="relative overflow-hidden bg-[var(--color-saffron)] rounded-xl shadow-lg p-8 md:p-10 text-[var(--color-navy)]">
        {/* CSS Pattern background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000080 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
        
        {/* Large Fingerprint Icon */}
        <svg className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 text-[var(--color-navy)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12Z"/>
          <path d="M12 6C8.686 6 6 8.686 6 12C6 15.314 8.686 18 12 18"/>
          <path d="M12 9C10.343 9 9 10.343 9 12M12 15C11.171 15 10.5 14.329 10.5 13.5"/>
          <path d="M15 12C15 10.343 13.657 9 12 9"/>
        </svg>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-extrabold mb-6 tracking-tight">{t('The Ink That Protects Democracy')}</h3>
            <div className="space-y-4">
              <div>
                <span className="font-extrabold uppercase text-xs tracking-wider block mb-1 opacity-80">{t('What it is')}</span>
                <p className="font-semibold">{t('A purple-black ink made from Silver Nitrate, applied using a marked pen.')}</p>
              </div>
              <div>
                <span className="font-extrabold uppercase text-xs tracking-wider block mb-1 opacity-80">{t('Which finger')}</span>
                <p className="font-semibold">{t('Left hand index finger, on the nail and skin just below it.')}</p>
              </div>
              <div>
                <span className="font-extrabold uppercase text-xs tracking-wider block mb-1 opacity-80">{t('How long it lasts')}</span>
                <p className="font-semibold">{t('2 to 3 weeks — it cannot be removed by washing, scrubbing, or chemicals.')}</p>
              </div>
              <div>
                <span className="font-extrabold uppercase text-xs tracking-wider block mb-1 opacity-80">{t("Why it's used")}</span>
                <p className="font-semibold">{t('Prevents a person from voting more than once at any booth in the country.')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/20 p-6 rounded-lg backdrop-blur-sm border border-white/30 text-[var(--color-navy)] shadow-inner">
            <h4 className="font-extrabold mb-2 flex items-center">
              <span className="bg-[var(--color-navy)] text-white text-xs px-2 py-1 rounded mr-2 uppercase tracking-wide">{t('Fun Fact')}</span>
            </h4>
            <p className="text-sm font-medium leading-relaxed">
              {t("India's indelible ink is manufactured exclusively by Mysore Paints and Varnish Ltd., a government company established in 1937. It is exported to over 25 countries for their elections!")}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
