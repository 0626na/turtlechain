import { Suspense } from "react";
import { BrowserRouter, Switch } from "react-router-dom";

const Router = function () {
  return (
    <BrowserRouter>
      <Switch>
        <Suspense fallback="로딩중..."></Suspense>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
