import { ApiProperty } from '@nestjs/swagger';
import { KeyValueResponseDto } from './key-value-response.dto';

export class DataSetResponseDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly handle: string;

  @ApiProperty({ type: KeyValueResponseDto })
  readonly entries: Array<KeyValueResponseDto>;

  constructor(
    name: string,
    handle: string,
    entries: Array<KeyValueResponseDto>
  ) {
    this.name = name;
    this.handle = handle;
    this.entries = entries;
  }
}
