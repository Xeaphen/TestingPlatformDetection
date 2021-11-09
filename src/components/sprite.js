import Phaser from 'phaser';

export default class Sprite extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setName('Sprite');
    this.setOrigin(0.5, 0.5);
  }
}

Phaser.GameObjects.GameObjectFactory.register('singleSprite', function text(x, y, texture, scaleX = 1, scaleY = scaleX) {
  const singleSpriteGO = new Sprite(this.scene, x, y, texture);
  singleSpriteGO.setScale(scaleX, scaleY);
  this.displayList.add(singleSpriteGO);
  return singleSpriteGO;
});
