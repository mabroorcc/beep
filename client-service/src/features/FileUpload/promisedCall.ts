import { store } from "../../app/store";
import { uploadFileAction } from "./uploadSlice";

export const PromisedFileUpload = (
  filename: string,
  file: Blob
): Promise<string> => {
  return new Promise((resolve, reject) => {
    store.dispatch(
      uploadFileAction(filename, file, (url) => {
        resolve(url);
      })
    );
  });
};
