import { Members } from "./members.entity";

export const MemberService = {
  addMemberToChat: (memberId: string, chatId: string) => {
    const member = new Members();
    member.chatId = chatId;
    member.memberId = memberId;
    return member.save();
  },
  removeMemberFromChat: (memberId: string, chatId: string) => {
    return Members.delete({ memberId, chatId });
  },
  getAllTheMemberShips: (memberId: string) => {
    return Members.find({ memberId: memberId });
  },
  getAllTheMembersOfTheChat: (chatId: string) => {
    return Members.find({ chatId });
  },
  deleteMemberFromChat: (chatId: string, memberId: string) => {
    return Members.delete({ chatId, memberId });
  },
};
