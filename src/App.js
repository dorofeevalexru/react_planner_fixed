import React, { useRef, useEffect, useState } from 'react';
import Footer from './components/Footer/Footer';
import Sidebar from './components/Sidebar/Sidebar';
import Map from './components/Map/Map';
import BaseMapControl from './components/BaseMapControl/BaseMapControl';
import { useMap } from './hooks/useMap';
import './styles/base.css';
import './styles/header-footer.css';
import './styles/info-control.css';
import './styles/layer-tree.css';
import './styles/sidebar.css';

function App() {
  const mapRef = useRef(null);
  const { map, initMap } = useMap();
  const [layerConfig, setLayerConfig] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false); // Добавляем флаг инициализации

  useEffect(() => {
    // Инициализируем карту только 1 раз
    if (mapRef.current && !map && !mapInitialized) {
      console.log('Initializing map...');
      setMapInitialized(true); // Помечаем что инициализация началась
      
      const mapInstance = initMap(mapRef.current);
      
      // Загрузка конфигурации слоев
      const loadLayerConfig = async () => {
        try {
          const response = await fetch(process.env.PUBLIC_URL + '/config/layers.json');
          if (response.ok) {
            const config = await response.json();
            setLayerConfig(config);
          } else {
            console.warn('Layer config not found, using fallback');
            setLayerConfig({
              name: "Fallback Config",
              nodes: []
            });
          }
        } catch (error) {
          console.error('Failed to load layer config:', error);
          setLayerConfig({
            name: "Fallback Config", 
            nodes: []
          });
        }
      };

      loadLayerConfig();
    }
  }, [map, initMap, mapInitialized]); // Добавляем mapInitialized в зависимости

  // Очищаем дубликаты если они появились
  useEffect(() => {
    if (map) {
      const cleanup = () => {
        // Удаляем все canvas кроме нашего
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
          if (!mapRef.current?.contains(canvas)) {
            canvas.remove();
          }
        });
        
        // Удаляем дублирующиеся элементы управления
        const zoomControls = document.querySelectorAll('.ol-zoom');
        if (zoomControls.length > 1) {
          for (let i = 1; i < zoomControls.length; i++) {
            zoomControls[i].remove();
          }
        }
      };
      
      // Очищаем сразу и при ресайзе
      cleanup();
      window.addEventListener('resize', cleanup);
      
      return () => window.removeEventListener('resize', cleanup);
    }
  }, [map]);

  return (
    <div className="app">
      <div className="main-content">
        <Sidebar map={map} layerConfig={layerConfig} />
        <Map mapRef={mapRef} />
        {/* Рендерим BaseMapControl только когда карта готова */}
        {map && <BaseMapControl map={map} />}
        <div id="scale-line-container" className="scale-line-container"></div>
      </div>
      <Footer />
    </div>
  );
}

export default App;