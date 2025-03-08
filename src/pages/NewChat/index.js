import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, Spin, Avatar, Drawer, Modal, message, Upload, Switch } from 'antd';
import { observer } from 'mobx-react';
import { UserOutlined, UnorderedListOutlined, EditOutlined, CopyOutlined, SyncOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { Send, UploadPicture, ToBottom, CloseOne } from '@icon-park/react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import CustomCollapse from '@/components/CustomCollapse';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { splitUrl, storage } from '@/utils';
import logo from '../../assets/images/logo1.png';
import newChatStore from './store';

import './style.less';

const guessAsks = [
  '请描述图片中包含的物体',
  '请描述图片包含物体的质量安全问题及检查要点'
];

const NewChatPage = () => {
  const [askInputValue, setAskInputValue] = useState('');
  const [editChatNameShow, setEditChatNameShow] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  // const [toBottomBtnShow, setToBottomBtnShow] = useState(false);
  const [uploadedPics, setUploadedPics] = useState([]);
  const [deepseekStatus, setDeepseekStatus] = useState(true);
  // const newChatStore = useContext(Store);
  const {
    chatData, currentChat, pageLoading, textReference, textReferenceDetailShow, fetchEditChatName, fetchCreateChat, fetchHistoryChatList,
    fetchFeedback, uploadChatImage
  } = newChatStore;

  const chatContentRef = useRef(null);

  const history = useHistory();

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

  const customRequest = (fileList) => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append(`imageList`, file);
    });

    uploadChatImage(formData)
      .then((res) => {
        console.log('上传图片res', res);
        const images = res.payload.map((imageItem) => `/aikb/v1/chat/image/${imageItem.oriImageFileUrl}`);
        setUploadedPics((current) => [...current, ...images]);
      })
      .catch(() => {
        message.error('上传失败');
      });
  };

  const uploadProps = {
    name: 'file',
    accept: '.jpg, .png, .jpeg',
    beforeUpload: (file) => {
      console.log('beforeUpload file', file);
      customRequest([file]);
      return false;
    },
    maxCount: 50,
    showUploadList: false,
    multiple: false,
  };

  const getChatStream = (question, chat) => {
    // scrollChatContentToBottom();
    const newChatObj = {
      ask: {
        text: question ? question.text : askInputValue,
        imageList: question ? question.imageList : uploadedPics,
      },
      anwser: {
        loading: true,
        textIntro: '',
        text: '',
        showCollapse: false,
        textReference: [],
        recommend: [],
        showAction: true,
        thinking: true,
        thinkText: ''
      },
    };

    chatData.push(newChatObj);
    console.log('chatData', chatData);
    newChatStore.chatData = [...chatData];

    const params = question ? {
      content: question,
    } : {
      content: {
        text: askInputValue,
        imageList: uploadedPics
      },
    };

    newChatStore.textReference = [];
    newChatStore.textReferenceDetailShow = false;
    setAskInputValue('');

    let delay = 0;
    let textContent = '';
    let isThinking = true;
    let thinkContent = '';
    let anwserId = 0;
    const chatId = chat ? chat.id : currentChat.id;

    fetchEventSource(`aikb/v1/chat/${chatId}/enhanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*, text/event-stream',
        Authorization: storage.getItem('token'),
      },
      body: JSON.stringify(params),
      onmessage(event) {
        delay += 50;
        anwserId += 1;

        const st = setTimeout(() => {
          if (newChatObj.anwser.loading) {
            // setLoading(false);
            newChatObj.anwser.loading = false;
          }
          // newChatStore.chatData[chatData.length - 1] = newChatObj;

          const res = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          console.log('收到消息：', res);
          if (res?.payload?.type === 'RECOMMEND') {
            const recommend = JSON.parse(res.payload.body);
            console.log('recommend', recommend);
            // newChatObj.anwser.recommend = typeof recommend[0] === 'string' ? JSON.parse(recommend[0]) : recommend[0];
            newChatObj.anwser.recommend = recommend;
            newChatStore.chatData[chatData.length - 1] = newChatObj;
          }

          if (res?.payload?.type === 'REFERENCE') {
            const newTextReference = JSON.parse(res.payload.body);
            console.log('newTextReference', newTextReference);
            newChatStore.textReference = newTextReference;
            newChatStore.textReferenceDetailShow = true;
            newChatObj.anwser.textIntro = `在阅读了大量文件后，我甄选了${newTextReference.length}份最相关的文件供您参考。`;
            newChatObj.anwser.showCollapse = true;
            newChatObj.anwser.textReference = newTextReference;
            // newChatStore.chatData[chatData.length - 1] = newChatObj;
          }

          if (res?.payload?.type === 'QA') {
            const newTextReference = JSON.parse(res.payload.body);
            console.log('newTextReference', newTextReference);
            newChatStore.textReference = newTextReference;
            newChatStore.textReferenceDetailShow = newTextReference.length > 0;
            newChatObj.anwser.textIntro = 'AI大模型告诉您：';
            newChatObj.anwser.showCollapse = false;
            newChatObj.anwser.textReference = newTextReference;
            // newChatStore.chatData[chatData.length - 1] = newChatObj;
          }

          if (res?.payload?.type === 'MESSAGE') {
            if (res.payload.body === '<think>') {
              newChatObj.anwser.textIntro = '正在思考：';
              newChatObj.anwser.showCollapse = true;
              newChatObj.anwser.isDeepseek = true;
            }
            
            if (res.payload.body === '</think>') {
              newChatObj.anwser.textIntro = 'AI智能助手已完成深度思考：';
              newChatObj.anwser.thinking = false;
              isThinking = false;
            }

            console.log('isThinking, deepseekStatus', isThinking, deepseekStatus);

            if (isThinking) {
              // console.log('thinkContent', thinkContent);
              thinkContent = res.payload.body === '<think>' || res.payload.body === '</think>' ? thinkContent : `${thinkContent}${res.payload.body}`;
            } else {
              textContent = res.payload.body === '</think>' ? textContent : `${textContent}${res.payload.body}`;
              if (!newChatObj.anwser.textIntro) {
                newChatObj.anwser.textIntro = 'AI大模型告诉您';
              }
            }

            newChatObj.anwser.thinkText = thinkContent;
            newChatObj.anwser.text = textContent;
            newChatObj.anwser.id = `anwser${anwserId}`;
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
        // 返回流报错
        // this.close();
        throw new Error(error);
      },
    }).catch((error) => {
      console.log(error);
    });
  };

  // 页面加载获取数据
  useEffect(async () => {
    console.log('history', history);
    // 先判断是否是从历史会话页面跳转过来
    const urlParams = splitUrl(window.location.href) || {};
    console.log('urlParams', urlParams);
    if (urlParams.id) {
      const params = {
        page: 0,
        size: 1000,
        sort: 'createdDate,desc',
      };
      fetchHistoryChatList(params, urlParams.id);
      return;
    }
    const fromHomeValue = history.location.query?.value;
    const params = {
      title: fromHomeValue ? fromHomeValue.text : '未命名会话',
    };

    const newChat = await fetchCreateChat(params);
    console.log('useEffect newChat', newChat);
    if (fromHomeValue) {
      setDeepseekStatus(fromHomeValue.deepseekStatus);
      getChatStream(fromHomeValue, newChat);
    }

    // 监听页面跳转
    history.listen((location) => {
 
      console.log("路由发生变化，新位置:", location);
      if (location.pathname !== '/newChat') {
        newChatStore.chatData = [];
        newChatStore.textReferenceDetailShow = false;
      }
 
    });

  }, []);

  useEffect(() => {
    scrollChatContentToBottom();
  });

  const handleCopy = (anwser) => {
    message.success('内容已经复制到粘贴板');
    const copyElement = document.getElementById(anwser.id);
    navigator.clipboard.writeText(copyElement.innerText);
  }

  const handleReGenerate = (chatInfo) => {
    getChatStream({
      text: chatInfo.ask.text,
      imageList: []
    });
  }

  const handleFeedback = (actionType, anwser) => {
    const params = {
      rating: actionType,
    };

    fetchFeedback(params, anwser.id).then((result) => {
      console.log('feedback result', result);
      if (result.succeed) {
        anwser.rating = actionType;
      }
    }).catch(() => {
      message.error('反馈失败！');
    });
  }

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

      if (chatInfo.ask.imageList && chatInfo.ask.imageList.length > 0) {
        const askImgElement = (
          <div className="ask-img-item">
            {
              chatInfo.ask.imageList.map((imageUrl) => (
                <div className="img-wrap">
                  <img src={imageUrl} alt="" />
                </div>
              ))
            }
          </div>
        );
        chatElements.push(askImgElement);
      }
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
                {chatInfo.anwser.textIntro && <CustomCollapse data={chatInfo.anwser} isDeepseek={deepseekStatus} />}
                <div className="text" id={chatInfo.anwser.id}>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {chatInfo.anwser.text}
                  </ReactMarkdown>
                </div>
                {
                  chatInfo.anwser.showAction && (
                    <div
                      className="action-box"
                    >
                      <div className="left">
                        <span
                          onClick={() => { handleCopy(chatInfo.anwser) }}
                        >
                          <CopyOutlined />
                          复制
                        </span>
                        <span
                          onClick={() => { handleReGenerate(chatInfo) }}
                        >
                          <SyncOutlined />
                          重新回答
                        </span>
                      </div>
                      <div className="right">
                        <span onClick={() => { handleFeedback('THUMBS_UP', chatInfo.anwser) }}>
                          <LikeOutlined className={chatInfo.anwser.rating === 'THUMBS_UP' ? 'iconActive' : ''} />
                        </span>
                        <span onClick={() => { handleFeedback('THUMBS_DOWN', chatInfo.anwser) }}>
                          <DislikeOutlined className={chatInfo.anwser.rating === 'THUMBS_DOWN' ? 'iconActive' : ''} />
                        </span>
                      </div>
                    </div>
                  )
                }
              </>
            )}
          </div>
        </div>
      );
      chatElements.push(anwserElement);
    }

    if (chatInfo?.anwser?.recommend) {
      const recommendElements = chatInfo.anwser.recommend.map((recommendItem, index) => (
        <div
          className="recommend-item"
          key={index}
          onClick={() => {
            getChatStream({
              text: recommendItem,
              imageList: []
            });
          }}
        >
          {recommendItem}
        </div>
      ));
      chatElements.push(recommendElements);
    }

    return chatElements;
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

  const deleteUploadedPic = (index) => {
    console.log('deleteUploadedPic, index', index);

    const newUploadedPics = [...uploadedPics];
    newUploadedPics.splice(index, 1);
    setUploadedPics([...newUploadedPics]);
  }

  const handleGuessAsk = (askValue) => {
    setAskInputValue(askValue);
    setUploadedPics([]);
    getChatStream({
      text: askValue,
      imageList: uploadedPics
    });
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault();
      console.log('askInputValue', askInputValue);
      if (!askInputValue) {
        message.warning('请输入您想问的问题');
        return;
      }
      // 处理Enter键的逻辑
      getChatStream();
    }
  }

  if (pageLoading) {
    return (
      <div className={textReferenceDetailShow ? 'new-chat-page page-position-drawer' : 'new-chat-page page-position'}>
        <Spin size="large" style={{ marginTop: '200px' }} />
      </div>
    );
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
            newChatStore.textReferenceDetailShow = true;
          }}
        >
          <UnorderedListOutlined style={{ fontSize: '24px', color: '#318CFF' }} />
          <div className="text">引用详情</div>
        </div>
      </div>
      <div className="content" ref={chatContentRef} id="chat-content">
        {chatData.map((chatInfo) => renderChatItem(chatInfo))}
      </div>
      {/* {
        toBottomBtnShow && (
          <div className="toBottom-btn" onClick={scrollChatContentToBottom}>
            <DoubleRightOutlined style={{ fontSize: '24px', color: '#318CFF'}} />
          </div>
        )
      } */}
      <div className="toBottom-btn" onClick={scrollChatContentToBottom}>
        {/* <DoubleRightOutlined style={{ fontSize: '24px', color: '#318CFF'}} /> */}
        <ToBottom theme="filled" size="24" fill="#318CFF" />
      </div>
      <div className="ask-input">
        <Input.TextArea
          placeholder="请输入您想问的内容"
          value={askInputValue}
          bordered={false}
          onChange={(e) => { setAskInputValue(e.target.value) }}
          onKeyPress={handleKeyPress}
          autoSize={{ minRows: 1, maxRows: 3 }}
          style={{ fontSize: '16px' }}
        />
        <div className="pic-box">
            {
              uploadedPics.map((picUrl, index) => (
                <div className="img-wrap" key={index}>
                  <div className="img-close" onClick={() => { deleteUploadedPic(index) }}>
                    <CloseOne theme="filled" size="14" fill="#EB3D47" />
                  </div>
                  <img src={picUrl} alt="" />
                </div>
              ))
            }
        </div>
          {
            uploadedPics.length > 0 && (
              <div className="guess-ask-box">
                <div className="text1">猜你想问：</div>
                {
                  guessAsks.map((askStr) => (<div className="text2" onClick={() => { handleGuessAsk(askStr) }}>{askStr}</div>))
                }
              </div>
            )
          }
        <div className="btns">
          <div className="deepseek-switch">
              <span className={deepseekStatus ? 'isChecked' : 'notChecked'}>深度思考</span>
              <Switch checked={deepseekStatus} onChange={(value) => { setDeepseekStatus(value) }} size="small" />
          </div>
          <div className="image-upload">
              <Upload {...uploadProps}>
                <UploadPicture theme="outline" size="24" fill="#333" />
              </Upload>
          </div>
          <div
            className="btn-send"
            onClick={() => {
              getChatStream();
              setUploadedPics([]);
            }}
          >
            <Send theme="outline" size="24" fill="#318CFF" />
          </div>
        </div>
      </div>

      <Drawer
        title="引用内容"
        placement="right"
        onClose={() => {
          newChatStore.textReferenceDetailShow = false;
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
