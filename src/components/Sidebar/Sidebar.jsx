// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import LayerTree from '../LayerTree/LayerTree';
import './Sidebar.css';

const Sidebar = ({ map, layerConfig, onStateChange }) => { // Добавляем onStateChange
  const [activeTab, setActiveTab] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const tabs = [
    { id: 'layers', icon: 'fa-layer-group', title: 'Слои' },
    { id: 'schedule', icon: 'fa-bars', title: 'Расписание приёма' },
    { id: 'local-settings', icon: 'fa-cog', title: 'Настройки' }
  ];

  // Уведомляем родительский компонент об изменении состояния
  useEffect(() => {
    if (onStateChange) {
      onStateChange(!isCollapsed);
    }
  }, [isCollapsed, onStateChange]);

  // Обновляем размер карты при изменении состояния сайдбара
  useEffect(() => {
    if (map) {
      const timer = setTimeout(() => {
        map.updateSize();
        map.getControls().forEach(control => {
          if (control.changed) {
            control.changed();
          }
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isCollapsed, activeTab, map]);

  const handleTabClick = (tabId) => {
    if (activeTab === tabId) {
      setIsCollapsed(true);
      setActiveTab(null);
    } else {
      setActiveTab(tabId);
      setIsCollapsed(false);
    }
  };

  const handleClose = () => {
    setIsCollapsed(true);
    setActiveTab(null);
  };

  return (
    <div className={`sidebar sidebar-left ${isCollapsed ? 'collapsed' : ''}`}>
      {/* остальной код без изменений */}
      <div className="sidebar-tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
            role="tab"
            onClick={() => handleTabClick(tab.id)}
          >
            <a href={`#${tab.id}`}>
              <i className={`fa ${tab.icon}`}></i>
            </a>
          </div>
        ))}
      </div>
      
      <div className="sidebar-pane-wrapper">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`sidebar-pane ${activeTab === tab.id ? 'active' : ''}`}
            id={tab.id}
          >
            <div className="sidebar-header">
              {tab.title}
              <div className="sidebar-close" onClick={handleClose}>
                <i className="fa fa-times"></i>
              </div>
            </div>
            <div className="sidebar-content-wrapper">
              <div className="sidebar-content-box">
                {tab.id === 'layers' && map && layerConfig && (
                  <LayerTree map={map} layerConfig={layerConfig} />
                )}
                {tab.id === 'schedule' && (
                  <div id="scheduleTable" style={{ height: '100%', overflowY: 'auto' }}>
                    Расписание будет здесь
                  </div>
                )}
                {tab.id === 'local-settings' && (
                  <>
                    <div className="sidebar-content-row">
                      <label htmlFor="satelliteSelect" className="sidebar-content-row-name">
                        Текущий спутник:
                      </label>
                      <select id="satelliteSelect" className="sidebar-content-row-value">
                        <option value="satellite1">Спутник 1</option>
                        <option value="satellite2">Спутник 2</option>
                      </select>
                    </div>
                    <div className="sidebar-content-row">
                      <label htmlFor="base-layer-map-setting" className="sidebar-content-row-name">
                        Базовый слой
                      </label>
                      <select id="base-layer-map-setting" className="sidebar-content-row-value">
                        <option value="osm">OpenStreetMap</option>
                        <option value="satellite">Спутник</option>
                      </select>
                    </div>
                    <div className="sidebar-content-row">
                      <div className="sidebar-content-row-name">3D отображение</div>
                      <div className="sidebar-content-row-value">
                        <label className="switch">
                          <input id="toggle3d" type="checkbox" />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;