import React, { useEffect, useState } from 'react';
import { Tile } from 'ol/layer';
import { OSM, XYZ } from 'ol/source';
import './BaseMapControl.css';

const BaseMapControl = ({ map }) => {
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log('Бэйзмэп рендер');
  const baseLayers = {
    0: {
      'name': 'Open Street Map',
      'layer': new Tile({
        source: new OSM(),
        zIndex: -1
      }),
      'copyright': 'OpenStreetMap',
      'copyright_url': 'https://www.openstreetmap.org/copyright'
    },
    1: {
      'name': '2gis',
      'layer': new Tile({
        source: new XYZ({
          url: 'https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1.1',
          crossOrigin: 'Anonymous'
        }),
        zIndex: -1
      }),
      'copyright': '2gis',
      'copyright_url': 'https://law.2gis.ru/copyright'
    },
    2: {
      'name': 'Yandex Map',
      'layer': new Tile({
        source: new XYZ({
          url: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&projection=web_mercator',
          crossOrigin: 'Anonymous'
        }),
        zIndex: -1
      }),
      'copyright': 'Yandex Maps',
      'copyright_url': 'https://yandex.ru/legal/maps_termsofuse/?lang=en'
    },
    3: {
      'name': 'Google Satellite',
      'layer': new Tile({
        source: new XYZ({
          url: 'https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}',
          crossOrigin: 'Anonymous'
        }),
        zIndex: -1
      }),
      'copyright': 'Google Maps',
      'copyright_url': 'https://www.google.com/intl/en-US/help/terms_maps/'
    },
    4: {
      'name': 'Google Hybrid',
      'layer': new Tile({
        source: new XYZ({
          url: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
          crossOrigin: 'Anonymous'
        }),
        zIndex: -1
      }),
      'copyright': 'Google Maps',
      'copyright_url': 'https://www.google.com/intl/en-US/help/terms_maps/'
    },
    5: {
      'name': 'ERSI Satellite',
      'layer': new Tile({
        source: new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          crossOrigin: 'Anonymous'
        }),
        zIndex: -1
      }),
      'copyright': 'ERSI World Imagery',
      'copyright_url': 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9'
    }
  };

  useEffect(() => {
    if (map) {
      setBasemap(currentLayer);
    }
  }, [map, currentLayer]);

  const setBasemap = (id) => {
    if (!map) return;

    // Удаление старый базовый слой
    map.getLayers().getArray().forEach(layer => {
      if (layer.get('isBaseLayer')) {
        map.removeLayer(layer);
      }
    });

    // новый базовый слой
    if (baseLayers[id]) {
      const newLayer = baseLayers[id].layer;
      newLayer.set('isBaseLayer', true);
      map.addLayer(newLayer);
      setCurrentLayer(id);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`map-info-control ol-unselectable ol-control ${isCollapsed ? 'map-info-collapsed' : ''}`}>
      <div className="map-info-box">
        <div className="map-info-wrapper">
          <div className="map-info-title">©</div>
          <div className="map-info-value">
            <a 
              href={baseLayers[currentLayer].copyright_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {baseLayers[currentLayer].copyright}
            </a>
          </div>
        </div>
      </div>
      <button onClick={toggleCollapse} title={isCollapsed ? "Развернуть" : "Свернуть"}>
        {isCollapsed ? '»' : '‹'}
      </button>
    </div>
  );
};

export default BaseMapControl;
