import Phaser from 'phaser';
import Sprite from '../components/sprite';

Phaser.GameObjects.GameObjectFactory.register('buttonSprite', function button(x, y, key, event) {
  const spriteGO = new Sprite(this.scene, x, y, key);
  spriteGO.setInteractive();
  spriteGO.on('pointerup', event);
  this.displayList(spriteGO);

  return spriteGO;
});
