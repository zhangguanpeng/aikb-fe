import React, { useEffect, useContext } from 'react';
import { message, List } from 'antd';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';
import Store from './store';

import './style.less';

const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

const HistoryChatPage = () => {
  const newChatStore = useContext(Store);
  const { historyChatData, fetchHistoryChatList } = newChatStore;

  const today = dayjs().format('YYYY-MM-DD');
  const yestoday = dayjs(today).subtract(1, 'day').format('YYYY-MM-DD');
  const last7day = dayjs(today).subtract(7, 'day').format('YYYY-MM-DD');
  const last30day = dayjs(today).subtract(30, 'day').format('YYYY-MM-DD');
  console.log('last7day', last7day);
  const todayHistoryChatData = historyChatData.filter(chat => dayjs(today).isSame(dayjs(chat.createdAt), 'day'));
  const last7HistoryChatData = historyChatData.filter(chat => dayjs(chat.createdAt).isBetween(dayjs(today), dayjs(last7day)));
  const last30HistoryChatData = historyChatData.filter(chat => dayjs(chat.createdAt).isBetween(dayjs(last7day), dayjs(last30day)));
  const before30HistoryChatData = historyChatData.filter(chat => dayjs(chat.createdAt).isBefore(dayjs(last30day)));

  // console.log('historyChatData', historyChatData);

  const getHistoryChatList = () => {
		const params = {
			page: 0,
			size: 10000,
			sort: 'createdDate,desc'
		};
		fetchHistoryChatList(params);
	}

  const handleAction = () => {
    message.warning('正式版才支持此功能哦！');
  }

  // 页面加载获取数据
  useEffect(() => {
    getHistoryChatList();
  }, []);

  return (
    <div className="history-chat-page">
      <div className="head">
        历史会话
      </div>
      <div className="content">
        <div className="section">
          <div className="title">置顶</div>
          <List
            className="list"
            size="large"
            bordered
            itemLayout="horizontal"
            dataSource={[]}
            renderItem={(item) => (
              <List.Item
                style={{ background: '#fff' }}
                actions={
                  [
                    <a key="toTop" className="toTop" onClick={handleAction}>取消置顶</a>,
                    <a key="edit" className="edit" onClick={handleAction}>编辑</a>,
                    <a key="delete" className="delete" onClick={handleAction}>删除</a>
                  ]
                }
              >
                <div>
                  <span>{item.title}</span>
                  <span className="time">{item.createdAt}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="section">
          <div className="title">今天</div>
          <List
            className="list"
            size="large"
            bordered
            itemLayout="horizontal"
            dataSource={todayHistoryChatData}
            renderItem={(item) => (
              <List.Item
                style={{ background: '#fff' }}
                actions={
                  [
                    <a key="toTop" className="toTop" onClick={handleAction}>置顶</a>,
                    <a key="edit" className="edit" onClick={handleAction}>编辑</a>,
                    <a key="delete" className="delete" onClick={handleAction}>删除</a>
                  ]
                }
              >
                <div>
                  <span>{item.title}</span>
                  <span className="time">{item.createdAt}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="section">
          <div className="title">7天内</div>
          <List
            className="list"
            size="large"
            bordered
            itemLayout="horizontal"
            dataSource={last7HistoryChatData}
            renderItem={(item) => (
              <List.Item
                style={{ background: '#fff' }}
                actions={
                  [
                    <a key="toTop" className="toTop" onClick={handleAction}>置顶</a>,
                    <a key="edit" className="edit" onClick={handleAction}>编辑</a>,
                    <a key="delete" className="delete" onClick={handleAction}>删除</a>
                  ]
                }
              >
                <div>
                  <span>{item.title}</span>
                  <span className="time">{item.createdAt}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="section">
          <div className="title">30天内</div>
          <List
            className="list"
            size="large"
            bordered
            itemLayout="horizontal"
            dataSource={last30HistoryChatData}
            renderItem={(item) => (
              <List.Item
                style={{ background: '#fff' }}
                actions={
                  [
                    <a key="toTop" className="toTop" onClick={handleAction}>置顶</a>,
                    <a key="edit" className="edit" onClick={handleAction}>编辑</a>,
                    <a key="delete" className="delete" onClick={handleAction}>删除</a>
                  ]
                }
              >
                <div>
                  <span>{item.title}</span>
                  <span className="time">{item.createdAt}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
        <div className="section">
          <div className="title">30天以上</div>
          <List
            className="list"
            size="large"
            bordered
            itemLayout="horizontal"
            dataSource={before30HistoryChatData}
            renderItem={(item) => (
              <List.Item
                style={{ background: '#fff' }}
                actions={
                  [
                    <a key="toTop" className="toTop" onClick={handleAction}>置顶</a>,
                    <a key="edit" className="edit" onClick={handleAction}>编辑</a>,
                    <a key="delete" className="delete" onClick={handleAction}>删除</a>
                  ]
                }
              >
                <div>
                  <span>{item.title}</span>
                  <span className="time">{item.createdAt}</span>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(HistoryChatPage);
