import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '@layout/main';
import React from 'react';
import {
  ClearingCreatePage,
  ClearingHistoryPage,
  ClearingTradePage,
  HomePage,
  LoginPage,
  NotFoundPage,
  OrderCreatePage,
  OrderHistoryPage,
  ProductCreatePage,
  ProductHistoryPage,
  SettingPage,
  TutorialPage,
  VendorCreatePage,
  VendorHistoryPage,
  WarehousingCreatePage,
  WarehousingHistoryPage,
  WarehousingAdjustmentPage,
} from './pages';

function App() {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route index element={<LoginPage />} />
        {/* 
        <Route index element={<LoginPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/membership-info" element={<MembershipInfoPage />} />
         */}

        <Route path="*" element={<NotFoundPage />} />

        <Route element={<MainLayout />}>
          {/*
           * 메인
           */}

          <Route
            path="home"
            element={
              <Suspense fallback={<></>}>
                <HomePage />
              </Suspense>
            }
          />

          {/*
           * 거래처/상품
           */}

          <Route
            path="vendor/create"
            element={
              <Suspense fallback={<></>}>
                <VendorCreatePage />
              </Suspense>
            }
          />

          <Route
            path="vendor/history"
            element={
              <Suspense fallback={<></>}>
                <VendorHistoryPage />
              </Suspense>
            }
          />

          <Route
            path="product/create"
            element={
              <Suspense fallback={<></>}>
                <ProductCreatePage />
              </Suspense>
            }
          />

          <Route
            path="product/history"
            element={
              <Suspense fallback={<></>}>
                <ProductHistoryPage />
              </Suspense>
            }
          />

          {/*
           * 발주
           */}

          <Route
            path="order/create"
            element={
              <Suspense fallback={<></>}>
                <OrderCreatePage />
              </Suspense>
            }
          />

          <Route
            path="order/history"
            element={
              <Suspense fallback={<></>}>
                <OrderHistoryPage />
              </Suspense>
            }
          />

          {/*
           * 입고
           */}

          <Route
            path="warehousing/create"
            element={
              <Suspense fallback={<></>}>
                <WarehousingCreatePage />
              </Suspense>
            }
          />

          <Route
            path="warehousing/history"
            element={
              <Suspense fallback={<></>}>
                <WarehousingHistoryPage />
              </Suspense>
            }
          />

          <Route
            path="warehousing/adjustment"
            element={
              <Suspense fallback={<></>}>
                <WarehousingAdjustmentPage />
              </Suspense>
            }
          />

          {/*
           * 결제
           */}

          <Route
            path="clearing/create"
            element={
              <Suspense fallback={<></>}>
                <ClearingCreatePage />
              </Suspense>
            }
          />

          <Route
            path="clearing/history"
            element={
              <Suspense fallback={<></>}>
                <ClearingHistoryPage />
              </Suspense>
            }
          />

          <Route
            path="clearing/trade"
            element={
              <Suspense fallback={<></>}>
                <ClearingTradePage />
              </Suspense>
            }
          />
          {/*
           * 설정
           */}

          <Route
            path="setting"
            element={
              <Suspense fallback={<></>}>
                <SettingPage />
              </Suspense>
            }
          />

          {/*
           * 사용자가이드
           */}

          <Route
            path="tutorial"
            element={
              <Suspense fallback={<></>}>
                <TutorialPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
