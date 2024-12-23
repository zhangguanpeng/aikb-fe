import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { createContext } from 'react';
import dayjs from 'dayjs';

import request from '@/services/newRequest';

class HistoryChatStore {
  @observable historyChatData = [];

  @observable tableData = [
    {
      ask: null,
      anwser: {
        text: 'Hi，我是 AI大模型人工智能小助手。很高兴遇见你！有任何疑问都可以在这里获得解答~'
      }
    }
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
					'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxNTIwIiwidG9rZW5JZCI6IjlhN2RkNWE4ZGYzMDQwYjBiOTg4YTdmNThmOGYxYmZhIiwic3ViIjoi6L-Q6JCl5Y2V5L2N5a6J5YWo6aOO6Zmp566h55CG5bKXIiwiaWF0IjoxNzM0OTIyMDQxLCJleHAiOjE3MzYxMzE2NDF9.hBAxbBGu8J41BMym2jjmAqJVSPaFL2VxKjcoOGW4HLlT6XM85q45IaVYYUv2a_20SMDM2M5SHsRy1wDOpnBvXQ',
				},
			});

			console.log('对话历史res', res);
			const { payload = [] } = res;
      this.pageLoading = false;
			this.historyChatData = payload;
		} catch (error) {
			//
		}
	}

  

  
}

export default createContext(new HistoryChatStore());
