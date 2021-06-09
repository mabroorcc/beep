import { AnimatePresence } from "framer-motion";
import { Switch, Route, useLocation } from "react-router-dom";
import { HomePage, HOME_PAGE_PATH } from "./pages/home";
import { LoginPage } from "./pages/login";
import theme from "./features/Theme";
import { MuiThemeProvider } from "@material-ui/core";
import { CssBaseline } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getLogedUserAsync, selectUser } from "./features/user/userSlice";
import { ChangeProfile, CHANGE_PROFILE_PAGE_PATH } from "./pages/ChangeProfile";
import { ExpandedComponenet } from "./features/ExpandedComponenet";
import {
  ChangeUserDetails,
  CHANGE_USER_DETAILS_PAGE_PATH,
} from "./pages/ChangeUserDetails";
import { Socket, io } from "socket.io-client";
import { BeepSocket } from "./features/BeepSocket";
import { PageComponenet } from "./features/PageComponent";

function App() {
  const location = useLocation();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [beepSocket, setBeepSocket] = useState<Socket>();

  useEffect(() => {
    if (!user) {
      dispatch(getLogedUserAsync());
    }
    if (user) {
      const socket = io("http://localhost:4003", {
        auth: { user, jwtId: user.jwtId },
      });
      setBeepSocket(socket);
    }
  }, [user, dispatch]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          {user ? (
            <>
              <BeepSocket.Provider value={beepSocket}>
                <Route exact path={HOME_PAGE_PATH} component={HomePage} />
              </BeepSocket.Provider>
              <Route
                exact
                path={CHANGE_USER_DETAILS_PAGE_PATH}
                component={ChangeUserDetails}
              />
              <Route
                exact
                path={CHANGE_PROFILE_PAGE_PATH}
                component={ChangeProfile}
              />
            </>
          ) : (
            <LoginPage />
          )}
          <Route
            path="*"
            render={() => (
              <PageComponenet duration={0.3} enter="middle" leave="left">
                <ExpandedComponenet center>404 not found</ExpandedComponenet>
              </PageComponenet>
            )}
          />
        </Switch>
      </AnimatePresence>
    </MuiThemeProvider>
  );
}

export default App;
