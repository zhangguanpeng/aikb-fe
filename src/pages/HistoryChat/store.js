import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { createContext } from 'react';
import dayjs from 'dayjs';

import request from '@/services/newRequest';
import { storage } from '@/utils';

class HistoryChatStore {
  @observable historyChatData = [];

  @observable historyTopChatData = [];

  @observable tableData = [
    {
      ask: null,
      anwser: {
        text: 'Hi，我是 AI大模型人工智能小助手。很高兴遇见你！有任何疑问都可以在这里获得解答~',
      },
    },
  ];

  @observable pageLoading = false;

  @observable loading = false;

  @observable searchParams = {
    name: undefined,
    gmtBegin: dayjs(new Date()).subtract(7, 'days').format('YYYY-MM-DD'),
    gmtEnd: dayjs(new Date()).format('YYYY-MM-DD'),
  };

  // 获取会话列表
  @action.bound
  async fetchHistoryChatList(params) {
    this.pageLoading = true;
    try {
      const res = await request({
        url: '/aikb/v1/chat',
        method: 'get',
        params,
        headers: {
          'Authorization': storage.getItem('token')},
      });

      console.log('对话历史res', res);
      const { payload = [] } = res;
      this.pageLoading = false;
      this.historyChatData = payload;
    } catch (error) {
      //
    }
  }

  // 获取置顶会话列表
  @action.bound
  async fetchHistoryTopChatList(params) {
    // this.pageLoading = true;
    try {
      const res = await request({
        url: '/aikb/v1/chat',
        method: 'get',
        params,
        headers: {
          'Authorization': storage.getItem('token')},
      });

      console.log('对话历史top res', res);
      const { payload = [] } = res;
      // this.pageLoading = false;
      this.historyTopChatData = payload;
    } catch (error) {
      //
    }
  }

  // 会话置顶
  @action.bound
  async fetchChatToTop(id) {
    // this.pageLoading = true;

    const paramstop = {
      page: 0,
      size: 10000,
      pinToTop: true
    };

    try {
      await request({
        url: `/aikb/v1/chat/${id}/pinToTop`,
        method: 'put',
        headers: {
          'Authorization': storage.getItem('token')},
      });

      this.fetchHistoryTopChatList(paramstop);
      // this.fetchHistoryChatList(params);
    } catch (error) {
      //
    }
  }

  // aikb/v1/chat/6957

  // 删除会话
  @action.bound
  async fetchChatDelete(id) {
    // this.pageLoading = true;
    const params = {
      page: 0,
      size: 10000,
      sort: 'createdDate,desc',
    };

    const paramstop = {
      page: 0,
      size: 10000,
      pinToTop: true
    };

    try {
      await request({
        url: `/aikb/v1/chat/${id}`,
        method: 'delete',
        headers: {
          'Authorization': storage.getItem('token')},
      });

      this.fetchHistoryTopChatList(paramstop);
      this.fetchHistoryChatList(params);
    } catch (error) {
      //
    }
  }

  @action.bound
	async fetchEditChatName(params, id) {
    const listparams = {
      page: 0,
      size: 10000,
      sort: 'createdDate,desc',
    };

    const toplistparams = {
      page: 0,
      size: 10000,
      pinToTop: true
    };
		try {
			const res = await request({
				url: `/aikb/v1/chat/${id}/chat`,
				method: 'put',
				data: params,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					'Authorization': storage.getItem('token')},
			});

			console.log('修改会话名称res', res);
      this.fetchHistoryTopChatList(toplistparams);
      this.fetchHistoryChatList(listparams);
		} catch (error) {
			//
		}
	}
}

export default createContext(new HistoryChatStore());
