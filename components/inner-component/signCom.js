import React from "react";

import {
  Form,
  Icon,
  Input,
  Button,
  Row,
  Col,
  message,
  Modal,
  Select
} from "antd";
import { commonPoint } from "../../assets/buryingPoint";
import intl from "../intl";
import { sign, login, getUserInfo, activeVip } from "../../service";
import {
  getCookie,
  setCookie,
  ifLogined,
  getLanguageFromStorage
} from "../../assets/utils";
import { FormattedMessage, injectIntl } from "react-intl";
import initVarifyCode from "../../assets/initVarifyCode.js";
import md5 from "js-md5";
const { Option } = Select;

import "../style/signCom.less";

class Sign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      varifyCode: false,
      purchaseVisible: false
    };
  }

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

  noticeNative() {
    try {
      window.tytlnative.registerSuccessfull();
    } catch (e) {
      console.log(e);
    }
  }

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

  setStorage(expireDate) {
    localStorage.setItem("expireDate", JSON.stringify(expireDate));
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
            this.setState({ purchaseVisible: true });
            setTimeout(() => {
              window.location.href = `http://123.56.11.198:8990/#/page/getMoney?token=${getCookie()}&language=${getLanguageFromStorage()}&isNewUser=true`;
            }, 5000);
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
          mail: values.user_name,
          phone_prefix: "+62",
          phone: values.phone
        })
          .then(response => {
            if (response.code === 2000) {
              this.noticeNative();
              this.autoLogin(values.user_name, password);
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { purchaseVisible } = this.state;
    const {
      title,
      footer,
      intl: { messages }
    } = this.props;
    return (
      <>
        <div className="sign-wraper">
          <p className="sign-title">{title}</p>
          <Form onSubmit={e => this.handleSubmit(e)} className="login-form">
            <Form.Item>
              {getFieldDecorator("user_name", {
                rules: [
                  {
                    type: "email",
                    message: messages["info10_9"]
                  },
                  { max: 100, message: messages["info10_9"] },
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
                  // {
                  //   validator: this.validateToNextPassword
                  // },
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
              {getFieldDecorator("phone", {
                rules: [
                  {
                    required: true,
                    message: messages["info9_12"]
                  },
                  {
                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                    message: messages["info9_13"]
                  }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  size="large"
                  placeholder={messages["info9_12"]}
                />
              )}
            </Form.Item>

            <Form.Item>
              <Row type="flex" justify="space-between">
                <Col span={13}>
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
                <Col span={7}>
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
              {footer || null}
            </Form.Item>
          </Form>
        </div>
        {
          <Modal
            visible={purchaseVisible}
            footer={false}
            onCancel={() => this.setState({ purchaseVisible: false })}
          >
            <p className="index-purcharse-success-title">
              <FormattedMessage id="title77" />
            </p>
            <p className="index-purcharse-success-content">
              <FormattedMessage id="content77_1" />
            </p>
          </Modal>
        }
      </>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: "sign" })(
  intl(injectIntl(Sign))
);

export default WrappedRegistrationForm;
