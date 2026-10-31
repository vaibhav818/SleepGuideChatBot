import React, { createContext, useContext, useState, useEffect } from 'react';

export const PALETTES = {
  seafoamAurora: {
    id: 'seafoamAurora',
    name: 'Seafoam & Aurora',
    tagline: 'Option 4: Bioluminescent seafoam & misty celestial cyan',
    bgDark: '#060A0F',
    bgSubtle: 'rgba(10, 18, 28, 0.75)',
    cardGlass: 'rgba(12, 23, 36, 0.65)',
    cardGlassHover: 'rgba(16, 30, 48, 0.85)',
    border: 'rgba(45, 212, 191, 0.16)',
    borderHover: 'rgba(45, 212, 191, 0.38)',
    accentPrimary: '#2DD4BF',
    accentSecondary: '#38BDF8',
    accentMuted: 'rgba(45, 212, 191, 0.15)',
    glowColor: 'rgba(45, 212, 191, 0.28)',
    textHighlight: '#99F6E4',
    orbGradient:
      'radial-gradient(circle at 40% 40%, rgba(45, 212, 191, 0.45) 0%, rgba(14, 165, 233, 0.2) 50%, rgba(6, 10, 15, 0) 80%)',
    pillActive: '#2DD4BF',
    pillActiveText: '#041F1A',
  },
  duneSand: {
    id: 'duneSand',
    name: 'Dune & Amber Sand',
    tagline: 'Option 2: Earthy oat, honey sand & soft candlelight',
    bgDark: '#0B0907',
    bgSubtle: 'rgba(22, 18, 14, 0.75)',
    cardGlass: 'rgba(26, 21, 16, 0.65)',
    cardGlassHover: 'rgba(36, 29, 22, 0.85)',
    border: 'rgba(226, 179, 118, 0.18)',
    borderHover: 'rgba(226, 179, 118, 0.42)',
    accentPrimary: '#E2B376',
    accentSecondary: '#D49755',
    accentMuted: 'rgba(226, 179, 118, 0.18)',
    glowColor: 'rgba(226, 179, 118, 0.28)',
    textHighlight: '#FDE68A',
    orbGradient:
      'radial-gradient(circle at 40% 40%, rgba(226, 179, 118, 0.45) 0%, rgba(180, 83, 9, 0.2) 50%, rgba(11, 9, 7, 0) 80%)',
    pillActive: '#E2B376',
    pillActiveText: '#251403',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [selectedPalette, setSelectedPalette] = useState(() => {
    return localStorage.getItem('somna_theme') || 'seafoamAurora';
  });

  const theme = PALETTES[selectedPalette] || PALETTES.seafoamAurora;

  const setPalette = (id) => {
    if (PALETTES[id]) {
      setSelectedPalette(id);
      localStorage.setItem('somna_theme', id);
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = theme.bgDark;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ selectedPalette, setSelectedPalette: setPalette, theme, PALETTES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

