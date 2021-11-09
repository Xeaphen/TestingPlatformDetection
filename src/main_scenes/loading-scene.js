import Phaser from 'phaser';
import '../components/shape_round-rect';
import '../prefabs/progress';

let isComplete = false;
let isError = false;

export default class Loading extends Phaser.Scene {
  constructor() {
    super({
      key: 'LOADING',
      pack: {
        files: [
          { type: 'image', key: 'HOME_BG', url: './src/assets/HOME_BG.jpg' },
          { type: 'image', key: 'TITLE', url: './src/assets/LOGO.png' },
        ],
      },
    });
  }

  preload() {
    this.add.sprite(360, 640, 'HOME_BG').setScale(0.32);
    this.add.sprite(360, 270, 'TITLE').setScale(0.8);
    this.load.image('OK_BUTTON', './src/assets/OK.png');
    this.load.image('CLOSE_BUTTON', './src/assets/CLOSE.png');
    this.load.image('PINATA', './src/assets/PINATA.png');
    this.load.image('CANDY', './src/assets/CANDY.png');
    this.load.image('TITLE', './src/assets/LOGO.png');
    this.load.image('CORE_BG', './src/assets/CORE_BG.jpg');
    this.load.image('SMALLP', './src/assets/SMALL_PINATA.png');
    this.load.image('MEDIUMP', './src/assets/MEDIUM_PINATA.png');
    this.load.image('LARGEP', './src/assets/LARGE_PINATA.png');
    this.load.image('HOOK', './src/assets/HOOK.png');
    this.load.image('COUPON', './src/assets/COUPON.png');
    this.load.image('ROPE', './src/assets/ROPE.png');
    this.load.image('HP_ICON', './src/assets/POWER.png');
    this.load.image('WARNING', './src/assets/WarningBox.png');
    this.load.image('REWARD_DIALOG', './src/assets/REWARD_DIALOG.png');
    // this.load.image('ADBACKGROUND', './src/assets/ADBACKGROUND.png');
    // this.load.video('DUMMY','./src/assets/Video/dummyVideo.mp4');
    this.load.video('DUMMY', './src/assets/Video/dummyVideo.mp4', 'loadeddata', false, true);
    this.load.video('DUMMY2', './src/assets/Video/dummyVideo2.mp4', 'loadeddata', false, true);
    this.load.video('DUMMY3', './src/assets/Video/dummyVideo3.mp4', 'loadeddata', false, true);
    this.load.spritesheet('CONFETTI', './src/assets/CONFETTI.png', {
      frameWidth: 512,
      frameHeight: 512,
    });
    this.load.spritesheet('PINATA_HIT', './src/assets/PINATA_HIT.png', {
      frameWidth: 276,
      frameHeight: 274,
    });
    this.load.spritesheet('PINATA_FRACTURED', './src/assets/PINATA_FRACTURED.png', {
      frameWidth: 276,
      frameHeight: 270,
    });
    this.load.spritesheet('PINATA_OPEN', './src/assets/PINATA_OPEN.png', {
      frameWidth: 384,
      frameHeight: 384,
    });
    this.load.spritesheet('PINATA_PRIZE', './src/assets/PINATA_PRIZE.png', {
      frameWidth: 1017,
      frameHeight: 1080,
    });
    this.load.spritesheet('HIT', './src/assets/HIT.png', {
      frameWidth: 1013,
      frameHeight: 1080,
    });

    const progress = this.add.progress(360, 640, 350, 70, 20, 0xD6E557, 0x8CC63E);
    progress.getByName('Bar').x = -160;
    progress.getByName('Bar').setDisplaySize(335, 50);
    const fullBar = progress.getByName('Bar').displayWidth;
    this.load.on('progress', (value) => {
      progress.getByName('Bar').width = fullBar * value;
    });

    this.load.once('loaderror', () => {
      isError = true;
    });

    this.load.once('complete', () => {
      isComplete = true;
    });
  }

  create() {
    if (isComplete === true && isError === false) {
      // var tapSign = this.add.sprite(360, 800, 'TAP').setScale(0.5);
      // tapSign.setOrigin(0.5, 0.5)
      this.scene.start('HOME');
    }
  }
}
