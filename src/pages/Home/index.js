import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, message, Upload } from 'antd';
import { observer } from 'mobx-react';
import { UploadPicture, Send, CloseOne } from '@icon-park/react';
import logoImage from '../../assets/images/ai-logo.png';
import Store from './store';
import './style.less';

const guessAsks = [
  '请描述图片中包含的物体',
  '请描述图片包含物体的质量安全问题及检查要点'
];

const HomePage = () => {
  const [askInputValue, setAskInputValue] = useState('');
  const [uploadedPics, setUploadedPics] = useState([]);
  const history = useHistory();
  const homeStore = useContext(Store);

  const { uploadChatImage } = homeStore;

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

  // 页面加载获取数据
  useEffect(() => {
    //
  }, []);

  const goToNewChatPage = () => {
    if (!askInputValue) {
      message.warning('请输入您想问的问题');
      return
    }
    history.push({
      pathname: '/newChat',
      query: {
        value: {
          text: askInputValue,
          imageList: uploadedPics
        }
      }
    });
  }

  const handleGuessAsk = (askValue) => {
    setAskInputValue(askValue);
    history.push({
      pathname: '/newChat',
      query: {
        value: {
          text: askValue,
          imageList: uploadedPics
        }
      }
    });
  }

  const handleUploadPic = () => {
    // const newPicUrl = 'http://ais.fxincen.top:8090/aikb/v1/chat/image/m:qa--3768e274314845719b0ba9b3942c7c38.jpg';
    // setUploadedPics((current) => [...current, newPicUrl]);
  }

  const deleteUploadedPic = (index) => {
    console.log('deleteUploadedPic, index', index);

    const newUploadedPics = [...uploadedPics];
    newUploadedPics.splice(index, 1);
    setUploadedPics([...newUploadedPics]);
  }

  return (
    <div className="home-page">
      {/* <div className="head">未命名会后</div> */}
      <div className="content">
        <div className="home-logo">
          <img src={logoImage}/>
        </div>
        <div className="home-input">
          <Input.TextArea
            placeholder="请输入您想问的内容"
            value={askInputValue}
            bordered={false}
            onChange={(e) => { setAskInputValue(e.target.value) }}
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
            <div className="image-upload" onClick={handleUploadPic}>
              <Upload {...uploadProps}>
                <UploadPicture theme="outline" size="24" fill="#333" />
              </Upload>
            </div>
            <div className="btn-send" onClick={goToNewChatPage}>
              {/* <SendOutlined style={{ fontSize: '24px', color: '#318CFF'}} /> */}
              <Send theme="outline" size="24" fill="#318CFF" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(HomePage);
