import React from "react";
import { Provider } from "react-redux";
import initReactFastclick from "react-fastclick";
import configureStore from "../store/store";
import { getHistoryData } from "../service";
import { setTableKey, getClientWidth } from "../assets/utils";

export const store = configureStore();

function root(WrapedComponent) {
  return class extends React.Component {
    static async getInitialProps({ req }) {
      const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
      let isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
      if (isMobile) {
        initReactFastclick();
      }

      if (req && req.url === "/subscribe") {
        try {
          const historyData = await getHistoryData({ page_no: 1 });
          if (historyData.code === 2000) {
            return { isMobile, historyData: setTableKey(historyData.data) };
          } else {
            return { isMobile };
          }
        } catch (e) {
          console.log("e==", e);
          return { isMobile };
        }
      }

      return { isMobile };
    }

    state = {
      isMobile: this.props.isMobile
    };

    componentDidMount() {
      this.reSetIsMobile();

      window.addEventListener("resize", () => {
        this.reSetIsMobile();
      });

      // try {
      //   const VConsole = require("../node_modules/vconsole/dist/vconsole.min");
      //   new VConsole();
      // } catch (e) {
      //   console.log("-------e------", e);
      // }
    }
    reSetIsMobile() {
      const isMobileLayOut = getClientWidth() < 1024;
      if (isMobileLayOut) {
        this.setState({ isMobile: true });
      } else {
        this.setState({ isMobile: false });
      }
    }

    render() {
      // console.log("root", this.props);
      const { historyData } = this.props;
      const { isMobile } = this.state;
      return (
        <Provider store={store}>
          <WrapedComponent isMobile={isMobile} historyData={historyData} />
        </Provider>
      );
    }
  };
}

export default root;
