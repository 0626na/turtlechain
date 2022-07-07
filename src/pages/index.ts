import { lazy } from 'react';

export const LoginPage = lazy(() => import('./auth/login'));
export const FindIdPage = lazy(() => import('./auth/find-id'));
export const ResetPasswordPage = lazy(() => import('./auth/reset-password'));
export const SignupPage = lazy(() => import('./auth/signup'));
export const MembershipInfoPage = lazy(() => import('./auth/membership-info'));

export const HomePage = lazy(() => import('./home'));
export const OrderCreatePage = lazy(() => import('./order/create'));
export const OrderListPage = lazy(() => import('./order/list'));
export const SampleReturnCreatePage = lazy(
  () => import('./sample-return/create'),
);
export const SampleReturnListPage = lazy(() => import('./sample-return/list'));
export const WarehousingCreatePage = lazy(() => import('./warehousing/create'));
export const WarehousingListPage = lazy(() => import('./warehousing/list'));
export const AdjustmentCreatePage = lazy(() => import('./adjustment/create'));
export const AdjustmentListPage = lazy(() => import('./adjustment/list'));
export const ClearingCreatePage = lazy(() => import('./clearing/create'));
export const ClearingListPage = lazy(() => import('./clearing/list'));
export const ClearingBalancePage = lazy(() => import('./clearing/balance'));
export const MistransferCreatePage = lazy(() => import('./mistransfer/create'));
export const MistransferListPage = lazy(() => import('./mistransfer/list'));
export const VendorCreatePage = lazy(() => import('./vendor/create'));
export const VendorListPage = lazy(() => import('./vendor/list'));
export const ProductCreatePage = lazy(() => import('./product/create'));
export const ProductListPage = lazy(() => import('./product/list'));

export const UserManagementPage = lazy(() => import('./setting/user'));
export const CompanyManagementPage = lazy(() => import('./setting/company'));
export const StoreManagementPage = lazy(() => import('./setting/store'));
export const StaffManagementPage = lazy(() => import('./setting/staff'));
export const MembershipManagementPage = lazy(
  () => import('./setting/membership'),
);

export const NotFoundPage = lazy(() => import('./notFound'));
