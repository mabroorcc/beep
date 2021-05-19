import { Container } from "../Container";

export interface Props {}

export const RightHomeSide: React.FC<Props> = () => {
  return (
    <Container
      style={{ marginLeft: "1.5rem", background: "#333" }}
      width="75%"
      height="100%"
    >
      hai
    </Container>
  );
};
