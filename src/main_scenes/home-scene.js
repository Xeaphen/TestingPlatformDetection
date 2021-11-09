import Phaser from 'phaser';
import moment from 'moment-timezone';
import APICall from '../services/api_service';
import '../components/text';
import '../components/sprite';
import '../components/shape_rectangle';
import '../prefabs/button_round-rect';
import '../prefabs/progress';
import '../prefabs/warning';

let title;
let availableButton = [];
let homeButtons = [];
let selectedPinata;
let progress;
let energy;

export default class Home extends Phaser.Scene {
  constructor() {
    super('HOME');
  }

  init() {

  }

  preload() {
  }

  async create() {
    this.add.singleSprite(360, 640, 'HOME_BG', 0.32);
    console.log(window.navigator.platform);
    title = this.add.singleSprite(360, 250, 'TITLE', 0.8).setDepth(1);
    const pinataData = await this.getRequest(APICall.getUserPinata());
    // console.log(pinataData);
    if (pinataData.success === true) {
      title.destroy();
      if (pinataData.redeemLogData.voucher_code != null) {
        this.changeScene(pinataData.redeemLogData.redeem_log_id, pinataData.redeemLogData.voucher_code);
      } else {
        this.showPinata(pinataData.redeemLogData);
      }
    } else {
      const smallPinata = this.add.singleSprite(360, 490, 'SMALLP', 0.7);
      const mediumPinata = this.add.singleSprite(smallPinata.x - 170, smallPinata.y + 260, 'MEDIUMP', 0.7);
      const largePinata = this.add.singleSprite(smallPinata.x + 170, smallPinata.y + 260, 'LARGEP', 0.7);
      smallPinata.on('pointerup', async () => {
        title.setVisible(false);
        const result = await this.postRequest(APICall.postUserPinata(1));
        // console.log(result.data.response.data);
        this.showPinata(result.data.response.data);
      });
      mediumPinata.on('pointerup', async () => {
        title.setVisible(false);
        const result = await this.postRequest(APICall.postUserPinata(2));
        // console.log(result.data.response.data);
        this.showPinata(result.data.response.data);
      });
      largePinata.on('pointerup', async () => {
        title.setVisible(false);
        const result = await this.postRequest(APICall.postUserPinata(3));
        // console.log(result.data.response.data);
        this.showPinata(result.data.response.data);
      });
      availableButton = [smallPinata, mediumPinata, largePinata];
      homeButtons = [];
      this.activateButtons(availableButton);
    }
  }

  update() {
  }

  async showPinata(data) {
    if (localStorage.getItem('bonus_status') === null) {
      localStorage.setItem('bonus_status', 'false');
    }
    this.createPinataWithRope();
    progress = data.progress;
    const lastActionData = await this.getRequest(APICall.getLastPinataAction());
    // console.log(lastActionData);
    const timerBox = this.createTimerBox();
    const timer = this.timerEnergyRechargeToFull();
    const progressBar = this.createHitpointProgress(data.progress, data);
    const bonusButton = this.createBonusActionButton(progressBar, data);
    const freeButton = this.createFreeActionButton(progressBar, timerBox, data, timer);
    if (lastActionData.data.premiumLogData.length === 0) {
      const paidButton = this.createPaidActionButton(progressBar, data, 1);
      homeButtons.push(paidButton);
    } else {
      const paidButton = this.createPaidActionButton(progressBar, data, lastActionData.data.premiumLogData[0].total_count);
      homeButtons.push(paidButton);
    }
    homeButtons.push(bonusButton, freeButton);
    this.timerShowBonusActionButton(bonusButton);
    timer.callback = () => {
      if (lastActionData.data.adsLogData.length === 0) {
        timerBox.setVisible(false);
        energy = 100;
        freeButton.getByName('Text').setText(energy);
        timer.paused = true;
      } else {
        this.checkIsFull(this.setFullTime(lastActionData.data.adsLogData[0].time), timer, freeButton, timerBox);
      }
    };
    this.deactivateButton(availableButton);
  }

  createPinataWithRope() {
    const ropeLength = 13;
    const hook = this.matter.add.sprite(360, 255, 'HOOK', null, {
      ignoreGravity: true,
      isStatic: true,
    }).setFixedRotation();
    let y = 300;
    let prev = hook;
    selectedPinata = this.matter.add.sprite(360, y, 'PINATA_HIT', 0, {
      shape: {
        type: 'rectangle',
        width: 10,
        height: 10,
      },
      mass: 0.1,
      render: {
        sprite: {
          xOffset: -0.01,
          yOffset: 0.14,
        },
      },
    }).setScale(1.8, 1.8).setDepth(1).setFixedRotation();
    for (let i = 0; i <= ropeLength; i++) {
      let rope;
      if (i !== ropeLength) {
        rope = this.matter.add.image(360, y, 'ROPE', null, {
          shape: 'rectangle',
          mass: 0.1,
        }).setScale(0.1).setFixedRotation();
        if (i === 0) {
          this.matter.add.joint(prev, rope, 20, 1);
        } else {
          this.matter.add.joint(prev, rope, 1.5, 1);
        }
      } else {
        this.matter.add.joint(prev, selectedPinata, 10, 0.5);
      }
      prev = rope;
      y += 5;
    }
  }

