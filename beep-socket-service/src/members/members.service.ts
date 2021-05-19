import { Members } from "./members.entity";

export const MemberService = {
  addMemberToChat: (memberId: string, chatId: string) => {
    const member = new Members();
    member.chatId = chatId;
    member.memberId = memberId;
    return member.save();
  },

  getAllTheMembersOfTheChat: (chatId: string) => {
    return Members.find({ chatId });
  },
};
