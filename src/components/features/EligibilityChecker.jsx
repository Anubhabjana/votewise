import { useState, useEffect } from 'react';
import { useDemo } from '../../contexts/DemoContext';
import { useFirstTimer } from '../../contexts/FirstTimerContext';
import { useTranslation } from '../../hooks/useTranslation';
import { CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export default function EligibilityChecker() {
  const { isDemoMode } = useDemo();
  const { isFirstTimer } = useFirstTimer();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    age: '',
    citizenship: 'yes',
    competency: 'yes'
  });
  
  const [result, setResult] = useState(null);

  // Demo mode pre-fill
  useEffect(() => {
    if (isDemoMode) {
      setFormData({ age: '20', citizenship: 'yes', competency: 'yes' });
      handleCheck({ preventDefault: () => {} }, { age: '20', citizenship: 'yes', competency: 'yes' });
    } else {
      setFormData({ age: '', citizenship: 'yes', competency: 'yes' });
      setResult(null);
    }
  }, [isDemoMode]);

  function handleCheck(e, explicitData = null) {
    e?.preventDefault();
    const data = explicitData || formData;
    const age = parseInt(data.age, 10);
    
    if (isNaN(age)) {
       setResult({ eligible: false, message: t('Please enter a valid age.'), icon: 'error' });
       return;
    }

    if (data.citizenship === 'no') {
      setResult({ 
        eligible: false, 
        message: isFirstTimer ? t('You need to be a citizen of India to vote here.') : t('You are not yet eligible because you are not an Indian citizen.'), 
        link: 'https://voters.eci.gov.in/',
        linkText: t('Learn about overall eligibility here'),
        icon: 'error'
      });
    } else if (data.competency === 'no') {
      setResult({ 
        eligible: false, 
        message: isFirstTimer ? t('People declared medically unsound by a judge cannot vote.') : t('Individuals declared to be of unsound mind by a competent court cannot be enrolled.'),
        icon: 'error' 
      });
    } else if (age < 18) {
      const yearDifference = 18 - age;
      const futureYear = new Date().getFullYear() + yearDifference;
      setResult({ 
        eligible: false, 
        message: isFirstTimer 
          ? t('You have to wait! You can vote around {year} when you turn 18.').replace('{year}', futureYear) 
          : t('You are not yet eligible because you are under 18. You will be eligible around {year}.').replace('{year}', futureYear),
        link: 'https://voters.eci.gov.in/',
        linkText: t('Check young voter resources'),
        icon: 'wait' 
      });
    } else {
      setResult({ 
        eligible: true, 
        message: isFirstTimer ? t("Awesome! You are ready to vote.") : t('You are eligible to vote!'),
        link: 'https://voters.eci.gov.in/',
        linkText: isFirstTimer ? t("Get your voter card (EPIC) now! →") : t("Register using Form 6 (Voter Registration) →"),
        icon: 'success'
      });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-100 w-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-[var(--color-navy)]">{t('Voter Eligibility Checker')}</h2>
        {isFirstTimer && <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full border border-green-300">{t('Beginner Friendly')}</span>}
      </div>
      <form onSubmit={handleCheck} className="space-y-4">
        
        {/* Age Input */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">{t('How old are you?')}</label>
          <input
            type="number"
            id="age"
            name="age"
            min="0"
            max="120"
            value={formData.age}
            onChange={handleChange}
            className="w-full sm:w-1/2 p-2 border border-gray-300 rounded-md focus:ring-[var(--color-navy)] focus:border-[var(--color-navy)]"
            placeholder={t("e.g. 20")}
            required
            aria-label="Your age"
          />
        </div>

        {/* Citizenship Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Are you a citizen of the country?')}</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" name="citizenship" value="yes" checked={formData.citizenship === 'yes'} onChange={handleChange} className="text-[var(--color-navy)] focus:ring-[var(--color-navy)]" />
              <span className="ml-2 text-gray-700">{t('Yes')}</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="citizenship" value="no" checked={formData.citizenship === 'no'} onChange={handleChange} className="text-[var(--color-navy)] focus:ring-[var(--color-navy)]" />
              <span className="ml-2 text-gray-700">{t('No')}</span>
            </label>
          </div>
        </div>

        {/* Competency Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Have you been declared of unsound mind by a competent court?')}</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="radio" name="competency" value="yes" checked={formData.competency === 'yes'} onChange={handleChange} className="text-[var(--color-navy)] focus:ring-[var(--color-navy)]" />
              <span className="ml-2 text-gray-700">{t('Yes')}</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="competency" value="no" checked={formData.competency === 'no'} onChange={handleChange} className="text-[var(--color-navy)] focus:ring-[var(--color-navy)]" />
              <span className="ml-2 text-gray-700">{t('No')}</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full sm:w-auto px-6 py-2 bg-[var(--color-saffron)] hover:bg-[var(--color-saffron-dark)] text-white font-semibold rounded-md transition-colors"
        >
          {t('Check Eligibility')}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 transition-all animate-fade-in ${
          result.eligible ? 'bg-green-50 border border-green-200' : 
          result.icon === 'wait' ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="mt-0.5 shrink-0">
            {result.icon === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {result.icon === 'wait' && <AlertCircle className="w-5 h-5 text-amber-600" />}
            {result.icon === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
          </div>
          <div>
            <p className={`font-semibold ${
              result.eligible ? 'text-green-800' : 
              result.icon === 'wait' ? 'text-amber-800' : 'text-red-800'
            }`}>{result.message}</p>
            {result.link && (
               <a href={result.link} target="_blank" rel="noreferrer" className={`inline-block mt-2 font-medium hover:underline ${
                result.eligible ? 'text-green-700' : 'text-amber-700'
               }`}>
                 {result.linkText}
               </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
