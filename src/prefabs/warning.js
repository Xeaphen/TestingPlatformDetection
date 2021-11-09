import Phaser from 'phaser';
// import ShapeRoundRect from '../components/shape_round-rect';
import Sprite from '../components/sprite';
import Text from '../components/text';

export default class WarningBox extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children) {
    super(scene, x, y, children);
  }
}

// USE THIS GAMEOBJECT WHEN YOU NEED TO CREATE ROUND RECTANGLE BUTTON AND ITS CLICK EVENT

Phaser.GameObjects.GameObjectFactory.register('warningBox', function box(x, y, key, text, textConfig) {
  const warningBoxGO = new Sprite(this.scene, 0, 0, key);
  const warningTextGO = new Text(this.scene, 0, 0, text, textConfig);
  const warningPanelGO = new WarningBox(this.scene, x, y, [warningBoxGO, warningTextGO]);
  warningPanelGO.setSize(warningBoxGO.displayWidth, warningBoxGO.displayHeight);
  warningPanelGO.setScale(0.6);
  warningPanelGO.setDepth(5);
  this.displayList.add(warningPanelGO);

  return warningPanelGO;
});
