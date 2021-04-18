import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import io, { Socket } from "socket.io-client";
import { AppThunk } from "../../app/store";
import { RootState } from "../../app/store";

export interface UploadState {
  uploading: boolean;
  progress: number;
}

const initialState: UploadState = {
  uploading: false,
  progress: 0,
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
  },
});

export const { setUploading, setProgress } = UploadSlice.actions;
export default UploadSlice.reducer;
export const selectUpload = (state: RootState) => state.upload;

export const uploadFileAction = (file: File): AppThunk => async (
  dispatch,
  getState
) => {
  const user = getState().user.user;

  if (!user) return;

  // dispatch an action to connect to file server
  const fsSocket = io("http://localhost:4002", {
    auth: { jwtId: user.jwtId, user: user },
  });

  dispatch(setUploading(true));

  fsSocket.on("file-channel", (chan) => {
    // split the file and start sending the files on this channel
    let chunkSize = 100000;
    if (file.size < chunkSize) {
      fsSocket.emit(chan, { partNo: -1, buff: file.arrayBuffer() });
    }
  });

  fsSocket.on("file-upload-finish", (arg) => {
    // get url and do something
  });

  fsSocket.on("file-error", (arg) => console.log(arg));

  fsSocket.emit("file-upload", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });
  // dispatch start split the file and start sending the data on the socket specified event
  //
  //get the url
};
