import { makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";
import { ExpandedComponenet } from "../../ExpandedComponenet";
import { jsonReq } from "../../JSON";
import { ImageSect } from "./ImgSect";
import { TUser } from "../../user/types";

export interface Props {}

export const AddChatPane: React.FC<Props> = () => {
  const classes = useStyles();
  const [image, setImage] = useState("http://picsum.photos/400/400");
  const [userResults, setUserResults] = useState<TUser[]>();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const userName = e.target.value;
    if (userName.length < 7) return;
    const response = await searchUsersWithUserName(userName);
    if (response.ok) {
      const { payload } = await response.json();
      setUserResults(payload.users as TUser[]);
      console.log(userResults);
    }
  };

  return (
    <ExpandedComponenet center>
      <div className={classes.main}>
        <ImageSect image={image} setImage={setImage} />
        <TextField
          className={classes.input}
          id="chat-name"
          label="Chat Name"
          variant="outlined"
        />
        <div className={classes.memberChips}></div>
        <TextField
          onChange={handleSearch}
          className={classes.input}
          id="member-name"
          label="Search Members"
          variant="outlined"
        />
      </div>
      <div className={classes.userListings}></div>
    </ExpandedComponenet>
  );
};

const searchUsersWithUserName = async (userName: string) => {
  return jsonReq(
    `http://localhost:4000/auth/users/find/username/${userName}`,
    "get",
    null
  );
};

const useStyles = makeStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    marginBottom: "1rem",
    backgroundColor: "#23212A",
    width: "20rem",
  },
  memberChips: {},
  userListings: {},
});
