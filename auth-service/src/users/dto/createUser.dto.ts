import { IsEmail, IsUrl, Length } from "class-validator";

export class CreateUserDto {
  @Length(8, 50)
  name: string;

  @IsEmail()
  email: string;

  @IsUrl()
  picture: string;
}
