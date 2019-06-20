import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";

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
        <Head title="Subscribe" />
        <Nav isMobile={isMobile} pathName="subscribe" />
        <div>sign</div>
        <Footer />
      </div>
    );
  }
}
