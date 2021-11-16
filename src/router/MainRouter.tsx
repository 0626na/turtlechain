import { Switch, Route, Redirect } from "react-router-dom";
import { HomePage, MyInformationPage } from "pages";

const MainRouter = function () {
  return (
    <Switch>
      <Route exact path="/home" component={HomePage} />
      <Route exact path="/my/information" component={MyInformationPage} />
      <Redirect path="*" to="/home" />
    </Switch>
  );
};

export default MainRouter;
