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
            <div>
              COPYRIGHT 2017 - 2020 CLAROBET AB &nbsp;&nbsp; | &nbsp;&nbsp; ALL
              RIGHTS RESERVED
            </div>
            <div>EMAIL &nbsp; &nbsp;*******@*****</div>
          </div>
        </div>
      </footer>
    );
  }
}
