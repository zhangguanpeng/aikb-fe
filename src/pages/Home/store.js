import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { createContext } from 'react';
import { storage } from '@/utils';

import request from '@/services/newRequest';

class HomeStore {

  @observable imageList = [];
  
  /** 聊天图片上传 POST /aikb/v1/chat/upload/image */
  @action.bound
  async uploadChatImage(params) {
    try {
      const res = await request({
        url: '/aikb/v1/chat/upload/image',
        method: 'post',
        data: params,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': storage.getItem('token')
        },
      });
      console.log('上传图片res', res);
      this.imageList = res;
      return res;
    } catch (error) {
      return error;
    }

    // this.loading = false;
  }
}

export default createContext(new HomeStore());
