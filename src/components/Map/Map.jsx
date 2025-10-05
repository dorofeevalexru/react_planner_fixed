import React from 'react';
import './Map.css';

const Map = ({ mapRef }) => {
  return <div ref={mapRef} className="map-container" id="map"></div>;
};



export default Map;