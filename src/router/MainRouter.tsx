import { Switch, Route, Redirect } from "react-router-dom";
import {
  HomePage,
  OrderCreatePage,
  OrderListPage,
  WarehousingCreatePage,
  WarehousingListPage,
  AdjustmentCreatePage,
  AdjustmentListPage,
  ProductCreatePage,
  ProductListPage,
  VendorCreatePage,
  VendorListPage,
  MyAccountPage,
  MyCompanyPage,
  MyStorePage,
} from "pages";

const MainRouter = function () {
  return (
    <Switch>
      {/*
      <Route exact path="/home" component={HomePage} />
       */}
      <Route exact path="/order/create" component={OrderCreatePage} />
      <Route exact path="/order/list" component={OrderListPage} />
      <Route exact path="/warehousing/create" component={WarehousingCreatePage} />
      <Route exact path="/warehousing/list" component={WarehousingListPage} />
      <Route exact path="/adjustment/create" component={AdjustmentCreatePage} />
      <Route exact path="/adjustment/list" component={AdjustmentListPage} />
      <Route exact path="/product/create" component={ProductCreatePage} />
      <Route exact path="/product/list" component={ProductListPage} />
      <Route exact path="/vendor/create" component={VendorCreatePage} />
      <Route exact path="/vendor/list" component={VendorListPage} />
      <Route exact path="/my/account" component={MyAccountPage} />
      <Route exact path="/my/company" component={MyCompanyPage} />
      <Route exact path="/my/store" component={MyStorePage} />
      <Redirect path="*" to="/home" />
    </Switch>
  );
};

export default MainRouter;
