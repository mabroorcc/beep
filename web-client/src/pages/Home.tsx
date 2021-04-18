import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getLogedUserAsync, selectUser } from "../features/user/userSlice";
import { useEffect } from "react";

export const HOME_PAGE_ADDRESS = "/"
export const Home: React.FC = () => {
  useEffect(() => {
    if (!user) dispatch(getLogedUserAsync());
  });

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    window.location.replace("http://localhost:4000/auth/a/login/google");
  };

  return (<div>
            <pre>{JSON.stringify(user)}</pre>
            {!user && <button onClick={handleLogin}>Login with Google</button>}
          </div>);
}
