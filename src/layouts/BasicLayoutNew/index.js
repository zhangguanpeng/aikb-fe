import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Tooltip, Divider, Popover, Button, message } from 'antd';
// import SiderMenuNew from '../SiderMenuNew';
import {
  HistoryOutlined,
  MessageOutlined,
  HomeOutlined,
  FormOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { storage } from '@/utils';

import './style.less';

const { Content, Footer } = Layout;

const BasicLayoutNew = ({ route, children }) => {
  const [currentPathname, setCurrentPathname] = useState('/home');
  const history = useHistory();
  const goToPage = (path) => {
    history.push(path);
  }

  const token = storage.getItem('token');
  const expirestamp = storage.getItem('expirestamp');
  const expired = dayjs().unix() > expirestamp;
  // 判断是否登录或者会话是否过期
  if (!token || expired) {
    message.warning('登录已经失效，请重新登录');
    goToPage('/login');
  }

  console.log(history);

  useEffect(() => {
    setCurrentPathname(history.location.pathname);
  }, [history.location.pathname]);

  const loginOut = () => {
    storage.setItem('token', '');
    goToPage('/login');
  }

  const userActionContent = (
    <div className="user-action-popover">
      <div className="popover-item" onClick={loginOut}>退出登录</div>
      {/* <Divider style={{ margin: '5px 0px' }} />
      <div className="popover-item">修改密码</div> */}
    </div>
  );

  return (
    <Layout className="main-layout">
      {/* <div>header</div> */}
      <Content style={{ padding: '0 48px' }} className="content">
        {/* <Sider className="sider-menu" collapsible collapsed trigger={null}>
          <SiderMenuNew routes={route.childRoutes} />
        </Sider> */}
        <div className="sider-menu">
          <div className="menu-item" onClick={ () => { goToPage('/home') }}>
            <Tooltip placement="right" title='首页'>
              <HomeOutlined style={{ fontSize: '24px', color: currentPathname === '/home' ? '#4993CB' : '#333' }} />
            </Tooltip>
          </div>
          <Divider style={{ margin: '0px' }} />
          <div className="menu-item" onClick={ () => { goToPage('/newChat') }}>
            <Tooltip placement="right" title='开启新会话'>
              <MessageOutlined style={{ fontSize: '24px', color: currentPathname === '/newChat' ? '#4993CB' : '#333'  }} />
            </Tooltip>
          </div>
          <Divider style={{ margin: '0px' }} />
          <div className="menu-item" onClick={ () => { goToPage('/historyChat') }}>
            <Tooltip placement="right" title='历史会话'>
              <HistoryOutlined style={{ fontSize: '24px', color: currentPathname === '/historyChat' ? '#4993CB' : '#333'  }} />
            </Tooltip>
          </div>
          <Divider style={{ margin: '0px' }} />
          <div className="menu-item" onClick={ () => { window.open('http://ais.fxincen.top:8030/', '_blank') }}>
            <Tooltip placement="right" title='写作助手'>
              <FormOutlined style={{ fontSize: '24px' }} />
            </Tooltip>
          </div>
          <Divider style={{ margin: '0px' }} />
          <div className="menu-item">
            {/* <Tooltip placement="right" title='写作助手'>
              <UserOutlined style={{ fontSize: '24px' }} />
            </Tooltip> */}
            <Popover content={userActionContent} placement="right" title="">
              <UserOutlined style={{ fontSize: '24px' }} />
            </Popover>
          </div>
        </div>
        <div className="page-area">
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: 'rgb(243, 245, 250)' }}>
        <Divider plain><span style={{ color: 'gray' }}>内容由AI大模型生成，请注意核实</span></Divider>
      </Footer>
    </Layout>
  )
};

export default BasicLayoutNew;
