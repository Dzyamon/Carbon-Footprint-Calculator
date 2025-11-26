import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: 'normal' | 'large';
  toggleFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleFontSize = () => setFontSize(prev => prev === 'normal' ? 'large' : 'normal');

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleHighContrast, fontSize, toggleFontSize }}>
      <div className={`${highContrast ? 'high-contrast' : ''} ${fontSize === 'large' ? 'text-lg' : ''}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
