import { ApiProperty } from '@nestjs/swagger';

export class KeyValueResponseDto {
  @ApiProperty()
  readonly key: string;

  @ApiProperty()
  readonly value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}
