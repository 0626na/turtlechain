import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '@layout/main';
import { HomePage } from './pages';

function App() {
  return (
    <Suspense fallback={<></>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <Suspense fallback={<></>}>
                <HomePage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
