import { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LoginPage } from "pages";

const Router = function () {
  return (
    <BrowserRouter>
      <Switch>
        <Suspense fallback="로딩중...">
          <Route path="/login" component={LoginPage} />
        </Suspense>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
