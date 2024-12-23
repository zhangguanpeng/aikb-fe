import React, { useState, useEffect, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Spin, Avatar, Drawer, Modal } from 'antd';
import { observer } from 'mobx-react';
import { SendOutlined, UserOutlined, UnorderedListOutlined, EditOutlined } from '@ant-design/icons';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import CustomCollapse from '@/components/CustomCollapse';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import logo from '../../assets/images/logo1.png';
import Store from './store';

import './style.less';

const NewChatPage = () => {
  const [askInputValue, setAskInputValue] = useState('');
  const [textReference, setTextReference] = useState([]);
  const [textReferenceDetailShow, setTextReferenceDetailShow] = useState(false);
  const [editChatNameShow, setEditChatNameShow] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const newChatStore = useContext(Store);
  const { chatData, currentChat, pageLoading, fetchEditChatName, fetchCreateChat } = newChatStore;

  const chatContentRef = useRef(null);

  const history = useHistory();

  // console.log('chatData', chatData);

  const scrollChatContentToBottom = () => {
    // const chatContentElement = document.querySelector("#chat-content");
    // chatContentElement.scrollTo(0, chatContentElement.scrollHeight + chatContentElement.clientHeight);

    const componentNode = chatContentRef.current;
    if (componentNode) {
      // const isScrolledToBottom = componentNode.scrollTop + componentNode.clientHeight > componentNode.scrollHeight + 10;
      // if (!isScrolledToBottom) {
      //   console.log('isScrolledToBottom');
      //   componentNode.scrollTo(0, componentNode.scrollHeight + 10);
      // }
      componentNode.scrollTo(0, componentNode.scrollHeight + 10);
    }
  };

  // 页面加载获取数据
  useEffect(async () => {
    console.log('history', history);
    const fromHomeValue = history.location.query?.value;
    const params = {
      title: '未命名会话',
    };

    const currentChat = await fetchCreateChat(params);
    console.log('useEffect currentChat', currentChat);
    if (fromHomeValue) {
      getChatStream(fromHomeValue, currentChat);
    }
  }, []);

  useEffect(() => {
    scrollChatContentToBottom();
  });

  const renderChatItem = (chatInfo) => {
    const chatElements = [];
    if (chatInfo.ask) {
      const askElement = (
        <div className="ask-item">
          <div className="ask-item-text">{chatInfo.ask.text}</div>
          <div className="ask-item-avatar">
            <Avatar size={50} icon={<UserOutlined />} style={{ backgroundColor: '#f56a00' }} />
          </div>
        </div>
      );
      chatElements.push(askElement);
    }

    if (chatInfo.anwser) {
      const anwserElement = (
        <div className="anwser-item">
          <div className="anwser-item-avatar">
            <img src={logo} />
          </div>
          <div className="anwser-item-content">
            {/* <div className="tips">在阅读了大量文件后，我甄选了3份最相关的文件供您参考。</div> */}
            {chatInfo.anwser.loading ? (
              <Spin />
            ) : (
              <>
                {chatInfo.anwser.textIntro && <CustomCollapse data={chatInfo.anwser} />}
                <div className="text">{chatInfo.anwser.text}</div>
              </>
            )}
          </div>
        </div>
      );
      chatElements.push(anwserElement);
    }

    if (chatInfo.anwser.recommend) {
      const recommendElements = chatInfo.anwser.recommend.map((recommendItem, index) => (
        <div
          className="recommend-item"
          key={index}
          onClick={() => {
            getChatStream(recommendItem);
          }}
        >
          {recommendItem}
        </div>
      ));
      chatElements.push(recommendElements);
    }

    return chatElements;
  };

  const getChatStream = (question, chat) => {
    // scrollChatContentToBottom();
    const newChatObj = {
      ask: {
        text: question ? question : askInputValue,
      },
      anwser: {
        loading: true,
        textIntro: '',
        text: '',
        showCollapse: false,
        textReference: [],
        recommend: [],
      },
    };

    chatData.push(newChatObj);

    // scrollChatContentToBottom();

    const params = {
      content: {
        text: question ? question : askInputValue,
      },
    };

    setTextReference([]);
    setTextReferenceDetailShow(false);
    setAskInputValue('');

    let delay = 0;
    let textContent = '';
    const chatId = chat ? chat.id : currentChat.id;

    fetchEventSource(`aikb/v1/chat/${chatId}/enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*, text/event-stream',
        Authorization:
          'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIxNTIwIiwidG9rZW5JZCI6IjlhN2RkNWE4ZGYzMDQwYjBiOTg4YTdmNThmOGYxYmZhIiwic3ViIjoi6L-Q6JCl5Y2V5L2N5a6J5YWo6aOO6Zmp566h55CG5bKXIiwiaWF0IjoxNzM0OTIyMDQxLCJleHAiOjE3MzYxMzE2NDF9.hBAxbBGu8J41BMym2jjmAqJVSPaFL2VxKjcoOGW4HLlT6XM85q45IaVYYUv2a_20SMDM2M5SHsRy1wDOpnBvXQ',
      },
      body: JSON.stringify(params),
      onmessage(event) {
        delay = delay + 50;

        const st = setTimeout(() => {
          if (newChatObj.anwser.loading) {
            // setLoading(false);
            newChatObj.anwser.loading = false;
          }
          // newChatStore.chatData[chatData.length - 1] = newChatObj;

          const res = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          console.log('收到消息：', res);
          if (res.payload.type === 'RECOMMEND') {
            const recommend = JSON.parse(res.payload.body);
            console.log('recommend', recommend);
            // newChatObj.anwser.recommend = typeof recommend[0] === 'string' ? JSON.parse(recommend[0]) : recommend[0];
            newChatObj.anwser.recommend = recommend;
            newChatStore.chatData[chatData.length - 1] = newChatObj;
          }

          if (res.payload.type === 'REFERENCE') {
            const newTextReference = JSON.parse(res.payload.body);
            console.log('newTextReference', newTextReference);
            setTextReference(newTextReference);
            setTextReferenceDetailShow(true);
            newChatObj.anwser.textIntro = `在阅读了大量文件后，我甄选了${newTextReference.length}份最相关的文件供您参考。`;
            newChatObj.anwser.showCollapse = true;
            newChatObj.anwser.textReference = newTextReference;
            // newChatStore.chatData[chatData.length - 1] = newChatObj;
          }

          if (res.payload.type === 'MESSAGE') {
            textContent = `${textContent}${res.payload.body}`;
            if (!newChatObj.anwser.textIntro) {
              newChatObj.anwser.textIntro = 'AI大模型告诉您';
            }
            newChatObj.anwser.text = textContent;
            // newChatStore.chatData[chatData.length - 1] = newChatObj;

            newChatStore.chatData[chatData.length - 1] = newChatObj;
            // scrollToBottom();

            if (st) {
              clearTimeout(st);
            }

            // scrollChatContentToBottom();
          }
        }, delay);
      },
      onclose() {
        // 关闭流
        // scrollChatContentToBottom();
        this.close();
      },
      onerror(error) {
        // console.info(error);
        //返回流报错
        // this.close();
        throw new Error(error);
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleEditChatNameOk = () => {
    const params = {
      title: newChatName,
    };
    fetchEditChatName(params);
    setEditChatNameShow(false);
  };
  const handleEditChatNameCancel = () => {
    setEditChatNameShow(false);
  };

  if (pageLoading) {
    return (
      <div className={textReferenceDetailShow ? 'new-chat-page page-position-drawer' : 'new-chat-page page-position'}>
        <Spin size="large" style={{marginTop: '200px'}} />
      </div>
    )
  }

  return (
      <div className={textReferenceDetailShow ? 'new-chat-page page-position-drawer' : 'new-chat-page page-position'}>
        <div className="head">
          <div className="chat-name">
            <span className="title">{currentChat.title}</span>
            <span
              className="edit-icon"
              onClick={() => {
                setEditChatNameShow(true);
              }}
            >
              <EditOutlined />
            </span>
          </div>
          <div
            className="reference-btn"
            onClick={() => {
              setTextReferenceDetailShow(true);
            }}
          >
            <UnorderedListOutlined style={{ fontSize: '24px', color: '#4993CB' }} />
            <div className="text">引用详情</div>
          </div>
        </div>
        <div className="content" ref={chatContentRef} id="chat-content">
          {chatData.map((chatInfo) => renderChatItem(chatInfo))}
        </div>
        <div className="ask-input">
          <Input
            placeholder="请输入您想问的内容"
            value={askInputValue}
            onChange={(e) => {
              setAskInputValue(e.target.value);
            }}
          />
          <div className="btns">
            <div
              className="btn-send"
              onClick={() => {
                getChatStream();
              }}
            >
              <SendOutlined style={{ fontSize: '24px', color: '#4993CB' }} />
            </div>
          </div>
        </div>

        <Drawer
          title="引用内容"
          placement="right"
          onClose={() => {
            setTextReferenceDetailShow(false);
          }}
          open={textReferenceDetailShow}
          className="new-chat-drawer"
          mask={false}
        >
          {textReference.map((referenceItem, index) => (
            <div className="drawer-markdown-content" key={index}>
              <div className="title">{referenceItem.title}</div>
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {referenceItem.content}
              </ReactMarkdown>
            </div>
          ))}
        </Drawer>
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

export default observer(NewChatPage);
