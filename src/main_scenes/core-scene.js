import Phaser from 'phaser';
import APICall from '../services/api_service';
import '../components/sprite';

export default class Core extends Phaser.Scene {
  constructor() {
    super('CORE');
  }

  init(data) {
    this.prizeData = {
      redeem_id: data.prize_id,
      vcode: data.code,
    };
    this.isClaimed = false;
  }

  preload() {

  }

  async create() {
    this.cameras.main.fadeIn(1000, 255, 255, 255);
    this.isClaimed = false;
    this.add.singleSprite(360, 640, 'CORE_BG', 0.32).setDepth(0);
    const pinata = this.add.singleSprite(360, 550, 'PINATA_PRIZE', 0.7);
    this.anims.create({
      key: 'PINATA_PRIZE',
      frames: this.anims.generateFrameNames('PINATA_PRIZE', {
        start: 1,
        end: 15,
      }),
      frameRate: 15,
      repeat: 0,
    });
    pinata.anims.play('PINATA_PRIZE');
    pinata.on('animationcomplete', () => {
      this.mainTweenTimeline(this.prizeData);
      // this.mainTweenTimeline();
    });
  }

  update() {

  }

  mainTweenTimeline(data) {
    const backButton = this.createButtonBackToHome(data);
    const claimButton = this.createButtonClaim(data);
    this.tweens.timeline({
      loop: 0,
      tweens: [
        {
          targets: this.createPrizeContainer(),
          scale: 0.7,
          yoyo: false,
          ease: 'Linear',
          duration: 300,
          onComplete: () => {
            this.createVoucherImage();
          },
        },
        {
          targets: this.createBackCover(),
          alpha: 0.6,
          yoyo: false,
          ease: 'Linear',
          duration: 1000,
        },
        {
          targets: claimButton,
          scale: 0.8,
          yoyo: false,
          ease: 'Linear',
          duration: 200,
        },
        {
          targets: claimButton,
          scale: 0.6,
          yoyo: false,
          ease: 'Linear',
          duration: 300,
        },
        {
          targets: backButton,
          scale: 0.8,
          yoyo: false,
          ease: 'Linear',
          duration: 200,
        },
        {
          targets: backButton,
          scale: 0.6,
          yoyo: false,
          ease: 'Linear',
          duration: 300,
          onComplete: () => {
            this.animationConfetti();
          },
        },
      ],
    });
  }

  animationConfetti() {
    this.anims.create({
      key: 'CONFETTI',
      frames: this.anims.generateFrameNames('CONFETTI', {
        start: 1,
        end: 63,
      }),
      frameRate: 30,
      repeat: -1,
    });
    const confetti = this.add.singleSprite(360, 350, 'CONFETTI', 1.5).setDepth(1);
    confetti.anims.play('CONFETTI');
  }

  createBackCover() {
    const cover = this.add.rectangle(360, 640, 720, 1280, 0x000000).setAlpha(0).setDepth(1);

    return cover;
  }

  createPrizeContainer() {
    const coupon = this.add.singleSprite(360, 400, 'REWARD_DIALOG', 0.1).setDepth(2);

    return coupon;
  }

  createVoucherImage() {
    const voucherImg = document.createElement('img');
    voucherImg.src = 'https://picsum.photos/400/150';
    voucherImg.width = 400;
    voucherImg.height = 150;

    this.add.dom(360, 610, voucherImg).setDepth(3);
  }

  createButtonBackToHome(dataPrize) {
    const button = this.add.buttonRoundRect(360, 1000, 730, 140, 60, 0x50CB93, 'Select New Pinata', {
      font: 'bold 54px Arial',
      fill: '#FFFFFF',
      align: 'center',
    }).setScale(0).setDepth(2);
    button.getByName('Round-Rectangle').setStrokeStyle(8, 0x40A275, 1);
    button.on('pointerup', async () => {
      if (this.isClaimed === false) {
        await this.postRequest(APICall.dropReward(dataPrize.redeem_id));
      }
      this.scene.start('HOME');
    });

    return button;
  }

  createButtonClaim(dataPrize) {
    const button = this.add.buttonRoundRect(360, 880, 730, 140, 60, 0x03DDDD, 'Claim', {
      font: 'bold 60px Arial',
      fill: '#FFFFFF',
      align: 'center',
    }).setScale(0).setDepth(2);
    button.getByName('Round-Rectangle').setStrokeStyle(8, 0x02B0B0, 1);
    button.on('pointerup', async () => {
      await this.postRequest(APICall.claimReward(dataPrize.redeem_id, dataPrize.vcode));
      button.getByName('Round-Rectangle').setFillStyle(0xB0BEBE, 1);
      button.getByName('Round-Rectangle').setStrokeStyle(8, 0x585F5F, 1);
      button.getByName('Text').setText('Claimed');
      this.isClaimed = true;
      button.disableInteractive();
    });

    return button;
  }

  async postRequest(postFunc) {
    try {
      const response = await postFunc;
      return response;
    } catch (error) {
      return error.message;
    }
  }
}
