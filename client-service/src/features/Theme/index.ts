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
  shape: {
    borderRadius: 13,
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none",
        borderRadius: "10px",
      },
    },
    MuiBackdrop: {
      root: {
        backgroundColor: "#191720cc",
      },
    },
  },
});

export default theme;
