import { Control } from 'ol/control';
import { Tile } from 'ol/layer';
import { OSM, XYZ } from 'ol/source';

export class BaseMapControl extends Control {
  constructor(opt_options = {}) {
    const defaultOptions = {
      element: document.createElement('div'),
      target: opt_options?.target,
      tip: 'Copyright',
      label: '©',
      labelCollapsed: "»",
      collapsed: false,
      show: true,
      currentLayer: 0,
    };

    const options = { ...defaultOptions, ...opt_options };
    
    super({
      element: options.element,
      target: options.target
    });

    this.options = options;
    this.initBaseLayers();
    this.initStyles();
    this.initControlElement();
  }

  initBaseLayers() {
    this.options.base_layers = {
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
        'layer': this.createTileLayer('https://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1.1'),
        'copyright': '2gis',
        'copyright_url': 'https://law.2gis.ru/copyright'
      },
      2: {
        'name': 'Yandex Map',
        'layer': this.createTileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&projection=web_mercator'),
        'copyright': 'Yandex Maps',
        'copyright_url': 'https://yandex.ru/legal/maps_termsofuse/?lang=en'
      },
      3: {
        'name': 'Google Satellite',
        'layer': this.createTileLayer('https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'),
        'copyright': 'Google Maps',
        'copyright_url': 'https://www.google.com/intl/en-US/help/terms_maps/'
      },
      4: {
        'name': 'Google Hybrid',
        'layer': this.createTileLayer('https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'),
        'copyright': 'Google Maps',
        'copyright_url': 'https://www.google.com/intl/en-US/help/terms_maps/'
      },
      5: {
        'name': 'ERSI Satellite',
        'layer': this.createTileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
        'copyright': 'ERSI World Imagery',
        'copyright_url': 'https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9'
      }
    };
  }

  initStyles() {
        this.style = {
            control: "map-info-control",
            control_collapse: "map-info-collapsed",
            control_box: "map-info-box",
            control_wrapper: "map-info-wrapper",
            control_title: "map-info-title",
            control_value: "map-info-value"
        };
    }

    initControlElement() {
        const root = this.element;
        root.className = `${this.style.control} ol-unselectable ol-control`;
        
        if (this.options.show) {
            this.createBodyElement(root);
        }
    }

    createBodyElement(root) {
        const collapseButton = document.createElement('button');
        collapseButton.innerHTML = this.options.labelCollapsed;
        collapseButton.title = this.options.tip;

        collapseButton.addEventListener("click", () => {
            root.classList.toggle(this.style.control_collapse);
            collapseButton.innerHTML = root.classList.contains(this.style.control_collapse) ? 
                this.options.label : this.options.labelCollapsed;
        });

        if (this.options.collapsed) {
            root.classList.add(this.style.control_collapse);
            collapseButton.innerHTML = this.options.label;
        }

        const controlBody = document.createElement('div');
        controlBody.className = this.style.control_box;
        controlBody.appendChild(this.createElement(
            this.options.id, 
            this.options.label, 
            "None", 
            this.options.tip
        ));

        root.appendChild(controlBody);
        root.appendChild(collapseButton);
    }

    createElement(id, title, text, tip) {
        const element = document.createElement('div');
        element.className = this.style.control_wrapper;
        element.title = tip || "";

        const titleElement = document.createElement('div');
        titleElement.innerHTML = title || "";
        titleElement.className = this.style.control_title;

        const valueElement = document.createElement('div');
        valueElement.innerHTML = text || "";
        if (id) valueElement.id = id;
        valueElement.className = this.style.control_value;

        element.appendChild(titleElement);
        element.appendChild(valueElement);

        return element;
    }

    createTileLayer(url, crs = 'EPSG:3857') {
        return new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: url,
                projection: crs,
                crossOrigin: "Anonymous"
            }),
            zIndex: -1
        });
    }

    setCopyrightText(text, link) {
        const elem = document.getElementById(this.options.id);
        if (!elem) return;

        elem.innerHTML = '';
        const textLink = document.createElement('a');
        textLink.textContent = text;
        textLink.href = link;
        textLink.target = '_blank';
        elem.appendChild(textLink);
    }

    setBasemap(id) {
        const map = this.getMap();
        if (!map) {
            console.warn('Map not available for setBasemap');
            return false;
        }

        if (id in this.options.base_layers) {
            // Удаление старый базовый слой
            if (this.options.currentLayer in this.options.base_layers) {
                map.removeLayer(this.options.base_layers[this.options.currentLayer].layer);
            }

            //  новый базовый слой
            this.options.currentLayer = id;
            map.addLayer(this.options.base_layers[id].layer);
            
            //  копирайт
            if (this.options.show) {
                this.setCopyrightText(
                    this.options.base_layers[id].copyright,
                    this.options.base_layers[id].copyright_url
                );
            }
            
            return true;
        }
        
        return false;
    }

    getBasemaps() {
        const nameMap = {};
        for (const key in this.options.base_layers) {
            nameMap[key] = this.options.base_layers[key].name;
        }
        return nameMap;
    }

    fillBaseMap(selectId) {
        const select = document.getElementById(selectId);
        if (!select) {
            console.error(`Select element with ID "${selectId}" not found`);
            return;
        }

        // Очищаем и заполняем select
        select.innerHTML = '';
        const layers = this.getBasemaps();

        for (const [key, name] of Object.entries(layers)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = name;
            select.appendChild(option);
        }

        // Обработчик изменения
        select.addEventListener('change', () => {
            this.setBasemap(select.value);
        });

        // начальный слой
        this.setBasemap(this.options.currentLayer);
    }

    setMap(map) {
        super.setMap(map);
        // После привязки к карте - устанавливение базового слоя
        if (map) {
            this.setBasemap(this.options.currentLayer);
        }
    }
}


export default BaseMapControl;