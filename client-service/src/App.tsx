import { AnimatePresence } from "framer-motion";
import { Switch, Route, useLocation } from "react-router-dom";
import { HomePage, HOME_PAGE_PATH } from "./pages/home";
import { LoginPage, LOGIN_PAGE_PATH } from "./pages/login";
import theme from "./features/Theme";
import { MuiThemeProvider } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getLogedUserAsync, selectUser } from "./features/user/userSlice";

function App() {
  const location = useLocation();

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) dispatch(getLogedUserAsync());
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route exact path={HOME_PAGE_PATH} component={HomePage} />
          <Route exact path={LOGIN_PAGE_PATH} component={LoginPage} />
        </Switch>
      </AnimatePresence>
    </MuiThemeProvider>
  );
}

export default App;
