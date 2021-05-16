import { Link } from "react-router-dom";
import { PageComponenet } from "../../features/PageComponent";
import {HOME_PAGE_PATH} from "../home";

export interface Props {}

export const LOGIN_PAGE_PATH = "/login";

export const LoginPage: React.FC<Props> = () => {
  return (
    <PageComponenet enter="right" leave="left" duration={0.5}>
      <div style={{ ...styles.main }}>
        Login Page
        <Link to={HOME_PAGE_PATH}>/home</Link>
      </div>
    </PageComponenet>
  );
};

const styles: Record<string, React.CSSProperties> = {
  main: {
    width: "100vw",
    height: "100vh",
    background: "pink",
  },
};
