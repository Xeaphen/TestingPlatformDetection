import Phaser from 'phaser';
import ShapeRoundRect from '../components/shape_round-rect';

export default class Progress extends Phaser.GameObjects.Container {
  constructor(scene, x, y, children) {
    super(scene, x, y, children);
  }
}

Phaser.GameObjects.GameObjectFactory.register('progress', function progress(x, y, boxWidth, boxHeight, boxRadius, boxColor, barColor) {
  const progressBoxGO = new ShapeRoundRect(this.scene, 0, 0, boxWidth, boxHeight, boxRadius, boxColor, 1);
  progressBoxGO.setName('Box');
  const progressBarGO = new ShapeRoundRect(this.scene, 0, 0, boxWidth, boxHeight, boxRadius, barColor, 1);
  progressBarGO.setOrigin(0, 0.5);
  progressBarGO.setName('Bar');
  const progressGO = new Progress(this.scene, x, y, [progressBoxGO, progressBarGO]);
  this.displayList.add(progressGO);

  return progressGO;
});
