import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { Container } from "../Container";
import { selectUser } from "../user/userSlice";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { makeStyles } from "@material-ui/core";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";

export interface Props {}

export const UserAvatarGroup: React.FC<Props> = () => {
  const [selected, setSelected] = useState(false);
  const user = useAppSelector(selectUser);
  const classes = useStyles();

  if (!user) return <></>;

  const getFirstNChars = (str: string, n: number) => {
    if (str.length > n) {
      return str.slice(0, n) + "...";
    } else {
      return str;
    }
  };

  const getUserName = () => {
    return getFirstNChars(user.userName, 15);
  };

  const getName = () => {
    return getFirstNChars(user.name, 15);
  };

  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#23212A",
        borderRadius: "2rem",
        paddingLeft: "1rem",
      }}
      width="100%"
      height="5rem"
    >
      <img
        style={{
          borderRadius: "50%",
          width: "3rem",
          height: "3rem",
          objectFit: "cover",
        }}
        src={user.picture}
        alt="user image"
      />
      <Container style={{ marginLeft: "1rem" }} width="auto" height="2.5rem">
        <div>{getName()}</div>
        <div style={{ fontSize: ".8rem", color: "gray", height: "1rem" }}>
          @{getUserName()}
        </div>
      </Container>
      <ToggleButton
        style={{ marginLeft: "auto", marginRight: "1rem" }}
        className={classes.onlineBtn}
        value="check"
        selected={selected}
        onChange={() => {
          setSelected(!selected);
        }}
      >
        {selected ? <WifiIcon /> : <WifiOffIcon />}
      </ToggleButton>
    </Container>
  );
};

const useStyles = makeStyles({
  onlineBtn: {
    borderRadius: "50%",
  },
});
