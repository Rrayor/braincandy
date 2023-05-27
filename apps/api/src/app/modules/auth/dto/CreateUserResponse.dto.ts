import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
    @ApiProperty({
        description: 'The email the user has been registered with'
    })
    readonly email: string;

    @ApiProperty({
        description: 'The unique and public display name the user has been registered with'
    })
    readonly displayName:string;

    @ApiProperty({
        description: 'The authentication JWT token for the user'
    })
    readonly tokenId: string;

    constructor(email: string, displayName: string, tokenId: string) {
        this.email = email;
        this.displayName = displayName;
        this.tokenId = tokenId;
    }
}