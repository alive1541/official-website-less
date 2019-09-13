import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Link from "next/link";
import Router from "next/router";
import initReactFastclick from "react-fastclick";
import { Form, Icon, Input, Button, Row, Col, message } from "antd";
import initVarifyCode from "../assets/initVarifyCode.js";
import { login } from "../service";
import { setCookie } from "../assets/utils";
import md5 from "js-md5";
import root from "../components/root";
import { injectIntl, FormattedMessage } from "react-intl";
import intl from "../components/intl";
import qs from "qs";

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
    varifyCode: false,
    ifFromIndexPage: false
  };

  componentDidMount() {
    const input = this.refs["inputCode"].input;
    initVarifyCode(input, this);
    this.setPageOrigin();
  }

  setPageOrigin() {
    try {
      const query = window.location.search.slice(1);
      const { ifFromIndexPage } = qs.parse(query);
      if (ifFromIndexPage === "true") {
        this.setState({ ifFromIndexPage: true });
      } else {
        this.setState({ ifFromIndexPage: false });
      }
    } catch (e) {}
  }

  ifAccessVarify = () => {
    if (this.state.varifyCode) {
      return true;
    } else {
      message.error(this.props.intl.messages["info9_10"]);
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
          .then(response => {
            if (response.code === 2000) {
              message.info(response.msg);
              setCookie(response.data);
              //移除expireDate
              localStorage.removeItem("expireDate");
              this.gotoIndex();
            } else if (response.code === 1004) {
              // Router.push({
              //   pathname: "/index"
              // });
            } else {
              message.info(response.msg);
            }
          })
          .catch(error => {
            console.log(error);
            message.error(this.props.intl.messages["info9_11"]);
          });
      }
    });
  };

  gotoIndex() {
    if (this.state.ifFromIndexPage) {
      // Router.push({
      //   pathname: "/index",
      //   hash: "#target-id"
      // });
      //使用next路由移动端会定位不准
      window.location.href = "/index#target-id";
    } else {
      //使用next路由移动端会定位不准
      window.location.href = "/index";
      // Router.push({
      //   pathname: "/index"
      // });
    }
  }

  render() {
    const {
      isMobile,
      intl: { messages }
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Head title={messages["nav5"]} />
        <Nav isMobile={isMobile} />
        <div className="login-wraper">
          <p className="login-title">
            <FormattedMessage id="nav5" />
          </p>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("user_name", {
                rules: [
                  { required: true, message: messages["info9_1"] },
                  {
                    type: "email",
                    message: messages["info10_9"]
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  size="large"
                  placeholder={messages["info9_3"]}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: messages["info9_2"] }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  size="large"
                  placeholder={messages["info9_4"]}
                />
              )}
            </Form.Item>
            <Form.Item>
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
                    placeholder={messages["content9_3"]}
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
                <FormattedMessage id="content9_4" />
              </Button>
              <FormattedMessage id="content9_5" />
              <Link href={{ pathname: "/sign" }}>
                <a style={{ margin: "5px 10px" }}>
                  <FormattedMessage id="content9_6" />
                </a>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "normal_login" })(
  intl(injectIntl(Login))
);
const RootCom = root(WrappedRegistrationForm);
export default RootCom;
