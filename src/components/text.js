import Phaser from 'phaser';

export default class Text extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style) {
    super(scene, x, y, text, style);
    this.setName('Text');
    this.setOrigin(0.5, 0.5);
  }
}

// USE THIS GAMEOBJECT WHEN YOU NEED TO CREATE STATIC SINGLE TEXT
Phaser.GameObjects.GameObjectFactory.register('singleText', function text(x, y, textContent, fontStyle, fontColor) {
  const singleTextGO = new Text(this.scene, x, y, textContent, {
    font: fontStyle,
    fill: fontColor,
    align: 'center',
  });
  this.displayList.add(singleTextGO);
  return singleTextGO;
});
