import { IconButton, makeStyles, TextField } from "@material-ui/core";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import CloseIcon from "@material-ui/icons/Close";
import { ImageSect } from "./ImgSect";
import { UserListing } from "../UserListing";
import { SelectedListing } from "../SelectedListing";
import { useAddChatPane } from "./useAddChatPane";

export interface Props {}

export const AddChatPane: React.FC<Props> = () => {
  const classes = useStyles();
  const {
    image,
    setImage,
    setBlobImage,
    chatname,
    setChatName,
    selectedUsers,
    handleSearch,
    userResults,
    handleCancelBtn,
    handleDoneBtn,
    handleDeleteSelected,
    onAddMemberHandler,
  } = useAddChatPane();

  return (
    <div className={classes.addchatwrapper}>
      <div className={classes.main}>
        <ImageSect image={image} setBlob={setBlobImage} setImage={setImage} />
        <TextField
          autoComplete="off"
          value={chatname}
          onChange={(e) => {
            setChatName(e.target.value);
          }}
          className={classes.input}
          id="chat-name"
          label="Chat Name"
          variant="outlined"
        />
        {selectedUsers.length > 0 && (
          <SelectedListing
            users={selectedUsers}
            onDelete={handleDeleteSelected}
          />
        )}
        <TextField
          autoComplete="off"
          onChange={handleSearch}
          className={classes.input}
          id="member-name"
          label="Search Members"
          variant="outlined"
        />
        {userResults && (
          <UserListing users={userResults} onAddHandler={onAddMemberHandler} />
        )}
        <div className={classes.action_container}>
          <IconButton onClick={handleCancelBtn} className={classes.btn}>
            <CloseIcon />
          </IconButton>
          {selectedUsers.length > 0 && (
            <IconButton onClick={handleDoneBtn} className={classes.btn}>
              <DoneOutlineIcon />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflowY: "scroll",
    width: "20rem",
    maxHeight: "80%",
    paddingRight: "10px",
  },
  input: {
    marginBottom: "1rem",
    backgroundColor: "#23212A",
    width: "100%",
  },
  action_container: {
    width: "100%",
    textAlign: "right",
  },
  btn: {
    margin: "1rem 0",
  },
  addchatwrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "calc(5rem + 1rem + 5rem + 1rem + 65vh)",
  },
});
