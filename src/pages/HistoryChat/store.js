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

  @observable loading = false;

  @observable searchParams = {
    name: undefined,
    gmtBegin: dayjs(new Date()).subtract(7, 'days').format('YYYY-MM-DD'),
    gmtEnd: dayjs(new Date()).format('YYYY-MM-DD'),
  };

  // 获取会话列表
	@action.bound
	async fetchHistoryChatList(params) {
		try {
			const res = await request({
				url: '/aikb/v1/chat',
				method: 'get',
				params,
        headers: {
					'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxNTIwIiwidG9rZW5JZCI6IjQ3ZDI0Yjg2YWRiNjQ1NDE4ZTIwMzQxMGE2NGQ1NmMxIiwic3ViIjoi6L-Q6JCl5Y2V5L2N5a6J5YWo6aOO6Zmp566h55CG5bKXIiwiaWF0IjoxNzM0NzQ0MzgyLCJleHAiOjE3MzQ4NzM5ODJ9.kNFQ-UB2SgM3Q17uWgz1ctiA3ZxCrGWolv264z2uirjwErHJTJ0Sm7AARuWE7wKKPdh2t9Buza97HnnfgntaRQ',
				},
			});

			console.log('对话历史res', res);
			const { payload = [] } = res;
			this.historyChatData = payload;
		} catch (error) {
			//
		}
	}

  

  
}

export default createContext(new HistoryChatStore());