  createTimerBox() {
    const timerBox = this.add.buttonRoundRect(530, 975, 95, 35, 8, 0xF5B492, '', {
      font: 'bold 50px FredokaOne',
      fill: '#FFFFFF',
      align: 'center',
    });
    timerBox.getByName('Text').setScale(0.5).setDepth(1);
    timerBox.getByName('Round-Rectangle').setStrokeStyle(5, 0xFFFFFF, 1);
    timerBox.setVisible(false);

    return timerBox;
  }

  createHitAnimation(pinata) {
    const hit = this.add.sprite(pinata.x, 500, 'HIT').setDepth(2).setVisible(false).setScale(0.5);
    this.anims.create({
      key: 'HIT',
      frames: this.anims.generateFrameNumbers('HIT', {
        start: 0,
        end: 5,
      }),
      // hideOnComplete: true,
      frameRate: 60,
      repeat: 0,
    });
    hit.setVisible(false);

    return hit;
  }

  createFreeActionButton(bar, box, data, timer) {
    const commonActionButton = this.add.buttonRoundRect(530, 1020, 180, 90, 40, 0xEA6928, energy, {
      font: 'bold 36px FredokaOne',
      fill: '#FFFFFF',
      align: 'center',
    });
    commonActionButton.getByName('Round-Rectangle').setStrokeStyle(8, 0xFFFFFF, 1);
    commonActionButton.on('pointerup', async () => {
      const newValue = this.setPinataProgress(progress - energy, this.setTotalPinataHP(data.pinata_type_id));
      await this.postRequest(APICall.postUserAction(data, 1, energy));
      this.pinataPhysicsEffect();
      bar.setDisplaySize(newValue, 50);
      progress -= energy;
      this.checkPinataChange(data);
      const energyDecreaseTimer = this.time.addEvent({
        delay: 5,
        loop: true,
        callback: async () => {
          if (energy > 0) {
            energy -= 1;
          } else {
            energy = 0;
            energyDecreaseTimer.remove();
            const newTime = moment().tz('Asia/Jakarta');
            timer.callback = () => this.checkIsFull(this.setFullTime(newTime), timer, commonActionButton, box);
            timer.paused = false;
          }
          commonActionButton.getByName('Text').setText(energy);
        },
      });
      if (progress <= 0) {
        const result = await this.postRequest(APICall.generateReward(data.redeem_log_id));
        this.changeScene(data.redeem_log_id, result.data.response.data.voucher_code);
      }
    });

    return commonActionButton;
  }

  createBonusActionButton(bar, data) {
    const bonusActionButton = this.add.singleSprite(360, 900, 'CANDY', 0.7);
    bonusActionButton.setVisible(false);
    bonusActionButton.setInteractive();
    bonusActionButton.on('pointerup', async () => {
      const newValue = this.setPinataProgress(progress - 100, this.setTotalPinataHP(data.pinata_type_id));
      await this.postRequest(APICall.postUserAction(data, 2, 100));
      bar.setDisplaySize(newValue, 50);
      this.pinataPhysicsEffect();
      progress -= 100;
      this.checkPinataChange(data);
      localStorage.setItem('bonus_status', 'true');
      bonusActionButton.setVisible(false);
      if (progress <= 0) {
        const result = await this.postRequest(APICall.generateReward(data.redeem_log_id));
        this.changeScene(data.redeem_log_id, result.data.response.data.voucher_code);
      }
    });

    return bonusActionButton;
  }

  createPaidActionButton(bar, data, usage) {
    let pay = usage;
    const premiumActionButton = this.add.buttonRoundRect(200, 1020, 180, 90, 40, 0xEA6928, 250 * pay, {
      font: 'bold 36px FredokaOne',
      fill: '#FFFFFF',
      align: 'center',
    });

    premiumActionButton.getByName('Round-Rectangle').setStrokeStyle(8, 0xFFFFFF, 1);
    premiumActionButton.setInteractive();
    premiumActionButton.on('pointerup', async () => {
      this.pinataPhysicsEffect();
      this.showAdsVideo();
      const newValue = this.setPinataProgress(progress - (250 * pay), this.setTotalPinataHP(data.pinata_type_id));
      await this.postRequest(APICall.postUserAction(data, 3, (250 * pay)));
      bar.setDisplaySize(newValue, 50);
      progress -= (250 * pay);
      this.checkPinataChange(data);
      premiumActionButton.getByName('Text').setText(250 * (pay + 1));
      pay += 1;
      if (progress <= 0) {
        const result = await this.postRequest(APICall.generateReward(data.redeem_log_id));
        this.changeScene(data.redeem_log_id, result.data.response.data.voucher_code);
      }
    });

    return premiumActionButton;
  }

