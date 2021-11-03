import ReactDOM from "react-dom";
import Router from "router";
import { RecoilRoot } from "recoil";
import "antd/dist/antd.css";

ReactDOM.render(
  <RecoilRoot>
    <Router />
  </RecoilRoot>,
  document.getElementById("root")
);
