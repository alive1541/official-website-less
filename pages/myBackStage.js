import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import Link from "next/link";
import { Radio, Table, Button, message, Modal, Checkbox, Icon } from "antd";
import { getHistoryData, activeVip } from "../service";
import { ifLogined, setTableKey } from "../assets/utils";

import "../style/myBackstage.less";

export default class Service extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  constructor(props) {
    super(props);
    this.state = {
      mode: 2,
      userState: 1
    };
  }

  render() {
    const { isMobile } = this.props;
    const { mode, userState } = this.state;
    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} pathName="myBackStage" />
        <div className="backstage-wraper">
          {mode === 1 && (
            <div className="backstage-info">
              您还没有登录，不能查看此页面，请点击登录，若您还没有账号，请点击注册按钮注册。
              <Button className="backstage-btn" type="primary">
                <Link href={{ pathname: "/login" }}>登陆</Link>
              </Button>
              <Button className="backstage-btn" type="primary">
                <Link href={{ pathname: "/sign" }}>注册</Link>
              </Button>
            </div>
          )}
          {mode === 2 && (
            <div className="backstage-flex">
              <div className="backstage-img">
                <img src="/static/img/phone.png" />
              </div>
              {userState === 1 && (
                <div className="backStage-phone-content">
                  <p className="backStage-phone-title">
                    新用户您好，您当前还不是会员，点击购买按钮成为会员，新用户首期0元哟
                  </p>
                  <div className="backstage-product-info">
                    <div className="backstage-product-info-item">
                      <p className="backstage-product-info-money">1个月起定</p>
                      <p className="backstage-product-info-money">89元/月</p>
                      <div className="backstage-product-info-try">
                        首月试用仅需0元
                      </div>
                      <Button type="primary">
                        <a href="/index#target">点击咨询</a>
                      </Button>
                    </div>
                    <div className="backstage-product-info-item">
                      <p className="backstage-product-info-money">12个月起定</p>
                      <p className="backstage-product-info-money">50元/月</p>
                      <div className="backstage-product-info-try">
                        首月试用仅需0元
                      </div>
                      <Button type="primary">
                        <a href="/index#target">点击咨询</a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {userState === 2 && (
                <div className="backStage-phone-content">
                  <div className="backstage-product-info">
                    <div className="backstage-product-info-item-2">
                      <p className="backstage-product-info-money">1个月起定</p>
                      <p className="backstage-product-info-money">89元/月</p>
                      <div
                        className="backstage-product-info-try"
                        style={{ fontSize: "13px" }}
                      >
                        您的会员已于2019-08-09到期 您可以点击继续续费
                      </div>
                      <Button type="primary">
                        <a href="/index#target">点击续费</a>
                      </Button>
                    </div>
                    <div className="backstage-product-info-item-2">
                      <p className="backstage-product-info-money">12个月起定</p>
                      <p className="backstage-product-info-money">50元/月</p>
                      <div
                        className="backstage-product-info-try"
                        style={{ fontSize: "13px" }}
                      >
                        您的会员已于2019-08-09到期 您可以点击继续续费
                      </div>
                      <Button type="primary">
                        <a href="/index#target">点击续费</a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}
