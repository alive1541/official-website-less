import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";

import "../style/orderService.less";
import { Button } from "antd";

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
        <Head title="OrderService" />
        <Nav isMobile={isMobile} pathName="orderService" />
        <div className="order-wraper">
          <div>
            <div className="order-info">
              <div className="order-title">套利下单服务是什么？</div>
              <div className="order-content">
                您不需要自己买服务器，自己下单。系统将全权为您代理，抓住机会，实时下单。套利下单服务能节省您的时间并为您带来更多更稳定的收入。
              </div>
              <div className="order-title">和套利机会订阅相比有什么好处</div>
              <ol>
                <li className="order-content">
                  您无需时刻盯着电脑自主进行下单，使用了我们的套利下单服务以后，系统会登录您的账户，为您下单。
                </li>
                <li className="order-content">
                  您可以在手机端实时查看系统下单情况，随时上下线自己的账户，并查看实时盈利情况。
                </li>
                <li className="order-content">
                  最最重要的是，系统下单比人工快，我们知道赔率变化是很快的，系统下单能捕捉到最好时刻的赔率，为您赚取最多的钱。同事避免由于赔率变化造成的损失。
                </li>
              </ol>
              <div className="order-title">套利下单服务是什么？</div>
              <div className="order-content">
                您不需要自己买服务器，自己下单。系统将全权为您代理，抓住机会，实时下单。套利下单服务能节省您的时间并为您带来更多更稳定的收入。
              </div>
            </div>
            <div className="order-phone-img">
              <img src="/static/img/phone.png" />
            </div>
          </div>
          <div className="order-middle-info">功能还在开发中，敬请期待!</div>
          <div className="order-product-info">
            <div className="order-product-info-item">
              <p className="order-product-info-money">1个月起定</p>
              <p className="order-product-info-money">89元/月</p>
              <div className="order-product-info-try">首月试用仅需XX元</div>
              <Button type="primary">
                <a href="/concatUs">点击咨询</a>
              </Button>
            </div>
            <div className="order-product-info-item">
              <p className="order-product-info-money">1个月起定</p>
              <p className="order-product-info-money">89元/月</p>
              <div className="order-product-info-try">首月试用仅需XX元</div>
              <Button type="primary">
                <a href="/concatUs">点击咨询</a>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
