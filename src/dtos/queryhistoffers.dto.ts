import { ApiProperty } from '@nestjs/swagger';
export class QueryHistoricalOffers {
  @ApiProperty({
    required: true,
    description: 'Account address of the current user',
    example: '0x0160ceDB6cae2EAd33F5c2fa25FE078485a07b63',
  })
  public myAccount: string;

  @ApiProperty({
    required: false,
    description:
      '(Optional) The max amount of electricity in kWh boughted/sold',
    example: '100',
  })
  public amount?: number;

  @ApiProperty({
    required: false,
    description: '(Optional) The price in $/kWh of the offer',
    example: '0.35',
  })
  public price?: number;

  @ApiProperty({
    required: false,
    description: '(Optional) The location/address of this offer',
    example: '13021 20 Ave SW, Edmonton, Alberta, Canada',
  })
  public location?: string;

  @ApiProperty({
    required: false,
    description: '(Optional) The UNIX timestamp when users submit this offer',
    example: '1679183555',
  })
  public submitTime?: number;
}
