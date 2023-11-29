import { createContext } from 'react';

const DarkModeContext = createContext({
  darkMode: 'dark',
  setDarkMode: () => {},
});

export default DarkModeContext;
