import { Container } from "../Container";
import { HomeTopLogo } from "../HomeTopLogo";
import { UserAvatarGroup } from "../UserAvatarGroup";
import { Chats } from "../Chats";

export interface Props {}

export const LeftHomeSide: React.FC<Props> = () => {
  return (
    <Container width="25%" height="100%">
      <HomeTopLogo />
      <UserAvatarGroup />
      <Chats />
    </Container>
  );
};
