import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Carousel, Button } from "antd";
import Router from "next/router";

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

  render() {
    const { isMobile } = this.props;
    return (
      <div>
        <Head title="KnowledgeBase" />
        <Nav isMobile={isMobile} pathName="index" />
        <div className="index-wraper">
          <h1>什么是体育套利</h1>
          <p className="content">
            <strong>体育套利</strong>
            是通过搜集各个博彩公司平台的赔率数据并作分析从而找出赔率中
            <strong>无风险的方案</strong>
            。因为大量的玩家在不同的平台进行，所以操盘手根据自己的受注情况会调整赔率,同时不同操盘手会对比赛做出不同判断从而开出有差异的赔率，此类盘口我们称之为利润盘。根据上下盘赔率相加大于2的赔率在不同公司下注上盘和下盘从而达到无论上下盘哪个结果胜出我们都有一定百分比的获利。
          </p>
          <p className="content">
            举个简单的例子，甲乙两队比赛，乐天堂给出这场比赛甲队赢的赔率是2.2，平博给出这场比赛乙队赢的赔率是1.9。此时你就可以现在乐天堂下单买甲队赢，下注86元，同时在平博下单买乙队赢，下单100元。此时你的成本是186元。如果甲队赢了，你将获得189.2，你的利润是3.2元；如果乙队赢了，你将获得190，你的利润是4元。也就是说无论哪一队获胜你都将获得至少3.2元的利润
          </p>
          <h1>投资回报有多高？风险有多大</h1>
          <p className="content">
            保守估计，按日均1%来计算，<strong>年化最少可达到365%</strong>
          </p>
          <h1>既然这个能赚钱，为什么不自己投资</h1>
          <p className="content">
            由于大多数博彩网站对单笔下注存在限制，所以不能无限大的投入本金。所以我们将机会分享给更多的人，让更多的人来通过体育套利赚钱。
          </p>
          <h1>为什么要选择你们的体育套利产品</h1>
          <p className="content">
            1、虽然我们在体育套利有1年的经验，但我们已经实现
            <strong>300%</strong>的年化收益
          </p>
          <p className="content">
            2、我们对全球100家博彩网站做甄选，得出所有适合的套利机会。
          </p>
          <p className="content">
            3、我们的套利机会是<strong>免费</strong>的。
          </p>
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
          <h1>怎么才能参与到体育套利中呢</h1>
          <p className="content">
            1、首先你需要注册经常下单的网站。并且保留好自己的账号密码等信息。并在账户里充值，保证机会来的时候可以迅速下单
          </p>
          <p className="content">
            2、然后登录好每个网站，并打开我们网站。当机会刷新的时候，分别在相应的网站找到相应的比赛下单。注意，下单时要检查确认网站比赛和你刷新的比赛赔率等都一致。
          </p>
          <p className="content">3、接下来就是等待比赛结束网站回款了。</p>
          <Button
            className="index-content-btn"
            type="primary"
            size="large"
            onClick={() => {
              Router.push("/concatUs");
            }}
          >
            查看套利机会
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
}
