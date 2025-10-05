import { useCallback } from 'react';

export const useSidebar = () => {
  const initSidebar = useCallback(() => {
    console.log('Sidebar initialized');
  }, []);

  return { initSidebar };
};
