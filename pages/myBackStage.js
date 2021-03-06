import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Link from "next/link";
import { Button, message } from "antd";
import { ifLogined, getCookie, getLanguageFromStorage } from "../assets/utils";
import intl from "../components/intl";
import { FormattedMessage } from "react-intl";
import root from "../components/root";
import getConfig from "next/config";
const {
  publicRuntimeConfig: { cdnPath }
} = getConfig();

import "../style/myBackStage.less";

class MyBackStage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //atTime 未过期 ， overTime 过期  null 新用户
      expireDate: null
    };
  }

  componentDidMount() {
    this.checkStorage();
  }

  checkStorage() {
    try {
      const expireDate = JSON.parse(localStorage.getItem("expireDate"));
      // if (ifLogined() && expireDate && expireDate.type === "atTime") {
      //   this.refGo();
      //   // location.href = `http://123.56.11.198:8990/#/page/account?token=${getCookie()}&language=${getLanguageFromStorage()}`
      // }
      this.setState({ expireDate: expireDate });
    } catch (e) {
      console.log("--e--", e);
      // message.error("JSON解析出错");
    }
  }

  // refGo() {
  //   location.href = `http://123.56.11.198:8990/#/page/account?token=${getCookie()}&language=${getLanguageFromStorage()}`;
  // }

  render() {
    const { isMobile } = this.props;
    const { expireDate } = this.state;
    const logined = ifLogined();
    return (
      <div>
        <Head title="我的后台" />
        <Nav isMobile={isMobile} pathName="myBackStage" />
        <div className="backstage-wraper">
          {!logined && (
            <div className="backstage-info">
              <FormattedMessage id="content8_1" />
              <Button className="backstage-btn" type="primary">
                <Link href={{ pathname: "/login" }}>
                  <a>
                    <FormattedMessage id="nav5" />
                  </a>
                </Link>
              </Button>
              <Button className="backstage-btn" type="primary">
                <Link href={{ pathname: "/sign" }}>
                  <a>
                    <FormattedMessage id="nav6" />
                  </a>
                </Link>
              </Button>
            </div>
          )}
          {logined && (
            <div className="backstage-flex">
              <div className="backstage-img">
                <img src={`${cdnPath}/static/img/phone.png`} />
              </div>
              {expireDate === null && (
                <div className="backStage-phone-content">
                  <p className="backStage-phone-title">
                    <FormattedMessage id="content8_2" />
                  </p>
                  <div className="backstage-product-info">
                    <div className="backstage-product-info-item">
                      <p className="backstage-product-info-money">
                        <FormattedMessage id="content6_2" />
                      </p>
                      <p className="backstage-product-info-money">
                        <FormattedMessage id="content6_3" />
                      </p>
                      <div className="backstage-product-info-try">
                        <FormattedMessage id="content6_4" />
                      </div>
                      <Button type="primary">
                        <a href="/index#target">
                          <FormattedMessage id="content6_11" />
                        </a>
                      </Button>
                    </div>
                    <div className="backstage-product-info-item">
                      <p className="backstage-product-info-money">
                        <FormattedMessage id="content6_5" />
                      </p>
                      <p className="backstage-product-info-money">
                        <FormattedMessage id="content6_6" />
                      </p>
                      <div className="backstage-product-info-try">
                        <FormattedMessage id="content6_4" />
                      </div>
                      <Button type="primary">
                        <FormattedMessage id="content6_11" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {expireDate && expireDate.type === "overTime" && (
                <div className="backStage-phone-content">
                  <div className="backstage-product-info">
                    <div className="backstage-product-info-item-2">
                      <p className="backstage-product-info-money">
                        <FormattedMessage id="content6_2" />
                      </p>
                      <p className="backstage-product-info-money">
                        <FormattedMessage id="content6_3" />
                      </p>
                      <div
                        className="backstage-product-info-try"
                        style={{ fontSize: "13px" }}
                      >
                        <FormattedMessage id="content6_7" />
                        {expireDate.date}
                        <FormattedMessage id="content6_10" />
                      </div>
                      <Button type="primary">
                        <a href="/index#target">
                          <FormattedMessage id="content6_10" />
                        </a>
                      </Button>
                    </div>
                    <div className="backstage-product-info-item-2">
                      <p className="backstage-product-info-money">
                        <FormattedMessage id="content6_5" />
                      </p>
                      <p className="backstage-product-info-money">
                        <FormattedMessage id="content6_6" />
                      </p>
                      <div
                        className="backstage-product-info-try"
                        style={{ fontSize: "13px" }}
                      >
                        <FormattedMessage id="content6_7" />
                        {expireDate.date}
                        <FormattedMessage id="content6_10" />
                      </div>
                      <Button type="primary">
                        <a href="/index#target">
                          <FormattedMessage id="content6_10" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default root(intl(MyBackStage));
