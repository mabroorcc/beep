import { ExpandedComponenet } from "../../features/ExpandedComponenet";
import { PageComponenet } from "../../features/PageComponent";
import { LeftHomeSide } from "../../features/LeftHomeSide";
import { RightHomeSide } from "../../features/RightHomeSide";

export interface Props {}

export const HOME_PAGE_PATH = "/";

export const HomePage: React.FC<Props> = () => {
  return (
    <PageComponenet enter="middle" leave="left" duration={0.3}>
      <ExpandedComponenet styles={{ display: "flex" }}>
        <LeftHomeSide />
        <RightHomeSide />
      </ExpandedComponenet>
    </PageComponenet>
  );
};
