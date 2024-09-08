import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import { AnimatedBeepLogo } from "../../assets/AnimatedBeepLogo";
import { Container } from "../Container";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

export default function LoadingBackdrop() {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open>
      <Container width="10rem" height="auto">
        <AnimatedBeepLogo></AnimatedBeepLogo>
      </Container>
    </Backdrop>
  );
}
