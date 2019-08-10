import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Carousel, Button, Modal, message } from "antd";
import Link from "next/link";
import { activeVip, getUserInfo } from "../service";
import { getCookie } from "../assets/utils";

import "../style/index.less";

export default class Home extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  href = `http://123.56.11.198:8990/#/page/account?token=${getCookie()}`;

  state = {
    purchaseVisible: false,
    timerNum: 10,
    expireDate: null
  };

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const result = await getUserInfo();
    if (result.code === 2000) {
      this.handleDate(result.data.expire_date);
    } else {
      message.info(result.msg);
    }
  };

  handleDate(date) {
    date = "2019-10-1";
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
      }
    } else {
      this.setState({ expireDate: null });
    }
  }

  setStorage(expireDate) {
    localStorage.setItem("expireDate", JSON.stringify(expireDate));
  }

  // checkStorage() {
  //   try {
  //     const expireDate = JSON.parse(localStorage.getItem("expireDate"));
  //     if (expireDate) {
  //       this.setState({ expireDate });
  //     }
  //   } catch (e) {
  //     message.error("JSON解析出错");
  //   }
  // }

  purchase = () => {
    activeVip()
      .then(response => {
        if (response.code === 2000) {
          this.setState({ purchaseVisible: true });
          this.setTimer();
        } else {
          message.error(response.msg);
        }
      })
      .catch(e => {
        message.error(e);
      });
  };

  setTimer = () => {
    const { timerNum } = this.state;
    if (timerNum <= 0) {
      return (window.location.href = this.href);
    }
    setTimeout(() => {
      this.setState({ timerNum: timerNum - 1 });
      this.setTimer();
    }, 1000);
  };

  render() {
    const { isMobile } = this.props;
    const { purchaseVisible, timerNum, expireDate } = this.state;
    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} pathName="index" />
        <div className="index-wraper">
          <h1>什么是体育套利</h1>
          <p className="content">
            <strong>体育套利</strong>
            是通过搜集各个博彩公司平台的赔率数据并作分析从而找出赔率中
            <strong>无风险的方案</strong>。
          </p>
          <p className="content">
            因为大量的玩家在不同的平台进行，所以操盘手根据自己的受注情况会调整赔率,同时不同操盘手会对比赛做出不同判断从而开出有差异的赔率，此类盘口我们称之为利润盘。根据上下盘赔率相加大于2的赔率在不同公司下注上盘和下盘
            从而达到无论上下盘哪个结果胜出我们都有一定百分比的获利。
          </p>
          <p className="content">
            举个简单的例子，甲乙两队比赛，网站1给出这场比赛甲队赢的赔率是2.2
            ，网站2给出这场比赛乙队赢的赔率是1.9。此时你就可以现在网站1下单买甲队赢，下注86元，同时在网站2下单买乙队赢，下单100元。此时你的成本是186元。如果甲队赢了，你将获得189.2元，你的利润是3.2元；如果乙队赢了，你将获得190，你的利润是4元。也就是说无论哪一队获胜你都将获得至少3.2元的利润
          </p>
          <h1>投资回报有多高？风险有多大</h1>
          <p className="content">
            按历史下单数据保守估计，年化可以达到100%以上 ，点击
            <Link href={{ pathname: "/subscribe" }}>
              <a>
                <u>查看历史套利机会</u>
              </a>
            </Link>
          </p>

          <h1>既然这个能赚钱，为什么不自己投资</h1>
          <p className="content">
            由于账号不能无限次下单，所以不能无限大的投入本金。所以我们将机会分享给更多的人，让更多的人来通过体育套利赚钱。
          </p>

          <h1>为什么要选择你们的体育套利产品</h1>
          <div className="content">
            <div className="index-phone-content">
              <p>
                1、我们的产品可以系统自动下单，手机管理，无需时刻盯着电脑屏幕。
              </p>
              <p>2、高达100%以上的年化收益。</p>
              <p>3、首月服务费全免，您可以免费尝试。</p>
              <p>4、便捷完善的手机后台管理。</p>
            </div>
            <div className="index-phone-img">
              <img src="/static/img/phone.png" />
            </div>
          </div>

          <h1>有哪些成功的例子吗</h1>
          <div className="content">
            {!isMobile && (
              <Carousel autoplay>
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      投入10,000的 Tatag Yuli Eko：
                      <br />
                      “我是来自印度尼西亚的Tatag Yuli
                      Eko，我在2018年8月开始使用该产品投入10,000元，随着熟练掌握，我已经可以稳定的获得每月1500左右的利润，这个产品非常棒，希望你们能一直做下去”
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart1.png" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      投入50,000的汉泰：
                      <br />
                      “我是真的赚了这么多钱啊！太感谢了！真的希望你们能越做越好！”
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart2.png" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      投入35,000的Meng Lahge：
                      <br />
                      “一开始的利润并不高，当然那也是比股市债券强的，当我能够熟练的操作之后，我发现我赚的越来越多了。我还会继续用下去的”
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart2.png" />
                    </div>
                  </div>
                </div>
              </Carousel>
            )}
            {isMobile && (
              <div className="index-carousel-wraper">
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      投入10,000的 Tatag Yuli Eko：
                      <br />
                      “我是来自印度尼西亚的Tatag Yuli
                      Eko，我在2018年8月开始使用该产品投入10,000元，随着熟练掌握，我已经可以稳定的获得每月1500左右的利润，这个产品非常棒，希望你们能一直做下去”
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart1.png" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      投入50,000的汉泰：
                      <br />
                      “我是真的赚了这么多钱啊！太感谢了！真的希望你们能越做越好！”
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart2.png" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      投入35,000的Meng Lahge：
                      <br />
                      “一开始的利润并不高，当然那也是比股市债券强的，当我能够熟练的操作之后，我发现我赚的越来越多了。我还会继续用下去的”
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart2.png" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <h1 id="target">怎么才能参与到体育套利中呢</h1>
          {expireDate === null && (
            <p className="content">
              订阅我们的产品，即可成为会员，立即开始体育套利，现在还有首月免费的活动
            </p>
          )}

          <div className="content">
            <div className="index-product-info">
              <div className="index-product-info-item">
                <p className="index-product-info-money">1个月起定</p>
                <p className="index-product-info-money">89元/月</p>
                <Info expireDate={expireDate} />
              </div>
              {/* <div className="index-product-info-item">
                <p className="index-product-info-money">12个月起定</p>
                <p className="index-product-info-money">50元/月</p>
                <Info expireDate={expireDate} />
              </div> */}
            </div>
          </div>
        </div>
        {
          <Modal visible={purchaseVisible} closable={false} footer={false}>
            <div className="index-modal">
              <p className="index-modal-title">
                恭喜您购买成功 会员有效期至2020-08-06
              </p>
              <p className="index-modal-content">
                系统还有{timerNum}s跳转至您的理财后台，点击这里迅速跳转，
                理财后台的账号密码与您的官网注册密码一致
              </p>
              <a href={this.href}>理财后台网址：123.56.11.198:8990/#/</a>
            </div>
          </Modal>
        }
        <Footer />
      </div>
    );
  }
}

function Info(props, ctx) {
  const { expireDate } = props;
  return (
    <>
      {expireDate === null && (
        <div className="index-product-info-try">首月试用仅需0元</div>
      )}
      {expireDate && expireDate.type === "atTime" && (
        <div style={{ color: "black", fontWeight: 600 }}>
          您的会员还有{expireDate.date}天到期 您可以点击续费续费
        </div>
      )}
      {expireDate && expireDate.type === "overTime" && (
        <div style={{ color: "black", fontWeight: 600 }}>
          您的会员已于{expireDate.date}到期您可以点击继续续费
        </div>
      )}
      <Button type="primary" onClick={ctx.purchase}>
        {expireDate === null && "点击购买"}
        {expireDate && "点击续费"}
      </Button>
    </>
  );
}
