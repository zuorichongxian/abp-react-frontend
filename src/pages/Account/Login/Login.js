import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import {Home,DeleteTwo} from '@icon-park/react';
import Test from './test.tsx'
//
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/authenticate'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    rememberClient: true,
  };

  onTabChange = (type) => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type, rememberClient } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/authenticate',
        payload: {
          ...values,
          type,
          rememberClient,
        },
      });
    }
  };

  changeAutoLogin = (e) => {
    this.setState({
      rememberClient: e.target.checked,
    });
  };

  renderMessage = (content) => (
    <Alert
      style={{ marginBottom: 24 }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, rememberClient } = this.state;
    return (
      <div className={styles.main} >
        <Test/>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={(form) => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="??????????????????">
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage('?????????????????????')}
            <UserName
              name="userNameOrEmailAddress"
              placeholder="??????????????????"
              rules={[
                {
                  required: true,
                  message: '?????????????????????',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="??????"
              rules={[
                {
                  required: true,
                  message: '??????????????????',
                },
              ]}
              onPressEnter={() =>
                this.loginForm.validateFields(this.handleSubmit)
              }
            />
          </Tab>
          <Tab key="mobile" tab="???????????????">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage('???????????????')}
            <Mobile
              name="mobile"
              placeholder="?????????"
              rules={[
                {
                  required: true,
                  message: '?????????????????????',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '????????????????????????',
                },
              ]}
            />
            <Captcha
              name="captcha"
              placeholder="?????????"
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText="???????????????"
              getCaptchaSecondText="???"
              rules={[
                {
                  required: true,
                  message: '?????????????????????',
                },
              ]}
            />
          </Tab>
          <div>
            <Checkbox checked={rememberClient} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/accounts/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
