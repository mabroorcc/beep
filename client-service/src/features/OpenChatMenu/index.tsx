import { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { chat } from "../Chats/chatsSlice";
import { TUser } from "../user/types";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../user/userSlice";
import { ChangeChatNameDialog } from "../ChangeChatNameDialog";
import { destroyChat } from "../api";
import { EditMembersDialog } from "../EditMembersDialog";

interface Props {
  chat: chat;
  members: TUser[];
}

export const OpenChatMenu: React.FC<Props> = ({ chat, members }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showChangeChatName, setShowChangeChatName] = useState(false);
  const [showEditMembers, setShowEditMember] = useState(false);

  const user = useAppSelector(selectUser);

  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isOwner = () => {
    if (user && user.id === chat.ownerId) return true;
    return false;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditChatClick = () => {
    handleClose();
  };

  const handleChangeChatName = () => {
    handleClose();
    setShowChangeChatName(true);
  };

  const handleDeleteChat = () => {
    const res = window.confirm("Are you sure?");
    if (res) destroyChat(chat.id);
    handleClose();
  };

  return (
    <div className={classes.openchatmenu}>
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      {isOwner() ? (
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleChangeChatName}>Edit Name</MenuItem>
          <MenuItem
            onClick={() => {
              setShowEditMember(true);
              handleClose();
            }}
          >
            Edit Members
          </MenuItem>
          <MenuItem onClick={handleEditChatClick}>Edit Picture</MenuItem>
          <MenuItem onClick={handleDeleteChat}>Destroy Chat</MenuItem>
        </Menu>
      ) : (
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Leave Chat</MenuItem>
        </Menu>
      )}
      <ChangeChatNameDialog
        open={showChangeChatName}
        handleClose={() => setShowChangeChatName(false)}
        chat={chat}
      />
      <EditMembersDialog
        open={showEditMembers}
        handleClose={() => {
          setShowEditMember(false);
        }}
        chat={chat}
        members={members}
      />
    </div>
  );
};

const useStyles = makeStyles({
  openchatmenu: { marginLeft: "auto" },
});
