import { useEffect, useState } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        // Check localStorage or fallback to 'light'
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        // Set class on body
        document.documentElement.classList.toggle('dark', theme === 'dark');

        // Save theme in localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Toggle function
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
};

export default useTheme;