  createHitpointProgress(initialHP, data) {
    this.add.singleSprite(100, 100, 'HP_ICON', 0.1);
    const hpProgress = this.add.progress(420, 100, 500, 70, 35, 0x03DDDD, 0xFBD35B);
    hpProgress.getByName('Box').setStrokeStyle(5, 0x048686);
    hpProgress.getByName('Bar').setDisplaySize(this.setPinataProgress(initialHP, this.setTotalPinataHP(data.pinata_type_id)), 50);
    hpProgress.getByName('Bar').radius = 25;
    hpProgress.getByName('Bar').x = -230;

    return hpProgress.getByName('Bar');
  }

  createWarningMessage(messageError, isInteractable) {
    const warningBox = this.add.warningBox(720 / 2, 1280 / 2, 'WARNING', messageError, {
      font: 'bold 65px FredokaOne',
      fill: '#008686',
      align: 'center',
    });
    if (isInteractable === true) {
      const closeButton = this.add.singleSprite(warningBox.x, warningBox.y + 120, 'OK_BUTTON', 0.7);
      closeButton.setInteractive().setDepth(5).setScale(0.5);
      this.deactivateButton(availableButton);
      closeButton.on('pointerup', async () => {
        title.setVisible(true);
        warningBox.destroy();
        closeButton.destroy();
        this.activateButtons(availableButton);
      });
    }
  }

  showAdsVideo() {
    this.deactivateButton(homeButtons);
    const videos = ['DUMMY', 'DUMMY2', 'DUMMY3'];
    const adContent = this.add.video(this.game.config.width / 2, this.game.config.height / 2, videos[Phaser.Math.Between(0, 2)]).setDepth(4);
    const adBackground = this.add.shapeRectangle(adContent.x, adContent.y, this.game.config.width, this.game.config.height, 0x000000, 3);
    const rectAdCover = this.add.shapeRectangle(adContent.x, adContent.y, this.game.config.width, this.game.config.height, 0x979797, 0.8);
    adBackground.setScale(0.95, 0.32).setDepth(3);
    rectAdCover.setDepth(2);
    adContent.displayWidth = 640;
    adContent.displayHeight = 360;
    adContent.play(false);
    adContent.on('seeking', () => {
      // videoTimerEvent = this.time.addEvent({
      //   delay: 1000,
      //   callback: this.onPlay,
      //   loop: true,
      // });
      // console.log();
    });
    adContent.on('complete', () => {
      adContent.destroy();
      adBackground.destroy();
      rectAdCover.destroy();
      this.activateButtons(homeButtons);
    });
  }

  pinataPhysicsEffect() {
    const hitEffect = this.createHitAnimation(selectedPinata);
    const thrustPower = [-0.01, 0.01];
    const iteration = Phaser.Math.Between(0, 1);
    selectedPinata.thrust(thrustPower[iteration]);
    hitEffect.setVisible(true);
    hitEffect.anims.play('HIT');
    hitEffect.once('animationcomplete', () => {
      // console.log('animationcomplete')
      hitEffect.destroy();
    });
  }

  setTotalPinataHP(type) {
    let total = 0;
    if (type === 1) {
      total = 11250;
    } else if (type === 2) {
      total = 22800;
    } else {
      total = 39500;
    }

    return total;
  }

  setPinataProgress(current, total) {
    const currentProgress = (current / total) * 460;
    // currentProgress = Phaser.Math.Clamp(currentProgress, 0, 100);
    return currentProgress;
  }

  setFullTime(current) {
    const oneEnergyPointTimeNeeded = 1; // IN MINUTE
    const fullTime = moment(current).add(100 * oneEnergyPointTimeNeeded, 'minutes');

    return fullTime;
  }

  checkPinataChange(data) {
    if (progress < ((75 / 100) * this.setTotalPinataHP(data.pinata_type_id))) {
      selectedPinata.setTexture('PINATA_FRACTURED', 0);
      selectedPinata.setScale(1.36, 1.39);
      selectedPinata.setOrigin(0.55, 0.52);
      selectedPinata.setFixedRotation();
    }
    if (progress < ((50 / 100) * this.setTotalPinataHP(data.pinata_type_id))) {
      selectedPinata.setTexture('PINATA_FRACTURED', 1);
      selectedPinata.setScale(1.36, 1.5);
      selectedPinata.setOrigin(0.55, 0.55);
      selectedPinata.setFixedRotation();
    }
    if (progress < ((25 / 100) * this.setTotalPinataHP(data.pinata_type_id))) {
      selectedPinata.setScale(1.36, 1.61);
      selectedPinata.setOrigin(0.52, 0.58);
      selectedPinata.setFixedRotation();
    }
  }

