import { ApiProperty } from '@nestjs/swagger';
import { DataSetResponseDto } from './data-set-response.dto';

export class LibraryResponseDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly userId: string;

  @ApiProperty({ type: DataSetResponseDto })
  readonly dataSets: Array<DataSetResponseDto>;

  constructor(id: string, userId: string, dataSets: Array<DataSetResponseDto>) {
    this.id = id;
    this.userId = userId;
    this.dataSets = dataSets;
  }
}
