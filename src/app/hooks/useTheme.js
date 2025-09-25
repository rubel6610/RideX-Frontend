// hooks/useTheme.js
import { useTheme as useThemeContext } from './themeContext';

const useTheme = () => {
  return useThemeContext();
};

export default useTheme;