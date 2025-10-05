import { useCallback } from 'react';

export const useLayerTree = () => {
  const initLayerTree = useCallback((map) => {
    //  Заглушка для инициализация дерева слоев 
    console.log('Layer tree initialized with map:', map);
  }, []);

  return { initLayerTree };
};
