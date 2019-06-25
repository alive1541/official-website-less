import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Form, Icon, Input, Button, Row, Col, message } from "antd";
import initVarifyCode from "../assets/initVarifyCode.js";
import { sign } from "../service";
import Router from "next/router";
import md5 from "js-md5";

import "../style/sign.less";

class Sign extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  state = {
    confirmDirty: false,
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        sign({
          user_name: values.user_name,
          password: md5(values.password),
          mail: values.mail
        })
          .then(function(response) {
            if (response.code === 2000) {
              message.info(response.msg);
              Router.push({
                pathname: "/login",
                query: {
                  user_name: values.user_name,
                  mail: values.mail
                }
              });
            } else {
              message.error(response.msg);
            }
          })
          .catch(function(error) {
            message.error("服务器开小差了，请稍后再试");
          });
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不一致！");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const { isMobile } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} />
        <div className="sign-wraper">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="账号">
              {getFieldDecorator("user_name", {
                rules: [
                  { required: true, message: "请输入用户名!" },
                  { max: 20, message: "用户名不能超过20个字符!" },
                  { min: 4, message: "用户名不能少于4个字符!" }
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
                  {
                    required: true,
                    message: "请输入密码!"
                  },
                  {
                    validator: this.validateToNextPassword
                  },
                  { max: 20, message: "密码不能超过20个字符!" },
                  { min: 4, message: "密码不能少于4个字符!" }
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
            <Form.Item label="确认密码">
              {getFieldDecorator("confirm", {
                rules: [
                  {
                    required: true,
                    message: "请输入确认密码!"
                  },
                  {
                    validator: this.compareToFirstPassword
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  size="large"
                  placeholder="请输入确认密码"
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
            <Form.Item label="邮箱">
              {getFieldDecorator("mail", {
                rules: [
                  {
                    type: "email",
                    message: "请输入正确的邮箱!"
                  },
                  {
                    required: true,
                    message: "请输入邮箱!"
                  }
                ]
              })(<Input size="large" placeholder="请输入邮箱" />)}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="sign-form-button"
              >
                免费注册
              </Button>
              已有账号？<a href="/login">点击登录</a>
            </Form.Item>
          </Form>
        </div>
        <Footer />
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "sign" })(Sign);

export default WrappedRegistrationForm;
