import { ApiProperty } from '@nestjs/swagger';
export class QueryOffer {
  @ApiProperty({
    required: false,
    description: 'Buyer account of this offer',
    example: '0x4726a2FBcb2844beF75979dcFF50b3AC8F50AC53',
  })
  public buyerAccount: string;

  @ApiProperty({
    required: true,
    description: 'The max amount of electricity in kWh a buyer wants to buy',
    example: '60',
  })
  public amount: number;

  @ApiProperty({
    required: true,
    description: 'The max price in $/kWh of a buyer wants to pay',
    example: '0.30',
  })
  public price: number;

  @ApiProperty({
    required: true,
    description: 'The current location/address of buyer',
    example: '13021 20 Ave SW, Edmonton, Alberta, Canada',
  })
  public location: string;

  @ApiProperty({
    required: false,
    description: '(Optional) The UNIX timestamp when buyer submits this search',
    example: '1679183555',
  })
  public submitTime?: number;
}
