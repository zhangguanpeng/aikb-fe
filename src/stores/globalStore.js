/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { observable, action } from 'mobx';
import request from '@/services/newRequest';
import axios from 'axios';
import dayjs from 'dayjs';
// import request from '@/services/request';
import { storage } from '@/utils';

export default class GlobalStore {
  @observable appTitle = '服务管理平台';

  @observable collapsed = false; // 菜单收起展开

  @observable userInfo = {
    // 当前用户信息
    loginName: 'nowThen',
  };

  @observable picCodeInfo = {};

  // 获取图片验证码
  @action.bound
  async fetchPicCode() {
    // this.pageLoading = true;
    try {
      const res = await request({
        url: '/aikb/v1/user/login/vc/image',
        method: 'post',
        // data: params,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('图片验证码 res', res);
      const { payload = {} } = res;
      // this.pageLoading = false;
      this.picCodeInfo = payload;
    } catch (error) {
      //
    }
  }

   // 获取短信验证码
   @action.bound
   async fetchVerifyCode(params) {
     // this.pageLoading = true;
     try {
       await request({
         url: '/aikb/v1/user/login/sendVerifyCode',
         method: 'post',
         data: params,
         headers: {
           'Content-Type': 'application/json',
         }
       });
     } catch (error) {
       return Promise.reject(error);
     }
   }

  // 用户名密码登录
  @action.bound
  async fetchPasswordLogin(params) {
    const form = new FormData();
    form.append('username', params.username);
    form.append('password', params.password);
    try {
      const res = await axios.post('/aikb/v1/login', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('密码登录 res', res);
      const { payload = [] } = res.data;
      const twoDay = 2 * 24 * 60 * 60 * 1000;
      storage.setItem('token', payload.token);
      storage.setItem('expirestamp', dayjs(payload.updatedAt) + twoDay);
      return payload;

    } catch (error) {
      return Promise.reject(error);
    }
  }

  // 短信验证码登录
  @action.bound
  async fetchVerifyCodeLogin(params) {
    const form = new FormData();
    form.append('phoneNumber', params.phoneNumber);
    form.append('verifyCode', params.verifyCode);
    try {
      const res = await axios.post('/aikb/v1/smsLogin', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('验证码登录 res', res);
      const { payload = [] } = res.data;
      const twoDay = 2 * 24 * 60 * 60 * 60;
      storage.setItem('token', payload.token);
      storage.setItem('expirestamp', dayjs(payload.updatedAt) + twoDay);
      return payload;

    } catch (error) {
      return Promise.reject(error);
    }
  }
}
