import { BeepLogo } from "../../assets/BeepLogo";
import { Container } from "../Container";

export const BeepTopLeftLogo: React.FC = () => {
  return (
    <Container style={{ ...styles.logo }} width="5rem" height="auto">
      <BeepLogo />
    </Container>
  );
};

const styles: Record<string, React.CSSProperties> = {
  logo: {
    position: "fixed",
    top: "2rem",
    left: "3rem",
  },
};
