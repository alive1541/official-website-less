import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import { Radio, Table, Button, message, Modal, Checkbox, Icon } from "antd";
import { getHistoryData } from "../service";
import { ifLogined, setTableKey } from "../assets/utils";
import intl from "../components/intl";
import { FormattedMessage, injectIntl } from "react-intl";
import root from "../components/root";

import "../style/subscribe.less";

class Subscribe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: "history",
      data: [],
      total: 0
    };
  }

  componentDidMount() {
    const { historyData } = this.props;
    if (historyData) {
      this.setState({
        data: historyData.list || [],
        total: historyData.total_num || 0
      });
    } else {
      this.getHistoryData();
    }
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
            data: setTableKey(response.data)
              ? setTableKey(response.data).list
              : []
          });
        } else {
          message.info(response.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
        message.error(this.props.intl.messages("info9_11"));
      });
  };

  pageChange = val => {
    const { current, total } = val;
    this.setState({ total });
    this.getHistoryData(current);
  };

  render() {
    const {
      isMobile,
      intl: { messages }
    } = this.props;
    const { mode, data, total } = this.state;
    const ifHasBorder = isMobile ? true : false;

    const columns = [
      {
        title: messages["content11_1"],
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
        title: messages["content11_2"],
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
        title: messages["content11_7"],
        dataIndex: "fangxiang",
        key: "fangxiang",
        render: (text, row, index) => {
          const { first_choice, play_type } = row;
          let book = {};
          if (play_type == 2) {
            book = {
              left: messages["info11_3"],
              right: messages["info11_4"]
            };
          } else {
            book = {
              left: messages["info11_1"],
              right: messages["info11_2"]
            };
          }
          return <div>{book[first_choice]}</div>;
        }
      },
      {
        title: messages["content11_3"],
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
        title: messages["content11_4"],
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
        title: messages["content11_7"],
        dataIndex: "second_choice",
        key: "second_choice",
        render: (text, row, index) => {
          const { second_choice, play_type } = row;
          let book = {};
          if (play_type == 2) {
            book = {
              left: messages["info11_3"],
              right: messages["info11_4"]
            };
          } else {
            book = {
              left: messages["info11_1"],
              right: messages["info11_2"]
            };
          }
          return <div>{book[second_choice]}</div>;
        }
      },
      {
        title: messages["content11_5"],
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
        title: messages["content11_6"],
        dataIndex: "expected_min_profit",
        key: "expected_min_profit"
      }
    ];

    return (
      <div>
        <Head title="产品介绍" />
        <Nav isMobile={isMobile} pathName="subscribe" />

        <div className="subscribe-wraper">
          <div className="subscribe-tab">
            <FormattedMessage id="nav1" />
          </div>
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
      </div>
    );
  }
}

export default root(intl(injectIntl(Subscribe)));
