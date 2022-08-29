import { lazy } from 'react';

export const LoginPage = lazy(() => import('./auth/login'));

export const HomePage = lazy(() => import('./home'));

export const VendorCreatePage = lazy(() => import('./vendor/create'));
export const ProductCreatePage = lazy(() => import('./product/create'));

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
export const ClearingTradePage = lazy(() => import('./clearing/trade'));

export const SettingPage = lazy(() => import('./setting'));
export const TutorialPage = lazy(() => import('./tutorial'));

export const NotFoundPage = lazy(() => import('./notFound'));
