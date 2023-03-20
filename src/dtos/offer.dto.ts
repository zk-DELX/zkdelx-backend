import { ApiProperty } from '@nestjs/swagger';
export class Offer {
  @ApiProperty({
    required: true,
    description: 'Unique offerID',
    example: 'ID-JDJKVFO',
  })
  public offerID: string;

  @ApiProperty({
    required: true,
    description: 'Account address of the seller',
    example: '0x0160ceDB6cae2EAd33F5c2fa25FE078485a07b63',
  })
  public sellerAccount: string;

  @ApiProperty({
    required: true,
    description: 'The max amount of electricity in kWh a seller can offer',
    example: '100',
  })
  public amount: number;

  @ApiProperty({
    required: true,
    description: 'The price in $/kWh of this offer',
    example: '0.35',
  })
  public price: number;

  @ApiProperty({
    required: true,
    description: 'The location/address of this offer',
    example: '13021 20 Ave SW, Edmonton, Alberta, Canada',
  })
  public location: string;

  @ApiProperty({
    required: true,
    description: 'The UNIX timestamp when seller submit this offer',
    example: '1679183555',
  })
  public submitTime: number;

  @ApiProperty({
    required: true,
    description:
      'Current status of this offer. Values: Listing | Pending | Complete',
    example: 'Listing',
  })
  public status: string;

  // @ApiProperty({
  //   required: false,
  //   description: '(Optional) Buyer account of this offer',
  //   // example: '0x4726a2FBcb2844beF75979dcFF50b3AC8F50AC53',
  // })
  // public buyerAccount?: string;
}
