import Phaser from 'phaser';

export default class ShapeRect extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width, height, fillColor, fillAlpha) {
    super(scene, x, y, width, height, fillColor, fillAlpha);
    this.setName('shapeRectangle');
  }
}

Phaser.GameObjects.GameObjectFactory.register('shapeRectangle', function shape(x, y, width, height, fillColor, fillAlpha) {
  const rectangleGo = new ShapeRect(this.scene, x, y, width, height, fillColor, fillAlpha);
  this.displayList.add(rectangleGo);

  return rectangleGo;
});
