import Phaser from 'phaser';
import RoundRectangle from 'phaser3-rex-plugins/plugins/gameobjects/shape/roundrectangle/RoundRectangle';

export default class ShapeRoundRect extends RoundRectangle {
  constructor(scene, x, y, width, height, radius, fillColor, fillAlpha) {
    super(scene, x, y, width, height, radius, fillColor, fillAlpha);
    this.setName('Round-Rectangle');
  }
}

Phaser.GameObjects.GameObjectFactory.register('shapeRoundRect', function shape(x, y, width, height, radius, buttonColor) {
  const shapeRoundRectGO = new ShapeRoundRect(this.scene, x, y, width, height, radius, buttonColor, 1);
  this.displayList.add(shapeRoundRectGO);

  return shapeRoundRectGO;
});
