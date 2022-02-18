import { Switch, Route, Redirect } from "react-router-dom";
import {
  HomePage,
  OrderCreatePage,
  OrderListPage,
  SampleReturnCreatePage,
  SampleReturnListPage,
  WarehousingCreatePage,
  WarehousingListPage,
  AdjustmentCreatePage,
  AdjustmentListPage,
  ClearingCreatePage,
  ClearingListPage,
  ProductCreatePage,
  ProductListPage,
  VendorCreatePage,
  VendorListPage,
  MyAccountPage,
  MyCompanyPage,
  MyStorePage,
  MyStaffPage,
  MyMembershipPage,
} from "pages";

const MainRouter = function () {
  return (
    <Switch>
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/order/create" component={OrderCreatePage} />
      <Route exact path="/order/list" component={OrderListPage} />
      <Route exact path="/sample_return/create" component={SampleReturnCreatePage} />
      <Route exact path="/sample_return/list" component={SampleReturnListPage} />
      <Route exact path="/warehousing/create" component={WarehousingCreatePage} />
      <Route exact path="/warehousing/list" component={WarehousingListPage} />
      <Route exact path="/adjustment/create" component={AdjustmentCreatePage} />
      <Route exact path="/adjustment/list" component={AdjustmentListPage} />
      <Route exact path="/clearing/create" component={ClearingCreatePage} />
      <Route exact path="/clearing/list" component={ClearingListPage} />
      <Route exact path="/product/create" component={ProductCreatePage} />
      <Route exact path="/product/list" component={ProductListPage} />
      <Route exact path="/vendor/create" component={VendorCreatePage} />
      <Route exact path="/vendor/list" component={VendorListPage} />
      <Route exact path="/my/account" component={MyAccountPage} />
      <Route exact path="/my/company" component={MyCompanyPage} />
      <Route exact path="/my/store" component={MyStorePage} />
      <Route exact path="/my/staff" component={MyStaffPage} />
      <Route exact path="/my/membership" component={MyMembershipPage} />
      <Redirect path="*" to="/home" />
    </Switch>
  );
};

export default MainRouter;
