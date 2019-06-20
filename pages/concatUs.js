import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Input } from "antd";
const { TextArea } = Input;

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
        <div className="wraper">
          <p>我们的邮箱：18810552193@163.com</p>
          <p>提交意见反馈并留下您的联系方式</p>
          <TextArea autosize={{ minRows: 2, maxRows: 6 }} />
          <Input placeholder="留下您的邮箱" />
        </div>
        <Footer />
      </div>
    );
  }
}
