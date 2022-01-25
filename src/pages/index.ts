import { lazy } from "react";

export const LoginPage = lazy(() => import("./LoginPage"));
export const FindIdPage = lazy(() => import("./FindIdPage"));
export const ResetPasswordPage = lazy(() => import("./ResetPasswordPage"));
export const SignupPage = lazy(() => import("./SignupPage"));

export const HomePage = lazy(() => import("./HomePage"));
export const OrderCreatePage = lazy(() => import("./OrderCreatePage"));
export const OrderListPage = lazy(() => import("./OrderListPage"));
export const WarehousingCreatePage = lazy(() => import("./WarehousingCreatePage"));
export const WarehousingListPage = lazy(() => import("./WarehousingListPage"));
export const AdjustmentCreatePage = lazy(() => import("./AdjustmentCreatePage"));
export const AdjustmentListPage = lazy(() => import("./AdjustmentListPage"));
export const VendorCreatePage = lazy(() => import("./VendorCreatePage"));
export const VendorListPage = lazy(() => import("./VendorListPage"));
export const MyAccountPage = lazy(() => import("./MyAccountPage"));
export const MyCompanyPage = lazy(() => import("./MyCompanyPage"));
export const MyStorePage = lazy(() => import("./MyStorePage"));
