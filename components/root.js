import React from "react";
import { Provider } from "react-redux";
import configureStore from "../store/store";

const store = configureStore();

// class Root extends React.Component {
//   componentDidMount() {}

//   render() {
//     return (
//       <Provider store={store}>
//         <Intl />
//       </Provider>
//     );
//   }
// }

function root(WrapedComponent) {
  return class extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <WrapedComponent />
        </Provider>
      );
    }
  };
}

export default root;
