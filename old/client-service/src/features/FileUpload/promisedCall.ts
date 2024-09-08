import { store } from "../../app/store";
import { uploadFileAction } from "./uploadSlice";

// this call is through socket connection
export const PromisedFileUpload = (
  filename: string,
  file: Blob
): Promise<string> => {
  return new Promise((resolve) => {
    store.dispatch(
      uploadFileAction(filename, file, (url) => {
        resolve(url);
      })
    );
  });
};
