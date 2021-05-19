import {
  IconButton,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { BeepTopLeftLogo } from "../../features/BeepTopLeftLogo";
import { Container } from "../../features/Container";
import { PageComponenet } from "../../features/PageComponent";
import {
  selectUser,
  setFullNameAct,
  setUserNameAct,
} from "../../features/user/userSlice";
import * as globalStyle from "../../styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { CHANGE_PROFILE_PAGE_PATH } from "../ChangeProfile";
import { jsonReq } from "../../features/JSON";
import { LOGIN_PAGE_PATH } from "../login";

export interface Props {}

export const CHANGE_USER_NAME_PAGE_PATH = "/settings/user";

export const CreateUserName: React.FC<Props> = () => {
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [userError, setUserError] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setUserName(user.userName);
      setFullName(user.name);
    }
  }, []);

  const checkUserName = async () => {
    if (userName.length < 7) return setUserError(true);
    if (userName === user?.userName) return;
    const url = `http://localhost:4000/auth/users/check/username/${userName}`;
    const res: Response = await fetch(url);
    if (!res.ok) return setUserError(true);
    setUserError(false);
  };

  const changeName = async () => {
    return jsonReq(`http://localhost:4000/auth/users/change/name`, "post", {
      name: fullName,
    });
  };
  const changeUserName = () => {
    return jsonReq(`http://localhost:4000/auth/users/change/username`, "post", {
      userName,
    });
  };

  const changeDetails = async () => {
    if (!user) {
      console.log("user end");
      return;
      //return history.push(LOGIN_PAGE_PATH);
    }

    let changed = false;

    try {
      if (user.userName !== userName) {
        const response = await changeUserName();
        if (response.ok) changed = true;
        console.log(await response.json());
      }
      if (user.name !== fullName) {
        const response = await changeName();
        if (response.ok) changed = true;
        console.log(await response.json());
      }
      dispatch(setUserNameAct(userName));
      dispatch(setFullNameAct(fullName));
      console.log("changed");
      //history.goBack();
    } catch (e) {
      console.log(e);
      // here changing details failed for some reason
      //history.goBack();
    }
  };

  const handleInputChange = (e: any) => {
    setUserName(e.target.value);
    checkUserName();
  };

  const handleFullNameInputChange = (e: any) => {
    setFullName(e.target.value);
  };

  const handleCancel = () => {
    history.goBack();
  };

  return (
    <PageComponenet duration={0.2} enter="middle" leave="left">
      <BeepTopLeftLogo />
      <div style={{ ...styles.root }}>
        <Container style={{ ...styles.container }} width="20rem" height="10rem">
          <Typography className={classes.typo} variant="h6">
            User Details
          </Typography>
          <TextField
            error={userError}
            className={classes.textField}
            onChange={handleInputChange}
            value={userName}
            label="User Name"
            variant="outlined"
          />
          <TextField
            className={classes.textField}
            onChange={handleFullNameInputChange}
            value={fullName}
            label="Name"
            variant="outlined"
          />
          {!userError && userName.length > 7 && (
            <Container
              style={{ textAlign: "right" }}
              width="100%"
              height="auto"
            >
              <IconButton onClick={handleCancel} aria-label="done">
                <CancelIcon />
              </IconButton>
              <IconButton onClick={changeDetails} aria-label="done">
                <DoneIcon />
              </IconButton>
            </Container>
          )}
        </Container>
      </div>
    </PageComponenet>
  );
};

const useStyles = makeStyles((theme) => {
  return {
    textField: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      marginBottom: "1rem",
    },
    typo: {
      marginBottom: "1rem",
    },
    iconBtn: {
      marginRight: "auto",
    },
  };
});

const styles: Record<string, React.CSSProperties> = {
  root: {
    ...globalStyle.center,
    height: "100vh",
    flexDirection: "column",
  },
  container: {
    alignItems: "center",
  },
};
