import { MainLayout } from "layouts/main";
import { Suspense } from "react";
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
  ClearingBalancePage,
  ProductCreatePage,
  ProductListPage,
  VendorCreatePage,
  VendorListPage,
  AccountManagementPage,
  BizManagementPage,
  StoreManagementPage,
  StaffManagementPage,
  MembershipManagementPage,
  MistransferListPage,
  MistransferCreatePage,
} from "../pages";

function MainRouter() {
  return (
    <MainLayout>
      <Suspense fallback="loading">
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
          <Route exact path="/clearing/balance" component={ClearingBalancePage} />
          <Route exact path="/mistransfer/create" component={MistransferCreatePage} />
          <Route exact path="/mistransfer/list" component={MistransferListPage} />
          <Route exact path="/product/create" component={ProductCreatePage} />
          <Route exact path="/product/list" component={ProductListPage} />
          <Route exact path="/vendor/create" component={VendorCreatePage} />
          <Route exact path="/vendor/list" component={VendorListPage} />
          <Route exact path="/setting/account" component={AccountManagementPage} />
          <Route exact path="/setting/biz" component={BizManagementPage} />
          <Route exact path="/setting/store" component={StoreManagementPage} />
          <Route exact path="/setting/staff" component={StaffManagementPage} />
          <Route exact path="/setting/membership" component={MembershipManagementPage} />
          <Redirect path="*" to="/home" />
        </Switch>
      </Suspense>
    </MainLayout>
  );
}

export default MainRouter;
