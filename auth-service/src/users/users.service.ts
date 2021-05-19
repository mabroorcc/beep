import { User } from "./dto/user.dto";
import { UsersEntity } from "./users.entity";
import { CreateUserDto } from "./dto/createUser.dto";
import { ServerException } from "../exceptions";

export const createUser = async (userDto: CreateUserDto): Promise<User> => {
  const user = new UsersEntity();
  user.name = userDto.name;
  user.email = userDto.email;
  user.picture = userDto.picture;
  user.userName = userDto.name + "_" + String(Math.random() * 100);
  return await user.save();
};

export const deleteUser = async (email: string) => {
  const user = await UsersEntity.findOne({ email });
  if (!user) throw new ServerException("User not found!");
  return true;
};

export const changeName = async (name: string, uid: string) => {
  const user = await UsersEntity.findOne({ id: uid });
  if (user) {
    user.name = name;
    return user.save();
  } else {
    return "User not found";
  }
};

export const changeProfile = async (picture: string, userName: string) => {
  const user = await UsersEntity.findOne({ userName });
  if (!user) throw new ServerException("user not found!");

  user.picture = picture;

  return await user.save();
};

export const getUserByEmail = async (email: string) => {
  return UsersEntity.findOne({ email });
};

export const getUserById = async (id: string) => {
  return UsersEntity.findOne({ id });
};

export const getUsersByUserName = async (userName: string) => {
  return UsersEntity.getRepository()
    .createQueryBuilder()
    .select()
    .where('"userName" ILIKE :userName', { userName: `%${userName}%` })
    .limit(10)
    .getMany();
};

export const changeUserName = async (
  uuid: string,
  userName: string
): Promise<User> => {
  const user = await UsersEntity.findOne({ id: uuid });
  if (!user) throw new ServerException("User not found!");

  const alreadyAcquired = await UsersEntity.findOne({ userName });
  if (alreadyAcquired) {
    throw new ServerException("Username already acquired by someone else!");
  }
  user.userName = userName;
  return await user.save();
};

export const findManyUsers = async (cond: any) => {
  return await UsersEntity.find(cond);
};

export const findOneUser = async (cond: any) => {
  return await UsersEntity.findOne(cond);
};
