import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getLogedUserAsync, selectUser } from "../features/user/userSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { UPLOAD_PAGE_ADDRESS } from "./UploadFile";

export const HOME_PAGE_ADDRESS = "/";

export const Home: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) dispatch(getLogedUserAsync());
  });

  const handleLogin = () => {
    window.location.replace("http://localhost:4000/auth/a/login/google");
  };

  return (
    <div>
      <pre>{JSON.stringify(user)}</pre>
      {user && <Link to={UPLOAD_PAGE_ADDRESS}>UploadFile</Link>}
      {!user && <button onClick={handleLogin}>Login with Google</button>}
    </div>
  );
};
