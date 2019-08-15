import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Form, Icon, Input, Button, Row, Col, message } from "antd";
import initVarifyCode from "../assets/initVarifyCode.js";
import { login } from "../service";
import Router from "next/router";
import { setCookie } from "../assets/utils";
import md5 from "js-md5";
import root from "../components/root";
import { FormattedMessage } from "react-intl";
import Intl from "../components/intl";

import "../style/login.less";

class Login extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  state = {
    varifyCode: false
  };

  componentDidMount() {
    const input = this.refs["inputCode"].input;
    initVarifyCode(input, this);
  }

  ifAccessVarify = () => {
    if (this.state.varifyCode) {
      return true;
    } else {
      message.error("验证码错误");
      return false;
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.ifAccessVarify()) return;
    this.props.form.validateFields((err, values) => {
      const { user_name, password } = values;
      if (!err) {
        login({
          user_name,
          password: md5(password)
        })
          .then(function(response) {
            if (response.code === 2000) {
              message.info(response.msg);
              setCookie(response.data);
              Router.push({
                pathname: "/index"
              });
            } else {
              message.info(response.msg);
            }
          })
          .catch(function(error) {
            console.log(error);
            message.error("服务器开小差了，请稍后再试");
          });
      }
    });
  };

  render() {
    const { isMobile } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Intl>
        <div>
          <Head title="登录" />
          <Nav isMobile={isMobile} />
          <div className="login-wraper">
            <p className="login-title">登录</p>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item label="账号/邮箱">
                {getFieldDecorator("user_name", {
                  rules: [
                    { required: true, message: "Please input your username!" }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    size="large"
                    placeholder="4-20位"
                  />
                )}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Please input your password!" }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    type="password"
                    size="large"
                    placeholder="4-20位"
                  />
                )}
              </Form.Item>
              <Form.Item label="验证码">
                <Row gutter={8}>
                  <Col span={18}>
                    <Input
                      ref="inputCode"
                      prefix={
                        <Icon
                          type="picture"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      size="large"
                      placeholder="请输入验证码"
                    />
                  </Col>
                  <Col span={6}>
                    <span id="code" className="mycode" />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="login-form-button"
                >
                  确认登录
                </Button>
                还没有账号？<a href="/sign">点击注册</a>
              </Form.Item>
            </Form>
          </div>
          <Footer />
        </div>
      </Intl>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "normal_login" })(Login);
const RootCom = root(WrappedRegistrationForm);
export default RootCom;
