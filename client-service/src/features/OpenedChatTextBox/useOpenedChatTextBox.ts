import { chat } from "../Chats/chatsSlice";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addOpenMessages } from "../OpenedChatPane/openChatSlice";
import { sendMessageInChat } from "../api";
import { uploadFileAction } from "../FileUpload/uploadSlice";

export const useOpenedChatTextBox = (chat: chat) => {
  const [file, setFile] = useState<{ file: File; type: string } | undefined>();
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  const onMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const onMessageKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // initiate message sending process here
      sendMessage();
    } else {
      // trigger typing event here
    }
  };

  const sendMessage = () => {
    if (file) {
      dispatch(
        uploadFileAction(file.file.name, file.file.slice(), (url) => {
          sendMessageRequest(url, file.type).catch((e) =>
            console.log("/TextBox/" + e.message)
          );
        })
      );
    } else {
      sendMessageRequest().catch((e) => console.log("/TextBox/" + e.message));
    }
  };

  const sendMessageRequest = async (attachment?: string, attType?: string) => {
    const msg = await sendMessageInChat({
      message,
      chatId: chat.id,
      attachment,
      attType,
    });
    dispatch(addOpenMessages([msg]));
    setMessage("");
    setFile(undefined);
  };

  const sendMessageBtnHandler = () => {
    // final call to send the message
    sendMessage();
  };

  const getInputFile = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.addEventListener("change", (e: any) => {
      if (!e.target.files) return setFile(undefined);
      const file = e.target.files[0];
      if (!file) return setFile(undefined);
      let type: string = "";
      if ((file as File).type.includes("image")) {
        type = "image";
      } else if ((file as File).type.includes("video")) {
        type = "video";
      } else {
        type = "file";
      }
      setFile({
        file: file,
        type,
      });
    });
    input.click();
  };

  const handleAttachmentClick = () => {
    if (file) {
      setFile(undefined);
    } else {
      getInputFile();
    }
  };

  return {
    file,
    getInputFile,
    handleAttachmentClick,
    message,
    onMessageChange,
    onMessageKeyPress,
    sendMessageBtnHandler,
  };
};
