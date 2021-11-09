import Phaser from 'phaser';
import ShapeRoundRect from '../components/shape_round-rect';
import Text from '../components/text';

export default class ButtonRoundRect extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children) {
    super(scene, x, y, children);
  }
}

// USE THIS GAMEOBJECT WHEN YOU NEED TO CREATE ROUND RECTANGLE BUTTON AND ITS CLICK EVENT

Phaser.GameObjects.GameObjectFactory.register('buttonRoundRect', function button(x, y, width, height, radius, buttonColor, text, textConfig) {
  const shapeRoundRectGO = new ShapeRoundRect(this.scene, 0, 0, width, height, radius, buttonColor, 1);
  const textGO = new Text(this.scene, 0, 0, text, textConfig);
  const buttonGO = new ButtonRoundRect(this.scene, x, y, [shapeRoundRectGO, textGO]);
  buttonGO.setSize(shapeRoundRectGO.displayWidth, shapeRoundRectGO.displayHeight);
  buttonGO.setInteractive();
  this.displayList.add(buttonGO);

  return buttonGO;
});
