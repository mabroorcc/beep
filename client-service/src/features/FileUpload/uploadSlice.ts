import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { AppThunk } from "../../app/store";
import { RootState } from "../../app/store";

export interface UploadState {
  uploading: boolean;
  progress: number;
  files: { fileName: string; url: string }[];
}
const initialState: UploadState = {
  uploading: false,
  progress: 0,
  files: [],
};

const UploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.uploading = action.payload;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    addFile: (
      state,
      action: PayloadAction<{ fileName: string; url: string }>
    ) => {
      state.files.push(action.payload);
    },
  },
});

export const { setUploading, setProgress, addFile } = UploadSlice.actions;
export default UploadSlice.reducer;
export const selectUpload = (state: RootState) => state.upload;

export const uploadFileAction =
  (
    fileName: string,
    file: Blob,
    onFinishUpload: (url: string) => void
  ): AppThunk =>
  async (dispatch, getState) => {
    const user = getState().user.user;

    if (!user) return;

    // dispatch an action to connect to file server
    const fsSocket = io("http://localhost:4002", {
      auth: { jwtId: user.jwtId, user: user },
    });

    dispatch(setUploading(true));
    dispatch(setProgress(0));

    fsSocket.on("file-channel", (chan) => {
      // updating the progress state
      fsSocket.on(chan, (arg: any) => {
        dispatch(setProgress(arg));
      });

      // split the file and start sending the files on this channel
      let chunkSize = 100000;
      splitBlob(0, chunkSize, file, (part) => {
        fsSocket.emit(chan, part);
      });
    });

    // log
    fsSocket.on("file-error", (arg) => {
      console.log("file-error", arg);
    });

    // log
    fsSocket.on("upload-error", (arg) => {
      console.log("upload-error", arg);
    });

    fsSocket.on("file-upload-finish", (arg) => {
      dispatch(addFile({ fileName, url: arg }));
      onFinishUpload(arg);
      fsSocket.disconnect();
    });

    fsSocket.on("file-error", (arg) => console.log(arg));

    fsSocket.emit("file-upload", {
      fileName: fileName,
      fileSize: file.size,
      chunkSize: 100000,
    });
  };

const splitBlob = async (
  start: number,
  chunkSize: number,
  iBlob: Blob,
  callback: (arg: { partNo: number; buff: ArrayBuffer }) => void
) => {
  if (start + chunkSize > iBlob.size) {
    const blob = iBlob.slice(start, iBlob.size);
    const buff = await blob.arrayBuffer();
    callback({ partNo: -1, buff });
    return;
  } else {
    const blob = iBlob.slice(start, start + chunkSize);
    const buff = await blob.arrayBuffer();
    callback({ partNo: start / chunkSize, buff });
    splitBlob(start + chunkSize, chunkSize, blob, callback);
  }
};

//const splitFile = async (
//start: number,
//chunkSize: number,
//file: File,
//callback: (arg: { partNo: number; buff: ArrayBuffer }) => void
//) => {
//if (start + chunkSize > file.size) {
//const blob = file.slice(start, file.size);
//const buff = await blob.arrayBuffer();
//callback({ partNo: -1, buff });
//return;
//} else {
//const blob = file.slice(start, start + chunkSize);
//const buff = await blob.arrayBuffer();
//callback({ partNo: start / chunkSize, buff });
//splitFile(start + chunkSize, chunkSize, file, callback);
//}
//};
