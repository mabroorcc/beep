import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectUpload,
  uploadFileAction,
} from "../features/fileupload/uploadSlice";

export const UPLOAD_PAGE_ADDRESS = "/upload";
export const UploadFile: React.FC = () => {
  const fileState = useAppSelector(selectUpload);
  const dispatch = useAppDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    dispatch(uploadFileAction(file));
  };

  return (
    <div>
      <input onChange={handleFileChange} type="file" />
    </div>
  );
};
