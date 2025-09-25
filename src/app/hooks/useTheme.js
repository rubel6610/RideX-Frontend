// hooks/useTheme.js
import { useTheme as useThemeContext } from './ThemeContext';

const useTheme = () => {
  return useThemeContext();
};

export default useTheme;