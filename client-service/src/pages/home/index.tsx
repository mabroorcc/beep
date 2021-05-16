import { PageComponenet } from "../../features/PageComponent";

export interface Props {}

export const HOME_PAGE_PATH = "/";

export const HomePage: React.FC<Props> = () => {
  return (
    <PageComponenet enter="middle" leave="left" duration={0.5}>
      <div style={{ ...styles.main }}></div>
    </PageComponenet>
  );
};

const styles: Record<string, React.CSSProperties> = {
  main: {
    width: "100vw",
    height: "100vh",
    background: "#333",
  },
};
