'use strict'

import $ from 'jquery';
import Layer from '../src/Layer'
import {expect} from 'chai'

describe('flaatsjs layer component test', () => {
  const $targetEl = $('<div></div>');
  const layer = new Layer($targetEl, {
    id: 'test',
    name: 'test',
    type: 'canvas',
  });

  it('1. Layer class setting', () => {
    expect(typeof layer).to.equal('object');
  });

  it('2. Layer control base is object', () => {
    expect(typeof layer.getOptions('controlBase')).to.equal('object');
  });

  it('3. Layer layer base is object', () => {
    expect(typeof layer.getOptions('layerBase')).to.equal('object');
  });

  it('4. Layer default width is 3000', () => {
    expect(layer.getOptions('width')).to.equal(3000);
  });

  it('5. Layer default height is 2000', () => {
    expect(layer.getOptions('height')).to.equal(2000);
  });

  it('6. Layer layerObj is canvas', () => {
    const layerBase = layer.getLayerBase();
    layer.setBase(layerBase, (base) => {
      expect(base.tagName).to.equal('CANVAS');
    });
  });
});