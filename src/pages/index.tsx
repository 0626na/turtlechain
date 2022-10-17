import { lazy } from 'react';

export const LoginPage = lazy(() => import('./auth/login'));
export const NewPage = lazy(() => import('./auth/registration/new'));
export const RetailerPage = lazy(() => import('./auth/registration/retailer'));
export const PickerPage = lazy(() => import('./auth/registration/picker'));
// export const CompletedPage = lazy(
//   () => import('./auth/registration/completed'),
// );

export const FindIdPage = lazy(() => import('./auth/find-id'));
export const ResetPasswordPage = lazy(() => import('./auth/reset-password'));
export const NotFoundPage = lazy(() => import('./notFound'));
export const MembershipInfoPage = lazy(() => import('./auth/membership-info'));

// 쇼핑몰Page
export const HomePage = lazy(() => import('./home'));
export const VendorCreatePage = lazy(() => import('./vendor/create'));
export const VendorHistoryPage = lazy(() => import('./vendor/history'));
export const ProductCreatePage = lazy(() => import('./product/create'));
export const ProductHistoryPage = lazy(() => import('./product/history'));
export const OrderCreatePage = lazy(() => import('./order/create'));
export const OrderHistoryPage = lazy(() => import('./order/history'));
export const WarehousingCreatePage = lazy(() => import('./warehousing/create'));
export const WarehousingHistoryPage = lazy(
  () => import('./warehousing/history'),
);
export const WarehousingAdjustmentPage = lazy(
  () => import('./warehousing/adjustment'),
);
export const ClearingCreatePage = lazy(() => import('./clearing/create'));
export const ClearingHistoryPage = lazy(() => import('./clearing/history'));
export const ClearingBalancePage = lazy(() => import('./clearing/balance'));
export const SettingPage = lazy(() => import('./setting'));
// export const TutorialPage = lazy(() => import('./tutorial'));

// 사입자Page
export const PickerOrderCreatePage = lazy(() => import('./pickerOrder/create'));
export const PickerOrderHistoryPage = lazy(
  () => import('./pickerOrder/history'),
);
export const PickerVendorPage = lazy(() => import('./pickerVendor'));
export const PickerSettingPage = lazy(() => import('./pickerSetting'));
