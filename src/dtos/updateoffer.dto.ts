import { ApiProperty } from '@nestjs/swagger';
export class UpdateOffer {
  @ApiProperty({
    required: true,
    description: 'Unique offerID',
    example: 'ID-JDJKVFO',
  })
  public offerID: string;

  @ApiProperty({
    required: true,
    description: 'User (buyer/seller) account of this offer',
    example: '0x4726a2FBcb2844beF75979dcFF50b3AC8F50AC53',
  })
  public userAccount: string;

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
    description: 'The UNIX timestamp when buyer accepts this offer',
    example: '1679183555',
  })
  public updateTime: number;
}
