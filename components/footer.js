import React from "react";
import "./style/footer.less";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer>
        <div className="footer-wraper">这个是footer</div>
      </footer>
    );
  }
}
