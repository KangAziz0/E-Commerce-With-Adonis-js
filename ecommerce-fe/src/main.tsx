import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/global.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import App from "@/App";
import { store } from "@/store/store";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found in index.html");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
