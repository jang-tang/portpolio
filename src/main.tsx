import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 배포하고 싶으면 푸시하고, npm run deploy 하면 됨. (배포 후에는 npm run build 해서 build 폴더를 확인해보면 됨.)