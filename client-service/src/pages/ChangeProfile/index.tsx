import { PageComponenet } from "../../features/PageComponent";

export interface Props {}

export const CHANGE_PROFILE_PAGE_PATH = "/changeprofile";

export const ChangeProfile: React.FC<Props> = () => {
  return (
    <PageComponenet enter="middle" leave="left" duration={0.2}>
      ChangeProfile
    </PageComponenet>
  );
};
