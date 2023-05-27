import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: 'The primary email address of the user used for login',
        example: 'example@domain.com'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The password used for login of the user'
    })
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,20}$/, {
        message: "password too weak",
    })
    password: string;

    @ApiProperty({
        description: 'A unique display name for the user, that others can see. May be used in generating unique handles. Can only contain letters and numbers.',
        example: 'myUserName123'
    })
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(20)
    @IsAlphanumeric()
    displayName: string;
}