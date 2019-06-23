import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Input, Button, message } from "antd";
import { msgSubmit } from "../service";
const { TextArea } = Input;

import "../style/concatUs.less";

export default class ConcatUs extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  state = {
    mail: "",
    msg: ""
  };

  handleInputChange = (key, e) => {
    const val = e.target.value;
    this.setState({
      [key]: val
    });
  };

  handleClick = () => {
    const _this = this;
    const { mail, msg } = this.state;
    msgSubmit({ mail, msg })
      .then(function(response) {
        if (response.code === 2000) {
          message.info(response.msg);
          _this.resetState();
        } else {
          message.error(response.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  resetState = () => {
    this.setState({
      mail: "",
      msg: ""
    });
  };

  render() {
    const { isMobile } = this.props;
    const { mail, msg } = this.state;
    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} pathName="concatUs" />
        <div className="contract-wraper">
          <h2 className="contract-email">我们的邮箱：18810552193@163.com</h2>
          <h2 className="contract-info">提交意见反馈并留下您的联系方式</h2>
          <TextArea
            value={msg}
            onChange={e => this.handleInputChange("msg", e)}
            autosize={{ minRows: 6, maxRows: 10 }}
          />
          <Input
            value={mail}
            onChange={e => this.handleInputChange("mail", e)}
            className="contract-your-email"
            size="large"
            placeholder="留下您的邮箱"
          />
          <Button type="primary" block onClick={this.handleClick}>
            提交
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
}
