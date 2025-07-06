import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSize = 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  getFontSizeClass: () => string;
  getLineHeightClass: () => string;
  getLetterSpacingClass: () => string;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

const fontSizeClasses = {
  lg: 'text-xl',      // 20px - Standard size (old "Muito Grande")
  xl: 'text-2xl',     // 24px 
  '2xl': 'text-3xl',  // 30px 
  '3xl': 'text-4xl',  // 36px 
  '4xl': 'text-5xl'   // 48px
};

const lineHeightClasses = {
  lg: 'leading-relaxed',
  xl: 'leading-snug',
  '2xl': 'leading-snug',
  '3xl': 'leading-tight',
  '4xl': 'leading-tight'
};

const letterSpacingClasses = {
  lg: 'tracking-wide',
  xl: 'tracking-wide',
  '2xl': 'tracking-wide',
  '3xl': 'tracking-tight',
  '4xl': 'tracking-tight'
};

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('lg'); // Standard size (20px - old "Muito Grande")

  // Load font size from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('rosary-font-size') as FontSize;
    if (savedFontSize && fontSizeClasses[savedFontSize]) {
      setFontSize(savedFontSize);
    }
  }, []);

  // Save font size to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('rosary-font-size', fontSize);
  }, [fontSize]);

  const getFontSizeClass = () => fontSizeClasses[fontSize];
  const getLineHeightClass = () => lineHeightClasses[fontSize];
  const getLetterSpacingClass = () => letterSpacingClasses[fontSize];

  return (
    <FontSizeContext.Provider value={{ 
      fontSize, 
      setFontSize, 
      getFontSizeClass, 
      getLineHeightClass, 
      getLetterSpacingClass 
    }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}