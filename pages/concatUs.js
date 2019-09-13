import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import { Input, Button, message } from "antd";
import { msgSubmit } from "../service";
const { TextArea } = Input;
import intl from "../components/intl";
import { FormattedMessage, injectIntl } from "react-intl";
import root from "../components/root";

import "../style/concatUs.less";

class ConcatUs extends React.Component {
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
      return message.info(_this.props.intl.messages["info7_2"]);
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
    const {
      isMobile,
      intl: { messages }
    } = this.props;
    const { mail, msg } = this.state;
    return (
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
            placeholder={messages["info7_1"]}
          />
          <Input
            value={mail}
            onChange={e => this.handleInputChange("mail", e)}
            className="contract-your-email"
            size="large"
            placeholder={messages["content7_3"]}
          />
          <Button type="primary" block onClick={this.handleClick}>
            <FormattedMessage id="content7_4" />
          </Button>
        </div>
      </div>
    );
  }
}

export default root(intl(injectIntl(ConcatUs)));
