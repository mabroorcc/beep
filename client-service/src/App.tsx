import { AnimatePresence } from "framer-motion";
import { Switch, Route, useLocation } from "react-router-dom";
import { HomePage, HOME_PAGE_PATH } from "./pages/home";
import { LoginPage, LOGIN_PAGE_PATH } from "./pages/login";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Switch location={location} key={location.pathname}>
        <Route exact path={HOME_PAGE_PATH} component={HomePage} />
        <Route exact path={LOGIN_PAGE_PATH} component={LoginPage} />
      </Switch>
    </AnimatePresence>
  );
}

export default App;
