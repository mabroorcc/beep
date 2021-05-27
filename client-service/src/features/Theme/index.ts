import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#fff",
    },
    background: {
      default: "#191720",
      paper: "#23212A",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none",
        borderRadius: "10px",
      },
    },
  },
});

export default theme;
