import React from "react";
import { Switch, Breadcrumb, Icon, message } from "antd";
import { Table, NoHeaderTable } from "./table";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Router from "next/router";

import "../style/interest.less";

export default class Interest extends React.Component {
  static getDerivedStateFromProps(props) {
    const { data } = props;
    return { data };
  }
  state = {};
  handleClickDelete = item => {
    // const data = this.state.data;
    // data.splice(index, 1);
    // this.setState({});
    this.props.deleteInterestItem(item);
  };
  render() {
    const { data } = this.state;
    return (
      <div className="interest-wrap">
        <div className="interest-header">我感兴趣的利润盘列表</div>
        <div className="interest-tab">
          <Switch defaultChecked onChange={this.props.keepActiveChange} />
          <span className="interest-list-title">赔率变化时更新列表</span>
        </div>
        <div className="interest-content">
          {data.map((item, index) => {
            return (
              <Content
                key={index}
                data={item}
                index={index}
                handleClickDelete={() => this.handleClickDelete(item)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

class Content extends React.Component {
  onCopy = (value, ifScuccess) => {
    if (ifScuccess) {
      message.info(`"${value}"已经复制到剪贴板`);
    }
  };
  handleClickMobile = () => {
    const {
      first_obbs,
      second_obbs,
      game_time,
      play_type_name
    } = this.props.data;
    Router.push({
      pathname: "/calculator",
      query: {
        first_obbs,
        second_obbs,
        game_time,
        play_type_name
      }
    });
  };

  render() {
    const { data, handleClickDelete, index } = this.props;
    const dataSource1 = [
      {
        date: data.game_time.split(" ")[0],
        website_name: data.first_website_name,
        plate_name: data.first_plate_name
      },
      {
        date: data.game_time.split(" ")[1],
        website_name: data.second_website_name,
        plate_name: data.second_plate_name
      }
    ];
    const dataSource2 = [
      {
        website: data.first_website,
        obbs: data.first_obbs,
        amount: data.first_amount,
        win_return: data.first_win_return,
        profit: data.first_profit,
        place_bet_url: data.first_place_bet_url
      },
      {
        website: data.second_website,
        obbs: data.second_obbs,
        amount: data.second_amount,
        win_return: data.second_win_return,
        profit: data.second_profit,
        place_bet_url: data.second_place_bet_url
      }
    ];
    const columns1 = [
      {
        dataIndex: "date",
        key: "date"
      },
      {
        dataIndex: "website_name",
        key: "website_name",
        render: text => (
          <div>
            {text}
            <CopyToClipboard text={text} onCopy={this.onCopy}>
              <Icon type="copy" theme="twoTone" style={{ cursor: "pointer" }} />
            </CopyToClipboard>
          </div>
        )
      },
      {
        dataIndex: "plate_name",
        key: "plate_name"
      }
    ];
    return (
      <div className="item-wrap">
        <div className="header">
          <Breadcrumb separator=">>">
            <Breadcrumb.Item>{data.game_type_name}</Breadcrumb.Item>
            <Breadcrumb.Item>{data.game_name}</Breadcrumb.Item>
          </Breadcrumb>
          <Icon
            className="x"
            type="close"
            onClick={() => handleClickDelete(index)}
          />
        </div>
        <div className="header2">
          <Breadcrumb separator=">>">
            <Breadcrumb.Item>{data.play_type_name}</Breadcrumb.Item>
            {/* <Breadcrumb.Item>亚洲让球盘</Breadcrumb.Item> */}
          </Breadcrumb>
          <span className="pankou">盘口</span>
        </div>
        <div className="inner-content">
          <NoHeaderTable data={dataSource1} columns={columns1} />
          <div className="inner-icon">
            <Icon
              type="calculator"
              theme="twoTone"
              onClick={this.handleClickMobile}
            />
            <Icon
              type="minus"
              style={{ color: "rgb(24, 144, 255)" }}
              onClick={() => handleClickDelete(index)}
            />
          </div>
          <Table data={dataSource2} columns={columns2} />
          <div className="footer1">
            <span>最后更新时间：23:45:12</span>
            <span>利润 20.7%</span>
          </div>
          <div className="footer2">
            <span>总额：1000</span>
            <span>利润：680 到 1076</span>
          </div>
        </div>
      </div>
    );
  }
}

const columns2 = [
  {
    title: "网站",
    dataIndex: "website",
    key: "website",
    render: (text, record) => {
      return (
        <a title={text} href={record.place_bet_url}>
          {text}
        </a>
      );
    }
  },
  {
    title: "投注金额(赔率)",
    dataIndex: "obbs",
    key: "obbs",
    render: (text, record) => {
      const re = `${text}(${record.amount})`;
      return <div title={re}>{re}</div>;
    }
  },
  {
    title: "赢后返还",
    dataIndex: "win_return",
    key: "win_return"
  },
  {
    title: "利润",
    dataIndex: "profit",
    key: "profit"
  }
];
