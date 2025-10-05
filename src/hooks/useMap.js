// hooks/useMap.js
import { useState, useCallback } from 'react';
import { Map, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Zoom, Rotate, ScaleLine } from 'ol/control';
import { Tile } from 'ol/layer';
import { OSM } from 'ol/source';

export const useMap = () => {
  const [map, setMap] = useState(null);

  const initMap = useCallback((mapElement) => {
    const osmLayer = new Tile({
      source: new OSM(),
      zIndex: -1
    });

    const mapInstance = new Map({
      target: mapElement,
      layers: [osmLayer],
      view: new View({
        center: fromLonLat([30.19, 59.95]),
        zoom: 4
      }),
      controls: [] 
    });

   
    mapInstance.addControl(new Zoom());
    mapInstance.addControl(new Rotate());
    
    const scaleLineControl = new ScaleLine({
      target: document.getElementById('scale-line-container')
    });
    mapInstance.addControl(scaleLineControl);

    const handleResize = () => {
      mapInstance.updateSize();
    };
    
    window.addEventListener('resize', handleResize);
    
    mapInstance.on('unmount', () => {
      window.removeEventListener('resize', handleResize);
    });

    setMap(mapInstance);
    return mapInstance;
  }, []);

  return { map, initMap };
};
