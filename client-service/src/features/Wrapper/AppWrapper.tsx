import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { AnimatePresence } from "framer-motion";
import theme from "../Theme";

export interface Props {}

export const AppWrapper: React.FC<Props> = ({ children }) => {
  return (
    <>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AnimatePresence>{children}</AnimatePresence>
      </MuiThemeProvider>
    </>
  );
};
