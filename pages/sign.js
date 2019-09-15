import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Link from "next/link";
import { Form, Icon, Input, Button, Row, Col, message } from "antd";
import initVarifyCode from "../assets/initVarifyCode.js";
import { sign, login, getUserInfo, activeVip } from "../service";
import {
  getCookie,
  setCookie,
  ifLogined,
  getLanguageFromStorage
} from "../assets/utils";
import Router from "next/router";
import md5 from "js-md5";
import root from "../components/root";
import { FormattedMessage, injectIntl } from "react-intl";
import intl from "../components/intl";
import { commonPoint } from "../assets/buryingPoint";

import "../style/sign.less";

class Sign extends React.Component {
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  //   const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
  //   if (isMobile) {
  //     initReactFastclick();
  //   }
  //   return { isMobile };
  // }

  state = {
    confirmDirty: false,
    varifyCode: false
  };

  componentDidMount() {
    const input = this.refs["inputCode"].input;
    initVarifyCode(input, this);
    commonPoint("common", "注册页pv");
  }

  ifAccessVarify = () => {
    if (this.state.varifyCode) {
      return true;
    } else {
      message.error(this.props.intl.messages["info9_10"]);
      return false;
    }
  };

  async autoLogin(user_name, password) {
    await this.login(user_name, password);
  }

  async login(user_name, password) {
    const response = await login({
      user_name,
      password
    });

    if (response.code === 2000) {
      setCookie(response.data);
      //移除expireDate
      localStorage.removeItem("expireDate");
      this.getUserInfoFn();
    } else {
      message.info(result.msg);
      window.location.href = "/login";
    }
  }

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
        this.setState({ expireDate });
      } else {
        const expireDate = {
          type: "atTime",
          date: Math.floor(-Number(dateBar) / 1000 / 60 / 60 / 24)
        };
        this.setStorage(expireDate);
        this.setState({
          expireDate
        });
        //如果是会员没到期，请求额外信息
        this.getWebsiteBalance();
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
            window.location.href = "/index";
          }
        })
        .catch(e => {
          message.error(e);
          window.location.href = "/index";
        });
    } else {
      message.info("activeVip失败");
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

  handleSubmit = e => {
    setTimeout(() => {
      commonPoint("click", "注册按钮", "sign-button");
    }, 0);
    e.preventDefault();
    if (!this.ifAccessVarify()) return;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const password = md5(values.password);
        sign({
          user_name: values.user_name,
          password,
          mail: values.user_name
        })
          .then(response => {
            if (response.code === 2000) {
              this.autoLogin(values.user_name, password);
              // Router.push({
              //   pathname: "/login",
              //   query: {
              //     user_name: values.user_name,
              //     mail: values.mail
              //   }
              // });
            } else {
              message.error(response.msg);
            }
          })
          .catch(error => {
            message.error(this.props.intl.messages["info9_11"]);
          });
      } else {
        message.info(err);
      }
    });
  };

  // compareToFirstPassword = (rule, value, callback) => {
  //   const form = this.props.form;
  //   if (value && value !== form.getFieldValue("password")) {
  //     callback(this.props.intl.messages["info10_16"]);
  //   } else {
  //     callback();
  //   }
  // };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const {
      isMobile,
      intl: { messages }
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Head title={messages["nav6"]} />
        <Nav isMobile={isMobile} />
        <div className="sign-wraper">
          <p className="sign-title">
            <FormattedMessage id="nav6" />
          </p>
          <Form onSubmit={e => this.handleSubmit(e)} className="login-form">
            <Form.Item>
              {getFieldDecorator("user_name", {
                rules: [
                  {
                    type: "email",
                    message: messages["info10_9"]
                  },
                  { max: 20, message: messages["info9_3"] },
                  { min: 4, message: messages["info10_13"] },
                  {
                    required: true,
                    message: messages["info9_1"]
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  size="large"
                  placeholder={messages["info10_6"]}
                />
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("password", {
                rules: [
                  {
                    required: true,
                    message: messages["info9_2"]
                  },
                  {
                    validator: this.validateToNextPassword
                  },
                  { max: 20, message: messages["info9_4"] },
                  { min: 4, message: messages["info10_15"] }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  size="large"
                  placeholder={messages["info10_7"]}
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
                className="sign-form-button"
              >
                <FormattedMessage id="content10_3" />
              </Button>
              <FormattedMessage id="content10_4" />
              <Link href={{ pathname: "/login" }}>
                <a style={{ margin: "5px 10px" }}>
                  <FormattedMessage id="content10_5" />
                </a>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "sign" })(
  intl(injectIntl(Sign))
);
const RootCom = root(WrappedRegistrationForm);
export default RootCom;
