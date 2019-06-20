import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Input, Button } from "antd";
const { TextArea } = Input;

import "../style/concatUs.less";

export default class Home extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  render() {
    const { isMobile } = this.props;
    return (
      <div>
        <Head title="ConcatUs" />
        <Nav isMobile={isMobile} pathName="concatUs" />
        <div className="contract-wraper">
          <h2 className="contract-email">我们的邮箱：18810552193@163.com</h2>
          <h2 className="contract-info">提交意见反馈并留下您的联系方式</h2>
          <TextArea autosize={{ minRows: 6, maxRows: 10 }} />
          <Input
            className="contract-your-email"
            size="large"
            placeholder="留下您的邮箱"
          />
          <Button type="primary" block>
            提交
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
}
