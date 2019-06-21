import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Form, Icon, Input, Button, Row, Col } from "antd";
import initVarifyCode from "../assets/initVarifyCode.js";

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
    confirmDirty: false
  };

  componentDidMount() {
    const input = this.refs["inputCode"].input;
    initVarifyCode(input);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
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
        <Head title="sign" />
        <Nav isMobile={isMobile} />
        <div className="sign-wraper">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="账号">
              {getFieldDecorator("username", {
                rules: [
                  { required: true, message: "Please input your username!" }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  size="large"
                  placeholder="Username"
                />
              )}
            </Form.Item>
            <Form.Item label="密码">
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: "Please input your password!"
                  },
                  {
                    validator: this.validateToNextPassword
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  size="large"
                  placeholder="Password"
                />
              )}
            </Form.Item>
            <Form.Item label="确认密码">
              {getFieldDecorator("confirm", {
                rules: [
                  {
                    required: true,
                    message: "Please input your password!"
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
                  placeholder="Password"
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
                    placeholder="Username"
                  />
                </Col>
                <Col span={6}>
                  <span id="code" className="mycode" />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="邮箱">
              {getFieldDecorator("email", {
                rules: [
                  {
                    type: "email",
                    message: "The input is not valid E-mail!"
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!"
                  }
                ]
              })(<Input size="large" />)}
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
