import { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  // Load initial state from localStorage or default to normal
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('votewise_text_size') || 'normal'; // 'normal', 'large', 'xl'
  });
  
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('votewise_contrast') === 'true';
  });

  // Apply to document root whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Reset existing classes
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xl', 'high-contrast');
    
    // Apply new classes
    root.classList.add(`text-size-${textSize}`);
    if (highContrast) {
      root.classList.add('high-contrast');
    }

    localStorage.setItem('votewise_text_size', textSize);
    localStorage.setItem('votewise_contrast', highContrast);
  }, [textSize, highContrast]);

  const increaseTextSize = () => {
    setTextSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xl';
      return 'xl';
    });
  };

  const decreaseTextSize = () => {
    setTextSize(prev => {
      if (prev === 'xl') return 'large';
      if (prev === 'large') return 'normal';
      return 'normal';
    });
  };

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  return (
    <AccessibilityContext.Provider value={{
      textSize,
      increaseTextSize,
      decreaseTextSize,
      highContrast,
      toggleHighContrast
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
