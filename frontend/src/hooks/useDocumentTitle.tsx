import { useEffect } from 'react';

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `فینیکس کلاب | ${title}`; 
    
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};

export default useDocumentTitle;