import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Radio, Table, Button, message, Modal, Checkbox, Icon } from "antd";
import { getHistoryData, activeVip } from "../service";
import { ifLogined, setTableKey } from "../assets/utils";

import "../style/subscribe.less";

export default class Service extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    try {
      const historyData = await getHistoryData({ page_no: 1 });
      if (historyData.code === 2000) {
        return { isMobile, historyData: setTableKey(historyData.data) };
      } else {
        return { isMobile, historyData: [] };
      }
    } catch (e) {
      console.log("e==", e);
      return { isMobile, historyData: [] };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      mode: "history",
      data: props.historyData.list,
      total: props.historyData.total_num
    };
  }

  getHistoryData = (page_no = 1) => {
    const _this = this;
    getHistoryData({
      page_no
    })
      .then(function(response) {
        if (response.code === 2000) {
          _this.setState({
            total: response.data.total_num,
            data: setTableKey(response.data).list
          });
        } else {
          message.info(response.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
        message.error("服务器开小差了，请稍后再试");
      });
  };

  pageChange = val => {
    const { current, total } = val;
    this.setState({ total });
    this.getHistoryData(current);
  };

  render() {
    const { isMobile } = this.props;
    const { mode, data, total } = this.state;
    const ifHasBorder = isMobile ? true : false;

    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} pathName="subscribe" />

        <div className="subscribe-wraper">
          <div className="subscribe-tab">历史套利机会</div>
          {mode === "history" && (
            <Table
              bordered={ifHasBorder}
              onChange={this.pageChange}
              columns={columns}
              dataSource={data}
              pagination={{ defaultCurrent: 1, total }}
            />
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

const columns = [
  {
    title: "机会",
    dataIndex: "oppertunity",
    key: "oppertunity",
    render: (text, row, index) => {
      const { game_time, game_teams } = row;
      return (
        <div>
          <div>{game_time}</div>
          <div>{game_teams}</div>
        </div>
      );
    }
  },
  {
    title: "网站1",
    dataIndex: "first_website",
    key: "first_website",
    render: (text, row, index) => {
      if (row.first_place_bet_url) {
        return (
          <a href={row.first_place_bet_url} target="_blank">
            {text}
          </a>
        );
      } else {
        return text;
      }
    }
  },
  {
    title: "方向",
    dataIndex: "fangxiang",
    key: "fangxiang",
    render: (text, row, index) => {
      const { first_choice, play_type } = row;
      let book = {};
      if (play_type == 2) {
        book = {
          left: "大",
          right: "小"
        };
      } else {
        book = {
          left: "主",
          right: "客"
        };
      }
      return <div>{book[first_choice]}</div>;
    }
  },
  {
    title: "建议购买金额(赔率)",
    dataIndex: "first_amount",
    key: "first_amount",
    render: (text, row, index) => {
      const { first_amount, first_obbs } = row;
      return (
        <div>
          <div>{first_amount}</div>
          <div>{`(${first_obbs})`}</div>
        </div>
      );
    }
  },
  {
    title: "网站2",
    dataIndex: "second_website",
    key: "second_website",
    render: (text, row, index) => {
      if (row.second_place_bet_url) {
        return (
          <a href={row.second_place_bet_url} target="_blank">
            {text}
          </a>
        );
      } else {
        return text;
      }
    }
  },
  {
    title: "方向",
    dataIndex: "second_choice",
    key: "second_choice",
    render: (text, row, index) => {
      const { second_choice, play_type } = row;
      let book = {};
      if (play_type == 2) {
        book = {
          left: "大",
          right: "小"
        };
      } else {
        book = {
          left: "主",
          right: "客"
        };
      }
      return <div>{book[second_choice]}</div>;
    }
  },
  {
    title: "建议购买金额(赔率)",
    dataIndex: "second_obbs",
    key: "second_obbs",
    render: (text, row, index) => {
      const { second_amount, second_obbs } = row;
      return (
        <div>
          <div>{second_amount}</div>
          <div>{`(${second_obbs})`}</div>
        </div>
      );
    }
  },
  {
    title: "预计最小收益",
    dataIndex: "expected_min_profit",
    key: "expected_min_profit"
  }
];
