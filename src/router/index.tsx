import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@store/tokenState';
import { useLogin } from '@hooks/index';
import { TOKEN } from '@constant/index';
import LoginRouter from './LoginRouter';
import MainRouter from './MainRouter';

function Router() {
  const login = useLogin();
  const token = useRecoilValue(tokenState);
  const localStorageToken = localStorage.getItem(TOKEN);
  const sessionStorageToken = sessionStorage.getItem(TOKEN);

  useEffect(() => {
    if (localStorageToken) {
      login(localStorageToken);
    }
    if (sessionStorageToken) {
      login(sessionStorageToken);
    }
  });

  useEffect(() => {}, [token]);

  return (
    <BrowserRouter>
      {localStorageToken || sessionStorageToken ? ( //
        <MainRouter />
      ) : (
        <LoginRouter />
      )}
    </BrowserRouter>
  );
}

export default Router;
