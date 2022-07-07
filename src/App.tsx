import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '@layout/main';
import {
  AdjustmentCreatePage,
  AdjustmentListPage,
  ClearingBalancePage,
  ClearingCreatePage,
  ClearingListPage,
  CompanyManagementPage,
  FindIdPage,
  HomePage,
  LoginPage,
  MembershipInfoPage,
  MembershipManagementPage,
  MistransferCreatePage,
  MistransferListPage,
  NotFoundPage,
  ProductCreatePage,
  ProductListPage,
  ResetPasswordPage,
  SignupPage,
  StaffManagementPage,
  StoreManagementPage,
  UserManagementPage,
  VendorCreatePage,
  VendorListPage,
  WarehousingCreatePage,
  WarehousingListPage,
} from './pages';

function App() {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/membership-info" element={<MembershipInfoPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route element={<MainLayout />}>
          <Route
            path="/home"
            element={
              <Suspense fallback={<></>}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/warehousing/create"
            element={
              <Suspense fallback={<></>}>
                <WarehousingCreatePage />
              </Suspense>
            }
          />
          <Route
            path="/warehousing/list"
            element={
              <Suspense fallback={<></>}>
                <WarehousingListPage />
              </Suspense>
            }
          />
          <Route
            path="/adjustment/create"
            element={
              <Suspense fallback={<></>}>
                <AdjustmentCreatePage />
              </Suspense>
            }
          />
          <Route
            path="/adjustment/list"
            element={
              <Suspense fallback={<></>}>
                <AdjustmentListPage />
              </Suspense>
            }
          />
          <Route
            path="/clearing/create"
            element={
              <Suspense fallback={<></>}>
                <ClearingCreatePage />
              </Suspense>
            }
          />
          <Route
            path="/clearing/list"
            element={
              <Suspense fallback={<></>}>
                <ClearingListPage />
              </Suspense>
            }
          />
          <Route
            path="/clearing/balance"
            element={
              <Suspense fallback={<></>}>
                <ClearingBalancePage />
              </Suspense>
            }
          />
          <Route
            path="/mistransfer/create"
            element={
              <Suspense fallback={<></>}>
                <MistransferCreatePage />
              </Suspense>
            }
          />
          <Route
            path="/mistransfer/list"
            element={
              <Suspense fallback={<></>}>
                <MistransferListPage />
              </Suspense>
            }
          />
          <Route
            path="/product/create"
            element={
              <Suspense fallback={<></>}>
                <ProductCreatePage />
              </Suspense>
            }
          />
          <Route
            path="/product/list"
            element={
              <Suspense fallback={<></>}>
                <ProductListPage />
              </Suspense>
            }
          />
          <Route
            path="/vendor/create"
            element={
              <Suspense fallback={<></>}>
                <VendorCreatePage />
              </Suspense>
            }
          />
          <Route
            path="/vendor/list"
            element={
              <Suspense fallback={<></>}>
                <VendorListPage />
              </Suspense>
            }
          />
          <Route
            path="/setting/user"
            element={
              <Suspense fallback={<></>}>
                <UserManagementPage />
              </Suspense>
            }
          />
          <Route
            path="/setting/company"
            element={
              <Suspense fallback={<></>}>
                <CompanyManagementPage />
              </Suspense>
            }
          />
          <Route
            path="/setting/store"
            element={
              <Suspense fallback={<></>}>
                <StoreManagementPage />
              </Suspense>
            }
          />
          <Route
            path="/setting/staff"
            element={
              <Suspense fallback={<></>}>
                <StaffManagementPage />
              </Suspense>
            }
          />
          <Route
            path="/setting/membership"
            element={
              <Suspense fallback={<></>}>
                <MembershipManagementPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
