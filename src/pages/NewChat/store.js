/* eslint-disable consistent-return */
import { observable, action, computed } from 'mobx';
// import { message } from 'antd';
import { createContext } from 'react';
// import dayjs from 'dayjs';

import request from '@/services/newRequest';
import { storage } from '@/utils';

class NewChatStore {
  @observable chatData = [];

  @observable currentChat = {
    title: '',
  };

  @observable pageLoading = false;

  @observable textReferenceDetailShow = false;

  @observable textReference = [];

  // 获取会话列表
  @action.bound
  async fetchHistoryChatList(params, chatId) {
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
      payload.forEach((chatItem) => {
        if (String(chatItem.id) === chatId) {
          this.currentChat = chatItem;

          const chatHistoryParams = {
            chatId,
            page: 0,
            size: 100,
          };

          this.fetchChatData(chatHistoryParams);
        }
      });
    } catch (error) {
      //
    }
  }

  @action.bound
  async fetchChatData(params) {
    try {
      const res = await request({
        url: '/aikb/v1/chat/history',
        method: 'get',
        params,
        headers: {
          'Authorization': storage.getItem('token')},
      });

      console.log('会话数据res', res);
      const { payload = [] } = res;
      const chatHistoryData = [];
      const initChatObj = {
        ask: null,
        anwser: {
          loading: false,
          textIntro: '',
          text: 'Hi，我是人工智能小助手。很高兴遇见你！有任何疑问都可以在这里获得解答~',
          showCollapse: false,
          textReference: [],
          recommend: [],
        },
      };

      chatHistoryData.push(initChatObj);

      let askText = '';
      payload.forEach((chatItem) => {
      const chatObj = {};
      if (chatItem.role === "USER") {
        chatObj.ask = {
          text: chatItem.content.text
        };
        askText = chatItem.content.text;
        chatObj.anwser = null;
      }

      if (chatItem.role === "ASSISTANT") {
        const textReference = chatItem.content.refList || [];
        console.log('chatItem.refList', chatItem.content.refList);
        chatObj.ask = null;
        chatObj.anwser = {
          loading: false,
          textIntro: `在阅读了大量文件后，我甄选了${textReference.length}份最相关的文件供您参考。`,
          text: chatItem.content.text,
          showCollapse: textReference.length > 0,
          textReference,
          recommend: [],
          showAction: true,
          rating: chatItem.rating,
          id: chatItem.id,
          askText
        };

        this.textReference = textReference;
      }

      if (chatItem.role === "QA") {
        const textReference = chatItem.content.refList || [];
        console.log('chatItem.refList', chatItem.content.refList);
        chatObj.ask = null;
        chatObj.anwser = {
          loading: false,
          textIntro: 'AI大模型告诉您：',
          text: chatItem.content.text,
          showCollapse: false,
          textReference,
          recommend: [],
          showAction: true,
          rating: chatItem.rating,
          id: chatItem.id,
          askText
        };

        this.textReference = textReference;
      }
      chatHistoryData.push(chatObj);
      });
      console.log('chatHistoryData', chatHistoryData);
      this.chatData = chatHistoryData;
      this.pageLoading = false;
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
          'Authorization': storage.getItem('token')},
      });

      console.log('创建会话res', res);
      const initChatObj = {
        ask: null,
        anwser: {
          text: 'Hi，我是 AI大模型人工智能小助手。很高兴遇见你！有任何疑问都可以在这里获得解答~',
        },
      };

      this.pageLoading = false;
      this.currentChat = res.payload;
      this.chatData = [initChatObj];

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
          'Authorization': storage.getItem('token')
        },
      });

      console.log('修改会话名称res', res);
      this.currentChat = res.payload;
      this.loading = false;
    } catch (error) {
      //
    }
  }

  @action.bound
  async fetchFeedback(params, msgId) {
    try {
      // this.loading = true;

      const res = await request({
        url: `/aikb/v1/chat/${this.currentChat.id}/msg/${msgId}/feedback`,
        method: 'put',
        data: params,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': storage.getItem('token')
        },
      });
      return res;
      // this.loading = false;
    } catch (error) {
      //
    }
  }
}

export default createContext(new NewChatStore());
