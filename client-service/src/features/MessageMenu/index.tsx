import React, { useState } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton, makeStyles } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  addOpenMessages,
  deleteMessage,
  Message,
  selectOpenChat,
} from "../OpenedChatPane/openChatSlice";
import { chat } from "../Chats/chatsSlice";
import { MessageForwardDialog } from "../ForwardMessagePopup";
import { deleteMessageFromChat, sendMessageInChat } from "../api";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../user/userSlice";

interface Props {
  dir: "left" | "right";
  message: Message;
}

export const MessageMenu: React.FC<Props> = ({ dir, message }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openForwardDialog, setForwardDialog] = useState(false);
  const openChat = useAppSelector(selectOpenChat);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleForward = async () => {
    setForwardDialog(true);
    setAnchorEl(null);
  };

  const handleDialogClose = () => {
    setForwardDialog(false);
  };

  const handleDialogItemClick = (chat: chat) => {
    setForwardDialog(false);
    // send message here to the chat
    sendMessageInChat({
      message: message.message,
      chatId: chat.id,
      attachment: message.attachment,
      attType: message.attType,
    })
      .then((msg) => {
        if (!openChat) return;
        if (chat.id === openChat.id) {
          dispatch(addOpenMessages([msg]));
        }
      })
      .catch((e) =>
        console.log("falied to forward message /MessageMenu", e.message)
      );
  };

  const getSide = () => {
    if (dir === "right") {
      return { right: "-2rem" };
    } else {
      return { left: "-2rem" };
    }
  };

  const handleDeleteMessage = () => {
    deleteMessageFromChat(message.id).then((res) => {
      if (res === "deleted") {
        // update state
        dispatch(deleteMessage(message.id));
      } else {
        console.log(res);
      }
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "0.2rem",
        ...getSide(),
        opacity: "0.1",
      }}
    >
      <IconButton
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleForward}>Forward</MenuItem>
        {user && user.id === message.senderId && (
          <MenuItem onClick={handleDeleteMessage}>Delete</MenuItem>
        )}
      </Menu>
      <MessageForwardDialog
        open={openForwardDialog}
        onClose={handleDialogClose}
        handleClick={handleDialogItemClick}
      />
    </div>
  );
};

const useStyles = makeStyles({
  messageMenu: {
    position: "absolute",
    right: "-20%",
    top: "0",
  },
});
