import React from "react";
import "./style/footer.less";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer className="footer">
        <div className="footer-wraper">
          <div className="footer-content">
            <div className="footer-content-item">
              COPYRIGHT 2017 - 2020 Opportech Limited &nbsp;&nbsp; |
              &nbsp;&nbsp; ALL RIGHTS RESERVED
            </div>
            <div className="footer-content-item">
              EMAIL &nbsp; &nbsp;Opportech.service@gmail.com
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
