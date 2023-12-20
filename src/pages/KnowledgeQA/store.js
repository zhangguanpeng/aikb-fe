/* eslint-disable class-methods-use-this */
/*
 * @Description:
 * @Author: nowthen
 * @Date: 2020-12-09 18:36:39
 * @LastEditors: nowthen
 * @LastEditTime: 2020-12-10 17:34:53
 * @FilePath: /react-web-pro/src/pages/Home/store.js
 */
import { createContext } from 'react';
import { observable, action } from 'mobx';
import request from '@/services/newRequest';

class HomeStore {
	@observable tableData = [];

	@observable chatList = [];

	@observable currentChatId = '';

	@observable chatHistoryData = [];

	@observable pageTitle = 'Home主页';

	@observable loading = false;

	@action.bound setData(data = {}) {
		Object.entries(data).forEach((item) => {
			this[item[0]] = item[1];
		});
	}

	@action.bound
	async fetchChatHistoryData(params) {
		try {
			this.loading = true;

			const res = await request({
				url: '/aikb/v1/chat/history',
				method: 'get',
				params,
			});

			console.log('文本搜索res', res);
			const { payload = [] } = res;
			this.chatHistoryData = payload;
			this.loading = false;
		} catch (error) {
			//
		}
	}

	@action.bound
	async fetchChatHistoryData1(params, askInfo) {
		try {
			this.loading = true;
			this.chatHistoryData = [...this.chatHistoryData, askInfo];

			const res = await request({
				url: '/aikb/v1/chat/history',
				method: 'get',
				data: params,
			});

			console.log('文本搜索res', res);
			const { payload = [] } = res;
			const anwserInfo = {
				text: payload.map((item) => item.content),
				time: '',
				type: 'anwser'
			};
			this.chatHistoryData = [...this.chatHistoryData, anwserInfo];
			this.loading = false;
		} catch (error) {
			//
		}
	}

	@action.bound
	async fetchChatList(params) {
		try {
			const res = await request({
				url: '/aikb/v1/chat',
				method: 'get',
				params,
			});

			console.log('对话历史res', res);
			const { payload = [] } = res;
			this.chatList = payload.map((chatItem, index) => {
				const newChatItem = chatItem;
				if (index === 0) {
					newChatItem.isActive = true;
					this.currentChatId = newChatItem.id;
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
			this.loading = true;

			const res = await request({
				url: '/aikb/v1/chat',
				method: 'post',
				data: params,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
				},
			});

			console.log('创建会话res', res);
			this.loading = false;
		} catch (error) {
			//
		}
	}

	@action.bound
	async fetchDeleteChat(chatId) {
		try {
			this.loading = true;

			const res = await request({
				url: `/aikb/v1/chat/${chatId}`,
				method: 'delete',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
				},
			});

			console.log('删除会话res', res);
			this.loading = false;
		} catch (error) {
			//
		}
	}

	@action.bound
	async fetchSearchChatContent(chatId) {
		try {
			this.loading = true;

			const res = await request({
				url: `/aikb/v1/chat/${chatId}`,
				method: 'put',
				headers: {
					'Content-Type': 'form-data',
				},
			});

			console.log('对话搜索res', res);
			this.loading = false;
		} catch (error) {
			//
		}
	}

	// 列表数据
	@action.bound
	async qryTableDate(page = 1, size = 10) {
		this.loading = true;
		const res = await request({
			url: '/list',
			method: 'post',
			data: { page, size },
		});

		if (res.success) {
			const resData = res.data || {};
			console.log(resData);
		}
		this.loading = false;
	}
}

export default createContext(new HomeStore());