  checkErrorType(error) {
    if (error.response.data.code === 400) {
      if (error.response.data.error.message === 'Insufficient user poin for Pinata type') {
        this.createWarningMessage('Poin anda Tidak mencukupi', true);
      }
    } else if (error.response.data.code === 401) {
      if (error.response.data.error.message === 'Authorization failed') {
        this.createWarningMessage('Autentikasi Gagal', false);
      }
    }
  }

  checkIsFull(time, timer, button, box) {
    // console.log(time);
    const nowTime = moment().tz('Asia/Jakarta');
    if (moment(nowTime, 'DD/MM/YYYY HH:mm:ss').isAfter(moment(time, 'DD/MM/YYYY HH:mm:ss'))) {
      box.setVisible(false);
      energy = 100;
      button.getByName('Text').setText(energy);
      timer.paused = true;
    } else {
      this.changeButtonColor(button);
      box.setVisible(true);
      box.setDepth(1);
      const timeLeft = moment(time, 'DD/MM/YYYY HH:mm:ss').diff(moment(nowTime, 'DD/MM/YYYY HH:mm:ss'));
      const energyByTime = 100 - Math.ceil(moment.duration(timeLeft).asMinutes());
      energy = energyByTime;
      button.getByName('Text').setText(energyByTime);
      box.getByName('Text').setText(moment.utc(timeLeft).format('00:ss'));
    }
  }

  timerShowBonusActionButton(button) {
    let nowTime = null;
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        nowTime = moment().tz('Asia/Jakarta');
        const bottomInterval = moment().set('minute', 0).set('second', 0).tz('Asia/Jakarta');
        const topInterval = moment().set('minute', 10).set('second', 0).tz('Asia/Jakarta');
        if (moment(nowTime, 'DD/MM/YYYY HH:mm:ss').isBetween(bottomInterval, topInterval)) {
          // console.log('in');
          if (localStorage.getItem('bonus_status') === 'false') {
            // console.log('visible');
            button.setVisible(true);
          } else {
            // console.log('invisible');
            button.setVisible(false);
          }
        } else {
          // console.log('out');
          localStorage.setItem('bonus_status', false);
          button.setVisible(false);
        }
      },
    });
  }

  timerEnergyRechargePerMinute(button) {
    const oneEnergyPointTimeNeeded = 1; // IN MINUTE
    const intervalTime = (60 * 1000) * oneEnergyPointTimeNeeded;
    this.time.addEvent({
      delay: intervalTime,
      loop: true,
      callback: () => {
        if (energy < 100) {
          energy += 1;
        } else {
          energy += 0;
        }
        button.getByName('Text').setText(energy);
      },
    });
  }

  timerEnergyRechargeToFull() {
    const energyRechargeTimer = this.time.addEvent({
      delay: 1000,
      loop: true,
    });

    return energyRechargeTimer;
  }

  activateButtons(buttons) {
    if (buttons === availableButton) {
      buttons.forEach((button) => {
        button.setInteractive().setVisible(true);
      });
    } else {
      buttons.forEach((button) => {
        button.setInteractive();
      });
    }
  }

  deactivateButton(buttons) {
    if (buttons === availableButton) {
      buttons.forEach((button) => {
        button.disableInteractive().setVisible(false);
      });
    } else {
      buttons.forEach((button) => {
        button.disableInteractive();
      });
    }
  }

  changeScene(redeem, vcode) {
    this.cameras.main.fadeOut(1000, 255, 255, 255);
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      () => {
        this.time.delayedCall(500, () => {
          this.scene.start('CORE', {
            prize_id: redeem,
            code: vcode,
          });
        });
      },
    );
  }

  changeButtonColor(button) {
    if (energy <= 0) {
      button.getByName('Round-Rectangle').setFillStyle(0x808080, 1);
    } else {
      button.getByName('Round-Rectangle').setFillStyle(0xEA6928, 1);
    }
  }

  async getRequest(getFunc) {
    try {
      const response = await getFunc;
      return response.data.response;
    } catch (error) {
      // console.log(error.response.data.code);
      this.checkErrorType(error);
      return error;
    }
  }

  async postRequest(postFunc) {
    try {
      const response = await postFunc;
      return response;
    } catch (error) {
      // console.log(error.response.data.code);
      this.checkErrorType(error);
      return error;
    }
  }
}
