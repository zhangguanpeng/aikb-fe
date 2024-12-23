import { observable, action, computed } from 'mobx';
import { message } from 'antd';
import { createContext } from 'react';
import dayjs from 'dayjs';

import request from '@/services/newRequest';

class NewChatStore {
  @observable chatData = [];

  @observable currentChat = {
    title: '',
  };

  @observable pageLoading = false;

  // 获取会话列表
	@action.bound
	async fetchChatList(params) {
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
			this.chatList = payload.map((chatItem, index) => {
				const newChatItem = chatItem;
				if (index === 0) {
					newChatItem.isActive = true;
					this.currentChatId = newChatItem.id;

					// 获取当前会话的聊天记录
					const chatHistoryParams = {
						chatId: newChatItem.id,
						page: 0,
						size: '',
						sort: 'createdDate,asc'
					};
					this.fetchChatHistoryData(chatHistoryParams);
				} else {
					newChatItem.isActive = false;
				}
				return newChatItem;
			});
		} catch (error) {
			//
		}
	}

	@action.bound
	async fetchCreateChat(params) {
		try {
			this.pageLoading = true;

			const res = await request({
				url: '/aikb/v1/chat',
				method: 'post',
				data: params,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
          			'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxNTIwIiwidG9rZW5JZCI6IjlhN2RkNWE4ZGYzMDQwYjBiOTg4YTdmNThmOGYxYmZhIiwic3ViIjoi6L-Q6JCl5Y2V5L2N5a6J5YWo6aOO6Zmp566h55CG5bKXIiwiaWF0IjoxNzM0OTIyMDQxLCJleHAiOjE3MzYxMzE2NDF9.hBAxbBGu8J41BMym2jjmAqJVSPaFL2VxKjcoOGW4HLlT6XM85q45IaVYYUv2a_20SMDM2M5SHsRy1wDOpnBvXQ',
				},
			});

			console.log('创建会话res', res);
			const initChatObj = {
				ask: null,
				anwser: {
				  text: 'Hi，我是 AI大模型人工智能小助手。很高兴遇见你！有任何疑问都可以在这里获得解答~'
				}
			};

			this.pageLoading = false;
      		this.currentChat = res.payload;
			this.chatData = [initChatObj]

			return res.payload;
			
		} catch (error) {
			//
		}
	}

	@action.bound
	async fetchEditChatName(params) {
		try {
			this.loading = true;

			const res = await request({
				url: `/aikb/v1/chat/${this.currentChat.id}/chat`,
				method: 'put',
				data: params,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
					'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxNTIwIiwidG9rZW5JZCI6IjlhN2RkNWE4ZGYzMDQwYjBiOTg4YTdmNThmOGYxYmZhIiwic3ViIjoi6L-Q6JCl5Y2V5L2N5a6J5YWo6aOO6Zmp566h55CG5bKXIiwiaWF0IjoxNzM0OTIyMDQxLCJleHAiOjE3MzYxMzE2NDF9.hBAxbBGu8J41BMym2jjmAqJVSPaFL2VxKjcoOGW4HLlT6XM85q45IaVYYUv2a_20SMDM2M5SHsRy1wDOpnBvXQ',
				},
			});

			console.log('修改会话名称res', res);
			this.currentChat = res.payload;
			this.loading = false;
		} catch (error) {
			//
		}
	}
  
}

export default createContext(new NewChatStore());
