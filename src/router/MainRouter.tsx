import { Switch, Route, Redirect } from "react-router-dom";
import { HomePage, MyInformationPage, MyCompanyPage } from "pages";

const MainRouter = function () {
  return (
    <Switch>
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/my/information" component={MyInformationPage} />
      <Route exact path="/my/company" component={MyCompanyPage} />
      <Redirect path="*" to="/home" />
    </Switch>
  );
};

export default MainRouter;
