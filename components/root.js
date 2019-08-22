import React from "react";
import { Provider } from "react-redux";
import initReactFastclick from "react-fastclick";
import configureStore from "../store/store";
import { getHistoryData } from "../service";
import { setTableKey } from "../assets/utils";

const store = configureStore();

function root(WrapedComponent) {
  return class extends React.Component {
    static async getInitialProps({ req }) {
      const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
      const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
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

    componentDidMount() {
      // try {
      //   const VConsole = require("../node_modules/vconsole/dist/vconsole.min");
      //   new VConsole();
      // } catch (e) {
      //   console.log("-------e------", e);
      // }
    }

    render() {
      // console.log("root", this.props);
      const { isMobile, historyData } = this.props;
      return (
        <Provider store={store}>
          <WrapedComponent isMobile={isMobile} historyData={historyData} />
        </Provider>
      );
    }
  };
}

export default root;
