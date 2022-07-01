import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const MainLayout = lazy(() => import('@layout/main'));

const LoginPage = lazy(() => import('@pages/auth/login'));

const HomePage = lazy(() => import('@pages/home'));

function App() {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route index element={<LoginPage />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
