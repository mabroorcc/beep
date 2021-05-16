import { AnimatePresence } from "framer-motion";
import { Switch, Route, useLocation } from "react-router-dom";
import { HomePage, HOME_PAGE_PATH } from "./pages/home";
import { LoginPage } from "./pages/login";
import theme from "./features/Theme";
import { MuiThemeProvider } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getLogedUserAsync, selectUser } from "./features/user/userSlice";
import {
  CreateUserNamePage,
  CREATE_USER_NAME_PAGE_PATH,
} from "./pages/CreateUserNamePage";

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
          {user && (
            <>
              <Route exact path={HOME_PAGE_PATH} component={HomePage} />
              <Route
                exact
                path={CREATE_USER_NAME_PAGE_PATH}
                component={CreateUserNamePage}
              />
            </>
          )}
          {!user && <LoginPage />}
        </Switch>
      </AnimatePresence>
    </MuiThemeProvider>
  );
}

export default App;
