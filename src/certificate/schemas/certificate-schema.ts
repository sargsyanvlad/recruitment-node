import { ApiProperty } from '@nestjs/swagger';

export class CertificateSchema {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  ownerId: number;

  @ApiProperty({ example: 1 })
  owned: number;
}
