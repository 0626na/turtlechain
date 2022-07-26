import { BrowserRouter } from 'react-router-dom';

function Router() {
  // const login = useLogin();
  // const token = useRecoilValue(tokenState);
  // const localStorageToken = localStorage.getItem(TOKEN);
  // const sessionStorageToken = sessionStorage.getItem(TOKEN);

  // useEffect(() => {
  //   if (localStorageToken) {
  //     login(localStorageToken);
  //   }
  //   if (sessionStorageToken) {
  //     login(sessionStorageToken);
  //   }
  // });

  // useEffect(() => {}, [token]);

  return (
    <BrowserRouter>
      {/* {localStorageToken || sessionStorageToken ? (
        <MainRouter />
      ) : (
        <LoginRouter />
      )} */}
    </BrowserRouter>
  );
}

export default Router;
