import { Dancing } from "../../assets/Dancing";
import { PageComponenet } from "../../features/PageComponent";
import { Container } from "../../features/Container";
import * as globalStyle from "../../styles";
import { Button, makeStyles, Typography } from "@material-ui/core";
import { GoogleIcon } from "../../assets/GoogleIcon";
import { BeepTopLeftLogo } from "../../features/BeepTopLeftLogo";
import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/user/userSlice";
import { HOME_PAGE_PATH } from "../home";
import { useHistory } from "react-router-dom";
import { CHANGE_USER_DETAILS_PAGE_PATH } from "../ChangeUserDetails";

export interface Props {}

export const LOGIN_PAGE_PATH = "/login";

export const LoginPage: React.FC<Props> = () => {
  const classes = useStyles();
  const user = useAppSelector(selectUser);
  const history = useHistory();

  useEffect(() => {
    const newuser = document.cookie.split("=")[1] === "true";
    if (user && !newuser) return history.push(HOME_PAGE_PATH);
    if (newuser) history.push(CHANGE_USER_DETAILS_PAGE_PATH);
  }, []);

  const handleLogin = () => {
    window.location.replace("http://localhost:4000/auth/a/login/google");
  };

  return (
    <PageComponenet enter="middle" leave="left" duration={0.2}>
      <div style={{ ...styles.root }}>
        <BeepTopLeftLogo />
        <Container style={{ ...styles.container }} height="auto" width="15rem">
          <Dancing />
        </Container>
        <Typography className={classes.mainType} variant="h6" align="center">
          Welcome to the most bleeding edge chatting platform
        </Typography>
        <Typography paragraph className={classes.subType} align="center">
          Connect with friends, family and people securely and instantly with
          our fast and secure communication services
        </Typography>
        <Button
          onClick={handleLogin}
          variant="contained"
          color="primary"
          className={classes.loginButton}
          startIcon={<GoogleIcon />}
        >
          login
        </Button>
      </div>
    </PageComponenet>
  );
};

const useStyles = makeStyles({
  mainType: {
    fontWeight: "bold",
    fontSize: "1.3rem",
    width: "25rem",
    lineHeight: "120%",
    marginBottom: ".5rem",
  },
  subType: {
    color: "#9D9D9D",
    fontSize: "0.9rem",
    width: "19rem",
    lineHeight: "120%",
  },
  loginButton: {
    backgroundColor: "#E5E5E5",
    width: "15rem",
    borderRadius: "8px",
    color: "#191720",
    padding: "9px 30px",
    "&:hover": {
      backgroundColor: "#E5E5E5",
    },
  },
});

const styles: Record<string, React.CSSProperties> = {
  root: {
    ...globalStyle.center,
    height: "100vh",
    flexDirection: "column",
  },
  container: { marginBottom: "20px" },
};
