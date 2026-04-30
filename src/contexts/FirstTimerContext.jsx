import React, { createContext, useContext, useState, useEffect } from 'react';

const FirstTimerContext = createContext();

export function useFirstTimer() {
  return useContext(FirstTimerContext);
}

export function FirstTimerProvider({ children }) {
  const [isFirstTimer, setIsFirstTimer] = useState(() => {
    const saved = localStorage.getItem('votewise_first_timer');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('votewise_first_timer', isFirstTimer);
  }, [isFirstTimer]);

  const toggleFirstTimer = () => {
    setIsFirstTimer(prev => !prev);
  };

  return (
    <FirstTimerContext.Provider value={{ isFirstTimer, toggleFirstTimer, setIsFirstTimer }}>
      {children}
    </FirstTimerContext.Provider>
  );
}
