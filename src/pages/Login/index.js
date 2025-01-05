/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Checkbox, Button, message, Tabs, Space } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

import { appStores } from '@/stores';
// import logo from '@/assets/images/logo.png';
import './style.less';
import { Result } from 'antd';

const LoginPage = () => {
  const history = useHistory();
  const { globalStore } = appStores();
  const [passwordForm] = Form.useForm();
  const [codeForm] = Form.useForm();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [picCode, setPicCode] = useState('');

  const { picCodeInfo, fetchPicCode, fetchVerifyCode, fetchPasswordLogin, fetchVerifyCodeLogin } = globalStore;

  // const handleSubmit = (values) => {
  //   console.log('登录信息 ', values);
  //   message.success('登录成功，即将跳转...', 2);
  //   setTimeout(() => {
  //     history.push('/');
  //   }, 2000);
  // };

  useEffect(() => {
    fetchPicCode();
  }, []);

  const validateCheckbox = (rule, value, callback) => {
    // 自定义校验逻辑
    if (!value) {
      callback('请阅读并勾选用户协议');
    } else {
      callback();
    }
  };

  const handlePasswordLogin = () => {
    const { username, password } = passwordForm.getFieldsValue();
    const loginParams = {
      username,
      password,
    };

    passwordForm
      .validateFields()
      .then((result) => {
        console.log('校验 result', result);
        fetchPasswordLogin(loginParams)
          .then(() => {
            history.push('/');
          })
          .catch(() => {
            message.error('登录失败', 2);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVerifyCodeLogin = async () => {
    const { phoneNumber, verifyCode } = codeForm.getFieldsValue();
    const loginParams = {
      phoneNumber,
      verifyCode,
    };

    codeForm
      .validateFields()
      .then((result) => {
        console.log('校验 result', result);
        fetchVerifyCodeLogin(loginParams)
          .then(() => {
            history.push('/');
          })
          .catch(() => {
            message.error('登录失败', 2);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getVerifyCode = () => {
    const { phoneNumber, picCode } = codeForm.getFieldsValue();

    const params = {
      token: picCodeInfo.token,
      phoneNumber,
      verifyCode: picCode,
    };

    fetchVerifyCode(params)
      .then(() => {
        message.success('短信验证码已发送', 2);
      })
      .catch(() => {
        message.error('登录失败', 2);
      });
  };

  return (
    <div className="page-login">
      <div className="content">
        {/* <img src={logo} alt="" /> */}
        <div className="left">{/* <div className="login-title">欢迎登录 {globalStore.appTitle}</div> */}</div>
        <div className="right">
          <div className="title">用户登录</div>
          <Tabs defaultActiveKey="1" size="large">
            <Tabs.TabPane tab="密码登录" key="1">
              <div className="form-box">
                <Form form={passwordForm} name="passwordForm">
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
                  <Form.Item name="agreement" valuePropName="checked" rules={[{ validator: validateCheckbox }]}>
                    {/* <Checkbox value={agreementChecked} onChange={(e) => {setAgreementChecked(e.target.checked)}}>登录/注册默认已阅读同意</Checkbox>
                     */}
                    <Checkbox>
                      登录/注册默认已阅读同意
                      <a className="agreement">模型服务协议</a>
                      <span>和</span>
                      <a className="agreement">用户隐私协议</a>
                    </Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" className="login-form-button" onClick={handlePasswordLogin}>
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="免密登录" key="2">
              <div className="form-box">
                <Form form={codeForm} name="codeForm">
                  <Form.Item name="phoneNumber" rules={[{ required: true, message: '请输入手机号！' }]}>
                    <Input
                      size="large"
                      prefix={<MobileOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="请输入手机号"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="picCode" rules={[{ required: true, message: '请输入图片验证码！' }]}>
                    <Space direction="horizontal">
                      <Input
                        size="large"
                        placeholder="图片验证码"
                        value={picCode}
                        onChange={(e) => {
                          setPicCode(e.target.value);
                        }}
                      />
                      <div style={{ width: 120, height: 40, overflow: 'hidden' }}>
                        <img
                          src={`data:image/png;base64,${picCodeInfo.imageBase64}`}
                          style={{ width: 350, height: 40 }}
                          alt=""
                        />
                      </div>
                      <Button
                        type="link"
                        style={{ width: 70 }}
                        onClick={() => {
                          fetchPicCode();
                        }}
                      >
                        换一个
                      </Button>
                    </Space>
                  </Form.Item>
                  <Form.Item name="verifyCode" rules={[{ required: true, message: '请输入短信验证码！' }]}>
                    <Space direction="horizontal">
                      <Input size="large" placeholder="短信验证码" />
                      <Button
                        type="link"
                        style={{ width: 80 }}
                        disabled={!phoneNumber || !picCode}
                        onClick={getVerifyCode}
                      >
                        获取验证码
                      </Button>
                    </Space>
                  </Form.Item>
                  <Form.Item name="agreement" valuePropName="checked" rules={[{ validator: validateCheckbox }]}>
                    {/* <Checkbox value={agreementChecked} onChange={(e) => {setAgreementChecked(e.target.checked)}}>登录/注册默认已阅读同意</Checkbox>
                     */}
                    <Checkbox>
                      登录/注册默认已阅读同意
                      <a className="agreement">模型服务协议</a>
                      <span>和</span>
                      <a className="agreement">用户隐私协议</a>
                    </Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" size="large" className="login-form-button" onClick={handleVerifyCodeLogin}>
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
