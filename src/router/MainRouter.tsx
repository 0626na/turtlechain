import { Switch, Route, Redirect } from "react-router-dom";
import {
  HomePage,
  WarehousingListPage,
  WarehousingCreatePage,
  AdjustmentListPage,
  MyAccountPage,
  MyCompanyPage,
  MyStorePage,
} from "pages";

const MainRouter = function () {
  return (
    <Switch>
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/warehousing/list" component={WarehousingListPage} />
      <Route exact path="/warehousing/create" component={WarehousingCreatePage} />
      <Route exact path="/adjustment/list" component={AdjustmentListPage} />
      <Route exact path="/my/account" component={MyAccountPage} />
      <Route exact path="/my/company" component={MyCompanyPage} />
      <Route exact path="/my/store" component={MyStorePage} />
      <Redirect path="*" to="/home" />
    </Switch>
  );
};

export default MainRouter;
