import { useState, useEffect } from "react";
import CloseIcon from "@material-ui/icons/Close";
import {
  IconButton,
  DialogActions,
  Dialog,
  makeStyles,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { chat } from "../Chats/chatsSlice";
import { ImageSect } from "../AddChatPane/ImgSect";
import { PromisedFileUpload } from "../FileUpload/promisedCall";
import { changeChatPicture } from "../api";

interface Props {
  open: boolean;
  handleClose: () => void;
  chat: chat;
}

export const EditChatPictureDialog: React.FC<Props> = ({
  open,
  handleClose,
  chat,
}) => {
  const [image, setImage] = useState(chat.picture);
  const [blob, setBlob] = useState(new Blob());
  const [changed, setChanged] = useState(false);

  const handleCancelEditMembers = () => {
    handleClose();
  };

  const handleDone = () => {
    if (changed) {
      PromisedFileUpload("chatPicture", blob)
        .then((picture) => {
          return changeChatPicture(chat.id, picture);
        })
        .then(() => handleClose())
        .catch((e) => console.log("/EditChatPictureDialog ", e.message));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Chat Picture</DialogTitle>
      <DialogContent>
        <div style={{ width: "20rem" }}>
          <ImageSect
            image={image}
            setImage={(img: any) => {
              setChanged(true);
              setImage(img);
            }}
            setBlob={(blb: any) => {
              setChanged(true);
              setBlob(blb);
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={handleCancelEditMembers}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={handleDone}>
          <DoneIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};
