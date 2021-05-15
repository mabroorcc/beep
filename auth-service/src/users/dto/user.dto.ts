import { IsEmail } from "class-validator";

export class User {
  id: string;
  name: string;
  userName: string;
  email: string;
  picture: string;
}

export class FindUserByEmailDto {
  @IsEmail()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
