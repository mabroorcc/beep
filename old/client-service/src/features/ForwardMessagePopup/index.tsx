import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { blue } from "@material-ui/core/colors";
import { useAppSelector } from "../../app/hooks";
import { chat, selectChats } from "../Chats/chatsSlice";

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  handleClick: (val: chat) => void;
}

export function MessageForwardDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, handleClick, open } = props;
  const chats = useAppSelector(selectChats);

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: chat) => {
    handleClick(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Send To</DialogTitle>
      <List>
        {chats.map((chat) => {
          return (
            <ListItem
              key={chat.id}
              button
              onClick={() => handleListItemClick(chat)}
            >
              <ListItemAvatar>
                <Avatar src={chat.picture} className={classes.avatar} />
              </ListItemAvatar>
              <ListItemText primary={chat.name} />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
}
