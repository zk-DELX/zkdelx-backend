export class QueryOffer {
  constructor(
    public buyerAccount: string,
    public amount: number,
    public price: number, // max price
    public location: string, // buyer's current location
    public submitTime?: number, // UNIX timestamp
  ) {}
}
