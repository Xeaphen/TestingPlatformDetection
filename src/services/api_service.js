import axios from 'axios';

export default class APICall {
  static setAuthToken() {
    const url = new URLSearchParams(window.location.search);
    const value = url.get('id');
    return value;
    // return 6;
  }

  static async getUserPinata() {
    return axios({
      method: 'GET',
      url: 'https://pinataparty-dev.macroad.co.id/api/v1.0/core/redeem/user-active-pinata',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.setAuthToken()}`,
      },
      params: {
        platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
      },
    });
  }

  static async getLastPinataAction() {
    return axios({
      method: 'GET',
      url: 'https://pinataparty-dev.macroad.co.id/api/v1.0/core/action/user-last-action',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.setAuthToken()}`,
      },
      params: {
        platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
      },
    });
  }

  static async postUserPinata(type) {
    return axios({
      method: 'POST',
      url: 'https://pinataparty-dev.macroad.co.id/api/v1.0/core/redeem/start-pinata',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.setAuthToken()}`,
      },
      params: {
        platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
      },
      data: {
        pinata_type_id: type,
      },
    });
  }

  static async postUserAction(data, actionType, damagePoint) {
    return axios({
      method: 'POST',
      url: 'https://pinataparty-dev.macroad.co.id/api/v1.0/core/action/insert-action',
      params: {
        platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.setAuthToken()}`,
      },
      data: {
        redeem_log_id: data.redeem_log_id.toString(),
        action_type_id: actionType.toString(),
        damage: damagePoint,
        ad_id: 1,
      },
    });
  }

  static async generateReward(redeem) {
    return axios({
      method: 'POST',
      url: 'https://pinataparty-dev.macroad.co.id/api/v1.0/core/redeem/generate-reward',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.setAuthToken()}`,
      },
      params: {
        platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
      },
      data: {
        redeem_log_id: redeem,
      },
    });
  }

  static async claimReward(redeem, code) {
    return axios({
      method: 'POST',
      url: 'https://pinataparty-dev.macroad.co.id/api/v1.0/core/redeem/user-claim-reward',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.setAuthToken()}`,
      },
      params: {
        platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
      },
      data: {
        redeem_log_id: redeem,
        voucher_code: code,
      },
    });
  }

  static async dropReward(redeem) {
    return axios({
      method: 'POST',
      url: 'https://pinataparty-dev.macroad.co.id/api/v1.0/core/redeem/user-drop-reward',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.setAuthToken()}`,
      },
      params: {
        platform_token: 'c9a68aab8f51e8b24a80beb8fe88cb760b0bc32d',
      },
      data: {
        redeem_log_id: redeem,
      },
    });
  }
}
