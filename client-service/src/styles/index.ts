import { makeStyles } from "@material-ui/core";

export const center: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const useGlobalStyles = makeStyles({
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
