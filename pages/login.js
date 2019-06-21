import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Form, Icon, Input, Button, Row, Col } from "antd";
import initVarifyCode from "../assets/initVarifyCode.js";

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

  render() {
    const { isMobile } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Head title="login" />
        <Nav isMobile={isMobile} />
        <div className="login-wraper">
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item label="账号/邮箱">
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
                  { required: true, message: "Please input your Password!" }
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
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "normal_login" })(Login);

export default WrappedRegistrationForm;
