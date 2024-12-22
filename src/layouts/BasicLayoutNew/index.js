import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Tooltip, Divider } from 'antd';
// import SiderMenuNew from '../SiderMenuNew';
import {
  HistoryOutlined,
  AppstoreAddOutlined,
  HomeOutlined,
  FormOutlined
} from '@ant-design/icons';

import './style.less';

const { Content, Footer } = Layout;

const BasicLayoutNew = ({ route, children }) => {
  const [currentPathname, setCurrentPathname] = useState('/home');
  const history = useHistory();
  const goToPage = (path) => {
    history.push(path);
  }

  console.log(history);

  useEffect(() => {
    setCurrentPathname(history.location.pathname);
  }, [history.location.pathname]);

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
          <div className="menu-item" onClick={ () => { goToPage('/newChat') }}>
            <Tooltip placement="right" title='开启新会话'>
              <AppstoreAddOutlined style={{ fontSize: '24px', color: currentPathname === '/newChat' ? '#4993CB' : '#333'  }} />
            </Tooltip>
          </div>
          <div className="menu-item" onClick={ () => { goToPage('/historyChat') }}>
            <Tooltip placement="right" title='历史会话'>
              <HistoryOutlined style={{ fontSize: '24px', color: currentPathname === '/historyChat' ? '#4993CB' : '#333'  }} />
            </Tooltip>
          </div>
          <div className="menu-item" onClick={ () => { window.open('http://ais.fxincen.top:8030/', '_blank') }}>
            <Tooltip placement="right" title='写作助手'>
              <FormOutlined style={{ fontSize: '24px' }} />
            </Tooltip>
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
