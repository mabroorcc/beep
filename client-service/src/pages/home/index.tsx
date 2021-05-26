import { ExpandedComponenet } from "../../features/ExpandedComponenet";
import { PageComponenet } from "../../features/PageComponent";
import { LeftHomeSide } from "../../features/LeftHomeSide";
import { RightHomeSide } from "../../features/RightHomeSide";
import { useContext, useEffect, useState } from "react";
import { BeepSocket } from "../../features/BeepSocket";
import { injectApi } from "../../features/BeepSocket/api";

export interface Props {}

export const HOME_PAGE_PATH = "/";

export const HomePage: React.FC<Props> = () => {
  const [connected, setConnected] = useState(false);
  const beepSocket = useContext(BeepSocket);

  useEffect(() => {
    if (beepSocket) {
      injectApi(beepSocket);
      setConnected(true);
    }
    if (!beepSocket) setConnected(false);
  }, [beepSocket]);

  return (
    <PageComponenet enter="middle" leave="left" duration={0.3}>
      {connected ? (
        <ExpandedComponenet styles={{ display: "flex" }}>
          <LeftHomeSide />
          <RightHomeSide />
        </ExpandedComponenet>
      ) : (
        <div>loading</div>
      )}
    </PageComponenet>
  );
};
