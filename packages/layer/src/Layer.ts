/**
 * flaatsjs layer component
 * layer component can render canvas or SVG
 * 
 * @sice 2018.03.29 - draft
 */
'use strict';

// jquery
import $ from 'jquery';

/**
 * layer interface
 */
interface ILayer {
  base?: object | string,
  layerObj?: object,
  name: string,
  layerObjId?: string,
  type: string,
  target: JQuery,
  layerId: string,
  width?: number,
  height?: number,
  zIndex?: number,
  editShape?: object,
  controlBase?: JQuery,
  drawPath?: object,
}

/**
 * option interface
 */
interface Iopt {
  name: string,
  type?: string,
  id: string,
  width?: number,
  height?: number,
  zIndex?: number
}

class Layer implements ILayer{
  /**
   * base element for draw layer
   * 
   * @property base
   * @type {Object|string}
   */
  base?: object | string;
  /**
   * svg, canvas layer object
   * 
   * @property layerObj
   * @type {Object}
   */
  layerObj?: object;
  /**
   * layer name
   * 
   * @property name
   * @type {string}
   */
  name: string;
  /**
   * layer object id
   * 
   * @property layerObjId
   * @type {string}
   */
  layerObjId: string;
  /**
   * layer type (SVG|canvas)
   * 
   * @property type
   * @type {string}
   */
  type: string;
  /**
   * DOM target for render layer & set base
   * 
   * @property target
   * @type {Object}
   */
  target: JQuery;
  /**
   * layer id
   * 
   * @property layerId
   * @type {string}
   */
  layerId: string;
  /**
   * width
   * 
   * @property width
   * @type {number}
   */
  width?: number;
  /**
   * height
   * 
   * @property height
   * @type {number}
   */
  height?: number;
  /**
   * z-index
   * 
   * @property zIndex
   * @type {number}
   */
  zIndex: number;
  /**
   * edit shape object
   * 
   * @property editShape
   * @type {Object}
   */
  editShape?: object;
  /**
   * control base element
   * 
   * @property controlBase
   * @type {Object}
   */
  controlBase?: JQuery;
  /**
   * draw path object
   * 
   * @property drawPath
   * @type {Object}
   */
  drawPath?: object;
  /**
   * layer base image url
   * 
   * @property imageUrl
   * @type {string}
   */
  imageUrl?: string;
  /**
   * image object for lazyload
   * 
   * @property image
   * @type {Object}
   */
  private image?: object;
  /**
   * draw start position
   * 
   * @property drawStartPos
   * @type {Object}
   */
  private drawStartPos?: object;
  /**
   * edit path array
   * 
   * @property editPathArr
   * @type {Array}
   */
  private editPathArr: Array<any>;
  /**
   * object group
   * 
   * @property group
   * @type {Object}
   */
  private group: object;
  /**
   * unique id
   * 
   * @property uniqueId
   * @type {number}
   */
  private uniqueId: number;
  /**
   * line link array
   * 
   * @property linkInfo
   * @type {Array}
   */
  private linkInfo: Array<any>;
  /**
   * selected object array
   * 
   * @property selectedShape
   * @type {Array}
   */
  private selectedShape: Array<any>;
  /**
   * constructor
   */
  constructor(target: JQuery, opt: Iopt) {
    this.base = null;
    this.layerObj = null;
    this.name = opt.name;
    this.type = opt.type || 'canvas';
    this.target = target;
    this.layerId = opt.id;
    this.width = opt.width || 3000;
    this.height = opt.height || 2000;
    this.zIndex = (opt.zIndex || 0) + 1;
    this.editShape = null;
    this.controlBase = null ;
    this.drawPath = null;
    this.drawStartPos = null;
    this.editPathArr = [];
    this.group = {};
    this.uniqueId = 0;
    this.selectedShape = [];
    this.imageUrl = null;
    this.image = null;
    this.linkInfo = null;
    this.drawStartPos = null;
  }

  /**
   * layer initialize
   * 
   * @memberof Layer
   * @function initialize
   */
  initialize() {
    // control base binding
    this.controlBase = this.getControlBase();
    // layer base binding
    const layerBase = this.getLayerBase();
    
    this.setBase(layerBase);
  }

  /**
   * set layer base
   * 
   * @memberof Layer
   * @function setBase
   * @prarm {Object} layerBase layer base
   */
  setBase(layerBase: JQuery, callback: Function = () => {}): void {
    try {
      // layer-id binding
      layerBase.attr('layer-id', this.layerId);

      // added text layer
      layerBase.append(this.controlBase);

      this.target
        .append(layerBase);

      switch(this.type) {
        case 'canvas':
          // add layer obj id
          this.layerObjId = `canvas-${this.layerId}`;
          // layer obj canvas generate
          const canvas = document.createElement('canvas');
          // set canvas id
          canvas.id = this.layerObjId;

          // set layer width, height
          canvas.width = this.width;
          canvas.height = this.height;

          // set layer object
          this.layerObj = canvas;
          break;
        case 'svg':
          throw new Error('SVG base not supported this version');
      }
      // set base
      this.base = layerBase;

      callback(this.layerObj);
    } catch(e) {
      throw new Error(`layer setting error: ${e.toString()}`);
    }
  }

  /**
   * make control base
   * 
   * @memberof Layer
   * @function getControlBase
   * @return {JQueryElement} control base element object
   */
  getControlBase(): JQuery {
    // control base
    const controlBase = $('<div class="control-base"></div>')
      .css({
        'width': '100%',
        'height': '100%',
        'position': 'absolute',
        'pointer-events': 'none'
      });
   
    return controlBase;
  }

  /**
   * make layer base
   * 
   * @memberof Layer
   * @function getLayerBase
   * @return {JQueryElement} layer base element
   */
  getLayerBase(): JQuery {
    const layerBase = $('<div class="layer-base"></div>')
      .css({
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'z-index': this.zIndex,
        'width': this.width,
        'height': this.height
      });

    return layerBase;
  }

  getOptions(opt: string) {
    if (!opt) {
      throw new Error('option is not defined.');
    }

    if (this[opt]) {
      return this[opt];
    } else {
      return null;
    }
  }
}

export default Layer