import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, message, List, Spin, Popconfirm, Modal, Input } from 'antd';
import { observer } from 'mobx-react';
import dayjs from 'dayjs';
import Store from './store';

import './style.less';

const isBetween = require('dayjs/plugin/isBetween');

dayjs.extend(isBetween);

const HistoryChatPage = () => {
  const newChatStore = useContext(Store);
  const [editChatNameShow, setEditChatNameShow] = useState(false);
  const [currentChat, setCurrentChat] = useState('');
  const [newChatName, setNewChatName] = useState('');

  const history = useHistory();

  const {
    historyChatData, historyTopChatData, pageLoading, fetchHistoryChatList, fetchHistoryTopChatList, fetchChatToTop, fetchChatDelete,
    fetchEditChatName,
  } = newChatStore;

  const today = dayjs().format('YYYY-MM-DD');
  // const yestoday = dayjs(today).subtract(1, 'day').format('YYYY-MM-DD');
  const last7day = dayjs(today).subtract(7, 'day').format('YYYY-MM-DD');
  const last30day = dayjs(today).subtract(30, 'day').format('YYYY-MM-DD');
  console.log('last7day', last7day);
  const todayHistoryChatData = historyChatData.filter((chat) => dayjs(today).isSame(dayjs(chat.createdAt), 'day'));
  const last7HistoryChatData = historyChatData.filter((chat) =>
    dayjs(chat.createdAt).isBetween(dayjs(today), dayjs(last7day)),
  );
  const last30HistoryChatData = historyChatData.filter((chat) =>
    dayjs(chat.createdAt).isBetween(dayjs(last7day), dayjs(last30day)),
  );
  const before30HistoryChatData = historyChatData.filter((chat) => dayjs(chat.createdAt).isBefore(dayjs(last30day)));

  // console.log('historyChatData', historyChatData);

  const getHistoryChatList = () => {
    const params = {
      page: 0,
      size: 10000,
      sort: 'createdDate,desc',
    };
    fetchHistoryChatList(params);
  };

  const getHistoryTopChatList = () => {
    const params = {
      page: 0,
      size: 10000,
      pinToTop: true
    };
    fetchHistoryTopChatList(params);
  };

  const handleAction = (type, item) => {
    // message.warning('正式版才支持此功能哦！');
    if (type === 'detail') {
      history.push(`/newChat?id=${item.id}`);
    }

    if (type === 'top') {
      fetchChatToTop(item.id);
    }

    if (type === 'edit') {
      setEditChatNameShow(true);
      setCurrentChat(item);
    }

    if (type === 'delete') {
      fetchChatDelete(item.id);
    }
  };

  const handleEditChatNameOk = () => {
    const params = {
      title: newChatName,
    };
    fetchEditChatName(params, currentChat.id);
    setNewChatName('');
    setEditChatNameShow(false);
  };
  const handleEditChatNameCancel = () => {
    setEditChatNameShow(false);
    setNewChatName('');
  };

  // 页面加载获取数据
  useEffect(() => {
    getHistoryTopChatList();
    getHistoryChatList();
  }, []);

  if (pageLoading) {
    return (
      <div className="history-chat-page">
        <Spin size="large" style={{ marginTop: '200px' }} />
      </div>
    );
  }

  return (
    <div className="history-chat-page">
      <div className="head">历史会话</div>
      <div className="content">
        <div className="section">
          <div className="title">置顶</div>
          <List
            className="list"
            size="large"
            bordered
            itemLayout="horizontal"
            dataSource={historyTopChatData}
            renderItem={(item) => (
              <List.Item
                style={{ background: '#fff' }}
                actions={[
                  <a
                    key="detail"
                    className="detail"
                    onClick={() => {
                      handleAction('detail', item);
                    }}
                  >
                    会话详情
                  </a>,
                  <a
                    key="toTop"
                    className="toTop"
                    onClick={() => {
                      handleAction('top', item);
                    }}
                  >
                    取消置顶
                  </a>,
                  <a
                    key="edit"
                    className="edit"
                    onClick={() => {
                      handleAction('edit', item);
                    }}
                  >
                    编辑
                  </a>,
                  <Popconfirm
                    title="删除会话"
                    description="确定要删除该会话吗？"
                    onConfirm={() => {
                      handleAction('delete', item);
                    }}
                    onCancel={() => {}}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a key="delete" className="delete">
                      删除
                    </a>
                  </Popconfirm>,
                ]}
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
                actions={[
                  <a
                    key="detail"
                    className="detail"
                    onClick={() => {
                      handleAction('detail', item);
                    }}
                  >
                    会话详情
                  </a>,
                  <a
                    key="toTop"
                    className="toTop"
                    onClick={() => {
                      handleAction('top', item);
                    }}
                  >
                    置顶
                  </a>,
                  <a
                    key="edit"
                    className="edit"
                    onClick={() => {
                      handleAction('edit', item);
                    }}
                  >
                    编辑
                  </a>,
                  <Popconfirm
                    title="删除会话"
                    description="确定要删除该会话吗？"
                    onConfirm={() => {
                      handleAction('delete', item);
                    }}
                    onCancel={() => {}}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a key="delete" className="delete">
                      删除
                    </a>
                  </Popconfirm>,
                ]}
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
                actions={[
                  <a
                    key="detail"
                    className="detail"
                    onClick={() => {
                      handleAction('detail', item);
                    }}
                  >
                    会话详情
                  </a>,
                  <a
                    key="toTop"
                    className="toTop"
                    onClick={() => {
                      handleAction('top', item);
                    }}
                  >
                    置顶
                  </a>,
                  <a
                    key="edit"
                    className="edit"
                    onClick={() => {
                      handleAction('edit', item);
                    }}
                  >
                    编辑
                  </a>,
                  <Popconfirm
                    title="删除会话"
                    description="确定要删除该会话吗？"
                    onConfirm={() => {
                      handleAction('delete', item);
                    }}
                    onCancel={() => {}}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a key="delete" className="delete">
                      删除
                    </a>
                  </Popconfirm>,
                ]}
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
                actions={[
                  <a
                    key="detail"
                    className="detail"
                    onClick={() => {
                      handleAction('detail', item);
                    }}
                  >
                    会话详情
                  </a>,
                  <a key="toTop" className="toTop" onClick={() => { handleAction('top', item) }}>
                    置顶
                  </a>,
                  <a key="edit" className="edit" onClick={() => { handleAction('edit', item) }}>
                    编辑
                  </a>,
                  <Popconfirm
                    title="删除会话"
                    description="确定要删除该会话吗？"
                    onConfirm={() => {
                      handleAction('delete', item);
                    }}
                    onCancel={() => {}}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a key="delete" className="delete">
                      删除
                    </a>
                  </Popconfirm>,
                ]}
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
                actions={[
                  <a
                    key="detail"
                    className="detail"
                    onClick={() => {
                      handleAction('detail', item);
                    }}
                  >
                    会话详情
                  </a>,
                  <a key="toTop" className="toTop" onClick={() => { handleAction('top', item) }}>
                    置顶
                  </a>,
                  <a key="edit" className="edit" onClick={() => { handleAction('edit', item) }}>
                    编辑
                  </a>,
                  <Popconfirm
                    title="删除会话"
                    description="确定要删除该会话吗？"
                    onConfirm={() => {
                      handleAction('delete', item);
                    }}
                    onCancel={() => {}}
                    okText="确定"
                    cancelText="取消"
                  >
                    <a key="delete" className="delete">
                      删除
                    </a>
                  </Popconfirm>,
                ]}
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
      <Modal title="修改名称" open={editChatNameShow} onOk={handleEditChatNameOk} onCancel={handleEditChatNameCancel}>
        <Input
          value={newChatName}
          onChange={(e) => {
            setNewChatName(e.target.value);
          }}
        />
      </Modal>
    </div>
  );
};

export default observer(HistoryChatPage);
