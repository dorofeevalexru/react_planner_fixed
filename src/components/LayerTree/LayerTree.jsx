import React, { useState } from 'react';
import './LayerTree.css';

const LayerTree = ({ map, layerConfig }) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  if (!layerConfig || !map) {
    return <div className="layer-tree-loading">Загрузка конфигурации слоев...</div>;
  }

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const toggleLayerVisibility = (layerConfig, isVisible) => {
    console.log('Toggle layer:', layerConfig.name, isVisible);
    // Сюда логику добавления И удаления слоев на карту
  };

  const renderTreeNode = (node, level = 0) => {
    if (node.nodes && node.nodes.length > 0) {
      // Это группа
      const isExpanded = expandedGroups[node.name] || false;
      
      return (
        <li key={node.name} className="group">
          <span 
            className="group-toggle"
            onClick={() => toggleGroup(node.name)}
          >
            <i className={`fas fa-caret-${isExpanded ? 'down' : 'right'}`}></i>
          </span>
          <input 
            type="checkbox" 
            id={`group-${node.name}`}
            onChange={(e) => {
              // Переключение видимость всех дочерних элементов
              node.nodes.forEach(child => {
                if (child.nodes) {
                  // Это подгруппа
                  child.nodes.forEach(subChild => {
                    toggleLayerVisibility(subChild, e.target.checked);
                  });
                } else {
                  // Это слой
                  toggleLayerVisibility(child, e.target.checked);
                }
              });
            }}
          />
          <label htmlFor={`group-${node.name}`}>{node.name}</label>
          {isExpanded && (
            <ul>
              {node.nodes.map(childNode => renderTreeNode(childNode, level + 1))}
            </ul>
          )}
        </li>
      );
    } else {
      // Это слой
      return (
        <li key={node.name} className="layer">
          <input 
            type="checkbox" 
            id={`layer-${node.layers || node.name}`}
            onChange={(e) => toggleLayerVisibility(node, e.target.checked)}
          />
          <span className="layer-type-icon">
            {node.type === 'point' && <i className="fas fa-map-marker-alt"></i>}
            {node.type === 'line' && <i className="fas fa-minus"></i>}
            {node.type === 'polygon' && <i className="fas fa-vector-square"></i>}
            {!['point', 'line', 'polygon'].includes(node.type) && <i className="fas fa-layer-group"></i>}
          </span>
          <label htmlFor={`layer-${node.layers || node.name}`} title={node.layers || node.name}>
            {node.name}
          </label>
        </li>
      );
    }
  };

  return (
    <div className="layer-tree-container">
      <div className="layer-tree-header">
        <h3>{layerConfig.name}</h3>
      </div>
      <ul className="layer-tree">
        {layerConfig.nodes.map(node => renderTreeNode(node))}
      </ul>
    </div>
  );
};

export default LayerTree;
