import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
// import initReactFastclick from "react-fastclick";
import { Input, Button, message } from "antd";
import { msgSubmit } from "../service";
const { TextArea } = Input;
import Intl from "../components/intl";
import { FormattedMessage, useIntl } from "react-intl";
import root from "../components/root";

import "../style/concatUs.less";

class ConcatUs extends React.Component {
  // static async getInitialProps({ req }) {
  //   const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
  //   const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
  //   if (isMobile) {
  //     initReactFastclick();
  //   }
  //   console.log("------------------isMo -----", isMobile);
  //   return { isMobile: true };
  // }

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
    if (mail.length === 0 || msg.length === 0) {
      return message.info("信息不完整");
    }
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
      <Intl>
        <div>
          <Head title="联系我们" />
          <Nav isMobile={isMobile} pathName="concatUs" />
          <div className="contract-wraper">
            <h2 className="contract-email">
              <FormattedMessage id="content7_1" />
              <br />
              Opportech.service@gmail.com
            </h2>
            <h2 className="contract-info">
              <FormattedMessage id="content7_2" />
            </h2>
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
              // placeholder={FormattedMessage({ id: "content7_3" })}
            />
            <Button type="primary" block onClick={this.handleClick}>
              <FormattedMessage id="content7_4" />
            </Button>
          </div>
          <Footer />
        </div>
      </Intl>
    );
  }
}

export default root(ConcatUs);
