import Phaser from 'phaser';
import Loading from './main_scenes/loading-scene';
import Home from './main_scenes/home-scene';
import Core from './main_scenes/core-scene';

const config = {
  type: Phaser.CANVAS,
  parent: 'game-page',
  backgroundColor: 0x000000,
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        x: 0,
        y: 1.5,
      },
      // debug: {
      //   showBody: true,
      //   showStaticBody: true,
      // },
      // debugBodyColor: 0x26FF00,
    },
  },
  plugins: {
    global: [],
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [Loading, Home, Core],
  audio: {
    disableWebAudio: true,
  },
};

export default new Phaser.Game(config);
