import React from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Checkbox, Button, message, Tabs, Space } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

import { appStores } from '@/stores';
// import logo from '@/assets/images/logo.png';
import './style.less';

const LoginPage = () => {
  const history = useHistory();
  const { globalStore } = appStores();

  const handleSubmit = (values) => {
    console.log('登录信息 ', values);
    message.success('登录成功，即将跳转...', 2);
    setTimeout(() => {
      history.push('/');
    }, 2000);
  };

  return (
    <div className="page-login">
      <div className="content">
        {/* <img src={logo} alt="" /> */}
        <div className="left">{/* <div className="login-title">欢迎登录 {globalStore.appTitle}</div> */}</div>
        <div className="right">
          <Tabs defaultActiveKey="1" size="large">
            <Tabs.TabPane tab="密码登录" key="1">
              <div className="form-box">
                <Form onFinish={handleSubmit}>
                  <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
                    <Input
                      size="large"
                      prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="用户名"
                    />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
                    <Input
                      size="large"
                      prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="密码"
                    />
                  </Form.Item>
                  <Form.Item name="remember" valuePropName="checked" initialValue>
                    <Checkbox>记住我</Checkbox>
                    <a className="login-form-forgot" href="">
                      忘记密码
                    </a>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" htmlType="submit" className="login-form-button">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="免密登录" key="2">
              <div className="form-box">
                <Form onFinish={handleSubmit}>
                  <Form.Item name="username" rules={[{ required: true, message: '请输入用户名！' }]}>
                    <Input
                      size="large"
                      prefix={<MobileOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="请输入手机号"
                    />
                  </Form.Item>
                  <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
                    <Input
                      size="large"
                      placeholder="图片验证码"
                    />
                  </Form.Item>
                  <Form.Item name="remember" valuePropName="checked" initialValue>
                    <Space direction="horizontal">
                      <Input
                        size="large"
                        placeholder="短信验证码"
                      />
                      <Button type="link" style={{ width: 80 }} onClick={() => {}}>
                        获取验证码
                      </Button>
                    </Space>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" htmlType="submit" className="login-form-button">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default observer(LoginPage);
