import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { PageComponenet } from "../../features/PageComponent";
import { selectUser } from "../../features/user/userSlice";
import { LOGIN_PAGE_PATH } from "../login";

export interface Props {}

export const HOME_PAGE_PATH = "/";

export const HomePage: React.FC<Props> = () => {
  const user = useAppSelector(selectUser);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push(LOGIN_PAGE_PATH);
    }
  }, [user]);

  return (
    <PageComponenet enter="middle" leave="left" duration={0.3}>
      <div>{JSON.stringify(user)}</div>
    </PageComponenet>
  );
};
