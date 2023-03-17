export class Offer {
  constructor(
    public offerID: string,
    public userAccount: string,
    public amount: number,
    public price: number,
    public location: string, // longitude/latitude?
    public submitTime: number, // UNIX timestamp
    public status: string,
  ) {}
}