import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import { Form, Icon, Input, Button, Row, Col, message } from "antd";
import { algorithm } from "../assets/calculatorWidgets";
import Router from "next/router";

import "../style/calculator.less";

class Calculator extends React.Component {
  state = {
    P1_top: "",
    P1_bottom: "",
    P2_top: "",
    P2_bottom: "",
    game_time: "",
    play_type_name: "",
    M1_top: "",
    M1_bottom: "",
    M2_top: "",
    M2_bottom: "",
    Y1_top: 0,
    Y1_bottom: 0,
    Y2_top: 0,
    Y2_bottom: 0,
    L_min_top: 0,
    L_min_bottom: 0,
    L_max_top: 0,
    L_max_bottom: 0,
    M_top: "",
    M_bottom: "",
    R_top: 0,
    R_bottom: 0,
    S: ""
  };

  reset = type => {
    if (type === "top") {
      this.setState({
        P1_top: "",
        P2_top: "",
        M1_top: "",
        M2_top: "",
        Y1_top: 0,
        Y2_top: 0,
        L_min_top: 0,
        L_max_top: 0,
        M_top: "",
        R_top: 0
      });
    } else if (type === "bottom") {
      this.setState({
        P1_bottom: "",
        P2_bottom: "",
        M1_bottom: "",
        M2_bottom: "",
        Y1_bottom: 0,
        Y2_bottom: 0,
        L_min_bottom: 0,
        L_max_bottom: 0,
        M_bottom: "",
        R_bottom: 0,
        S: 0
      });
    }
  };

  componentDidMount() {
    const query = Router.router.query;
    this.setState({
      P1_top: query.first_obbs || "",
      P2_top: query.second_obbs || "",
      game_time: query.game_time || "",
      play_type_name: query.play_type_name || ""
    });
  }

  renderTable = type => {
    const { state } = this;
    return (
      <table width="100%">
        <thead>
          <tr>
            <th>下注项目</th>
            <th>赔率</th>
            <th>下单金额</th>
            <th>赢后返还</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A队</td>
            <td>
              <Input
                onChange={e => this.inputChange(e, `P1_${type}`)}
                value={state[`P1_${type}`]}
              />
            </td>
            <td>
              <Input
                onChange={e => this.inputChange(e, `M1_${type}`)}
                value={state[`M1_${type}`]}
              />
            </td>
            <td>{state[`Y1_${type}`]}</td>
          </tr>
          <tr>
            <td>B队</td>
            <td>
              <Input
                onChange={e => this.inputChange(e, `P2_${type}`)}
                value={state[`P2_${type}`]}
              />
            </td>
            <td>
              <Input
                onChange={e => this.inputChange(e, `M2_${type}`)}
                value={state[`M2_${type}`]}
              />
            </td>
            <td>{state[`Y2_${type}`]}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  calculate = () => {
    algorithm(this, message);
  };

  inputChange = (e, key) => {
    const value = e.target.value;
    if (Number.isNaN(Number(value))) {
      return message.info("请输入数字");
    }
    if (key === "R_bottom") {
      this.setState({
        S: 0
      });
    } else if (key === "S") {
      this.setState({
        R_bottom: 0
      });
    }
    this.setState({
      [key]: value
    });
  };

  render() {
    const { isMobile } = this.props;
    const {
      game_time,
      play_type_name,
      L_max_top,
      L_min_top,
      L_min_bottom,
      L_max_bottom,
      M_top,
      M_bottom,
      R_top,
      R_bottom,
      S
    } = this.state;

    const topInfo = ` 所有下注金都将取整计算 利润：${L_min_top} 到${L_max_top} （利润${R_top}%)`;
    const bottomInfo = ` 所有下注金都将取整计算 利润：${L_min_bottom} 到${L_max_bottom} （利润${R_bottom}%)`;

    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} />
        <div className="calculator-wraper">
          <div className="calculator-item">
            <div className="calculator-left">
              <div className="header">打水计算器</div>
              <div className="header2">{`${game_time} ${play_type_name}`}</div>
              {this.renderTable("top")}
              <div className="profit" title={topInfo}>
                <span>{topInfo}</span>
              </div>
              <div className="footer">
                <span>下注的本金</span>
                <Input
                  onChange={e => this.inputChange(e, `M_top`)}
                  value={M_top}
                />
                <div>
                  <Button onClick={() => this.reset("top")} type="danger">
                    清空
                  </Button>
                  <Button type="primary" onClick={this.calculate}>
                    计算
                  </Button>
                </div>
              </div>
            </div>
            <div className="calculator-right">
              <div className="header">计算器使用规则</div>
              <div className="content">第一种方法</div>
              <div className="content">
                填写您想要下注的本金和所有下注项目赔率后
              </div>
              <div className="content">第二种方法</div>
              <div className="content">
                填写某个项目的下单金额和所有下注项目赔率
              </div>
            </div>
          </div>
          <div className="calculator-item" style={{ height: "340px" }}>
            <div className="calculator-left">
              <div className="header">止损计算器</div>
              {this.renderTable("bottom")}
              <div className="get-profit">
                预期利润&nbsp;&nbsp;&nbsp;
                <Input
                  onChange={e => this.inputChange(e, "R_bottom")}
                  value={String(R_bottom) === "0" ? "" : R_bottom}
                />{" "}
                %
              </div>
              <div className="get-profit">
                获取的收益
                <Input
                  onChange={e => this.inputChange(e, "S")}
                  value={String(S) === "0" ? "" : S}
                />
              </div>
              <div className="profit" title={bottomInfo}>
                <span>{bottomInfo}</span>
              </div>
              <div className="footer">
                <span>下注的本金</span>
                <Input
                  onChange={e => this.inputChange(e, `M_bottom`)}
                  value={M_bottom}
                />
                <div>
                  <Button onClick={() => this.reset("bottom")} type="danger">
                    清空
                  </Button>
                  <Button onClick={this.calculate} type="primary">
                    计算
                  </Button>
                </div>
              </div>
            </div>
            <div className="calculator-right">
              <div className="header">止损计算器使用规则</div>
              <div className="content">第一种方法</div>
              <div className="content">
                填写已下注队的赔率和下单金额及预期利润（可以是负数）（预期利润按最大损失最小收益计算）
              </div>
              <div className="content">第二种方法</div>
              <div className="content">
                填写已下注队的赔率和下单金额及获取的收益（可以是负数）（收益按最大损失最小收益计算）
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Calculator;
