import { BeepLogo } from "../../assets/BeepLogo";
import { Container } from "../Container";

export const HomeTopLogo = () => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#23212A",
        borderRadius: "2rem",
        marginBottom: "1rem",
      }}
      width="100%"
      height="5rem"
    >
      <Container style={{}} width="5rem" height="auto">
        <BeepLogo></BeepLogo>
      </Container>
    </Container>
  );
};
