import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import initReactFastclick from "react-fastclick";
import Link from "next/link";
import { Form, Icon, Input, Button, Row, Col, message } from "antd";
import initVarifyCode from "../assets/initVarifyCode.js";
import { sign } from "../service";
import Router from "next/router";
import md5 from "js-md5";
import root from "../components/root";
import { FormattedMessage, injectIntl } from "react-intl";
import intl from "../components/intl";

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
            message.error(this.props.intl.messages["info9_11"]);
          });
      } else {
        message.info(err);
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback(this.props.intl.messages["info10_16"]);
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
            <Form.Item label={<FormattedMessage id="content10_6" />}>
              {getFieldDecorator("user_name", {
                rules: [
                  { required: true, message: messages["info9_1"] },
                  { max: 20, message: messages["info9_3"] },
                  { min: 4, message: messages["info10_13"] },
                  {
                    validator: (rule, value, callback) => {
                      if (!/^[0-9a-zA-Z]*$/.test(value)) {
                        callback(true);
                      } else {
                        callback();
                      }
                    },
                    message: messages["info10_14"]
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
            <Form.Item label={messages["content9_2"]}>
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
                  placeholder={messages["info10_6"]}
                />
              )}
            </Form.Item>
            <Form.Item label={messages["content10_1"]}>
              {getFieldDecorator("confirm", {
                rules: [
                  {
                    required: true,
                    message: messages["info10_7"]
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
                  placeholder={messages["info10_7"]}
                />
              )}
            </Form.Item>
            <Form.Item label={messages["content9_3"]}>
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
                    placeholder={messages["info9_5"]}
                  />
                </Col>
                <Col span={6}>
                  <span id="code" className="mycode" />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label={messages["content10_2"]}>
              {getFieldDecorator("mail", {
                rules: [
                  {
                    type: "email",
                    message: messages["info10_9"]
                  },
                  {
                    required: true,
                    message: messages["info10_8"]
                  }
                ]
              })(<Input size="large" placeholder={messages["info10_8"]} />)}
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
