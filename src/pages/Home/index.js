import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input } from 'antd';
import { observer } from 'mobx-react';
import {
  SendOutlined
} from '@ant-design/icons';
import logoImage from '../../assets/images/logo.png';
import './style.less';

const HomePage = () => {
  const [askInputValue, setAskInputValue] = useState('');
  const history = useHistory();

  // 页面加载获取数据
  useEffect(() => {
    //
  }, []);

  const goToNewChatPage = () => {
    history.push({
      pathname: '/newChat',
      query: {
        value: askInputValue
      }
    });
  }

  return (
    <div className="home-page">
      {/* <div className="head">未命名会后</div> */}
      <div className="content">
        <div className="home-logo">
          <img src={logoImage}/>
        </div>
        <div className="home-input">
          <Input
            placeholder="请输入您想问的内容"
            value={askInputValue}
            onChange={(e) => { setAskInputValue(e.target.value) }}
          />
          <div className="btns">
            <div className="btn-send" onClick={goToNewChatPage}>
              <SendOutlined style={{ fontSize: '24px', color: '#4993CB'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(HomePage);
