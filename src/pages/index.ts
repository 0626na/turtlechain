import { lazy } from "react";

export const LoginPage = lazy(() => import("./user/login"));
export const FindIdPage = lazy(() => import("./user/find-id"));
export const ResetPasswordPage = lazy(() => import("./user/reset-password"));
export const SignupPage = lazy(() => import("./user/signup"));
export const MembershipInfoPage = lazy(() => import("./user/membership-info"));

export const HomePage = lazy(() => import("./home"));
export const OrderCreatePage = lazy(() => import("./order/create"));
export const OrderListPage = lazy(() => import("./order/list"));
export const SampleReturnCreatePage = lazy(() => import("./sample-return/create"));
export const SampleReturnListPage = lazy(() => import("./sample-return/list"));
export const WarehousingCreatePage = lazy(() => import("./warehousing/create"));
export const WarehousingListPage = lazy(() => import("./warehousing/list"));
export const AdjustmentCreatePage = lazy(() => import("./adjustment/create"));
export const AdjustmentListPage = lazy(() => import("./adjustment/list"));
export const ClearingCreatePage = lazy(() => import("./clearing/create"));
export const ClearingListPage = lazy(() => import("./clearing/list"));
export const ClearingBalancePage = lazy(() => import("./clearing/balance"));
export const ProductCreatePage = lazy(() => import("./product/create"));
export const ProductListPage = lazy(() => import("./product/list"));
export const VendorCreatePage = lazy(() => import("./vendor/create"));
export const VendorListPage = lazy(() => import("./vendor/list"));

export const MyAccountPage = lazy(() => import("./settings/account"));
export const MyCompanyPage = lazy(() => import("./settings/company"));
export const MyStorePage = lazy(() => import("./settings/store"));
export const MyStaffPage = lazy(() => import("./settings/staff"));
export const MyMembershipPage = lazy(() => import("./settings/membership"));
