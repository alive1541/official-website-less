import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Link from "next/link";
import Router from "next/router";
import initReactFastclick from "react-fastclick";
import { Form, Icon, Input, Button, Row, Col, message } from "antd";
import initVarifyCode from "../assets/initVarifyCode.js";
import { login, getUserInfo, activeVip, websiteBalance } from "../service";
import {
  getCookie,
  setCookie,
  ifLogined,
  getLanguageFromStorage
} from "../assets/utils";
import md5 from "js-md5";
import root from "../components/root";
import { injectIntl, FormattedMessage } from "react-intl";
import intl from "../components/intl";

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
    // ifFromIndexPage: false
  };

  componentDidMount() {
    const input = this.refs["inputCode"].input;
    initVarifyCode(input, this);
    this.checkLogin();
    // this.setPageOrigin();
  }

  checkLogin() {
    if (ifLogined()) {
      window.location.href = "/index";
    }
  }

  // setPageOrigin() {
  //   try {
  //     const query = window.location.search.slice(1);
  //     const { ifFromIndexPage } = qs.parse(query);
  //     if (ifFromIndexPage === "true") {
  //       this.setState({ ifFromIndexPage: true });
  //     } else {
  //       this.setState({ ifFromIndexPage: false });
  //     }
  //   } catch (e) {}
  // }

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
              setCookie(response.data);
              //移除expireDate
              localStorage.removeItem("expireDate");
              this.getUserInfoFn();
            } else if (response.code === 1004) {
              // Router.push({
              //   pathname: "/index"
              // });
            } else {
              message.info(response.msg);
            }
          })
          .catch(error => {
            message.error(this.props.intl.messages["info9_11"]);
          });
      }
    });
  };

  getUserInfoFn = async () => {
    const result = await getUserInfo();
    if (result.code === 2000) {
      this.handleDate(result.data.expire_date);
    } else {
      message.info(result.msg);
    }
  };

  handleDate(date) {
    if (date) {
      const dateBar = new Date() - new Date(date);
      if (dateBar > 0) {
        const expireDate = { type: "overTime", date };
        this.setStorage(expireDate);
        this.gotoIndex();
      } else {
        const expireDate = {
          type: "atTime",
          date: Math.floor(-Number(dateBar) / 1000 / 60 / 60 / 24)
        };
        this.setStorage(expireDate);
        //如果是会员没到期，请求额外信息
        this.getWebsiteBalance();
        this.gotoIndex();
      }
    } else {
      //刚注册的用户
      this.purchase();
    }
  }

  purchase() {
    if (ifLogined()) {
      activeVip()
        .then(response => {
          if (response.code === 2000) {
            message.info(this.props.intl.messages["content6_12"]);
            setTimeout(() => {
              window.location.href = `http://123.56.11.198:8990/#/page/getMoney?token=${getCookie()}&language=${getLanguageFromStorage()}&isNewUser=true`;
            }, 2000);
          } else {
            message.error(response.msg);
          }
        })
        .catch(e => {
          message.error(e);
          this.gotoIndex();
        });
    } else {
      message.info("activeVip失败");
      this.gotoIndex();
    }
  }

  getWebsiteBalance = async () => {
    const result = await websiteBalance();
    if (result.errorCode === 0) {
      const data = result.data;
      //data没有数据说明这个用户没有注册过网站，这类用户是新用户
      if (data.length === 0) {
        localStorage.setItem("isNewUser", "true");
      } else {
        localStorage.setItem("isNewUser", "false");
      }
    } else {
      message.info(result.msg);
    }
  };

  gotoIndex() {
    window.location.href = "/index";
    // if (this.state.ifFromIndexPage) {
    //   // Router.push({
    //   //   pathname: "/index",
    //   //   hash: "#target-id"
    //   // });
    //   //使用next路由移动端会定位不准
    //   window.location.href = "/index#target-id";
    // } else {
    //   //使用next路由移动端会定位不准
    //   window.location.href = "/index";
    //   // Router.push({
    //   //   pathname: "/index"
    //   // });
    // }
  }

  setStorage(expireDate) {
    localStorage.setItem("expireDate", JSON.stringify(expireDate));
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
