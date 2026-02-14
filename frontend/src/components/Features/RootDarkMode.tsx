import { useEffect } from "react";
import { useAppSelector } from "../../store/hook";
// import { setDarkMode } from "../../store/features/darkModeSlice";

export const RootDarkMode = () => {
  const { darkMode } = useAppSelector((state) => state.darkMode);
  // const dispatch = useAppDispatch();

  useEffect(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  
  const isDarkMode = savedDarkMode === 'true';
  
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return null;
};