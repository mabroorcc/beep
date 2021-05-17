import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { PageComponenet } from "../../features/PageComponent";
import { selectUser } from "../../features/user/userSlice";
import { CHANGE_PROFILE_PAGE_PATH } from "../ChangeProfile";
import { CHANGE_USER_NAME_PAGE_PATH } from "../ChangeUserName";

export interface Props {}

export const HOME_PAGE_PATH = "/";

export const HomePage: React.FC<Props> = () => {
  const user = useAppSelector(selectUser);

  return (
    <PageComponenet enter="middle" leave="left" duration={0.3}>
      <div>
        {JSON.stringify(user)}
        <div>
          <Link to={CHANGE_PROFILE_PAGE_PATH}>change profile</Link>
          <Link to={CHANGE_USER_NAME_PAGE_PATH}>change user name</Link>
        </div>
      </div>
    </PageComponenet>
  );
};
