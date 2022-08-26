import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '@layout/main';
import { HomePage } from './pages';

function App() {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        {/* <Route index element={<LoginPage />} />
        <Route path="/find-id" element={<FindIdPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/membership-info" element={<MembershipInfoPage />} />
        <Route path="*" element={<NotFoundPage />} /> */}

        <Route path="/" element={<MainLayout />}>
          {/*
           * 메인
           */}

          <Route
            index
            element={
              <Suspense fallback={<></>}>
                <HomePage />
              </Suspense>
            }
          />

          {/*
           * 거래처/상품
           */}

          {/* 
          <Route
            path="vendor/create"
            element={
              <Suspense fallback={<></>}>
                <VendorCreatePage />
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
          */}

          {/*
           * 발주
           */}

          {/* <Route
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
          /> */}

          {/*
           * 입고
           */}

          {/* <Route
            path="warehousing/create"
            element={
              <Suspense fallback={<></>}>
                <WarehousingCreatePage />
              </Suspense>
            }
          />
        </Route> 

          <Route
            path="warehousing/history"
            element={
              <Suspense fallback={<></>}>
                <WarehousingHistoryPage />
              </Suspense>
            }
          />
        </Route> 

          <Route
            path="warehousing/adjustment"
            element={
              <Suspense fallback={<></>}>
                <WarehousingCreatePage />
              </Suspense>
            }
          />
        </Route> */}

          {/*
           * 결제
           */}

          {/* <Route
            path="clearing/create"
            element={
              <Suspense fallback={<></>}>
                <ClearingCreatePage />
              </Suspense>
            }
          />
        </Route> 

          <Route
            path="clearing/history"
            element={
              <Suspense fallback={<></>}>
                <ClearingHistoryPage />
              </Suspense>
            }
          />
        </Route> 

          <Route
            path="clearing/trade"
            element={
              <Suspense fallback={<></>}>
                <ClearingTradePage />
              </Suspense>
            }
          />
        </Route> */}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
