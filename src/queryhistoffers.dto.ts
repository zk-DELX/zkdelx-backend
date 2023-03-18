export class QueryHistoricalOffers {
  constructor(
    public myAccount: string,
    public amount?: number, // the following optional conditions
    public price?: number,
    public location?: string,
    public submitTime?: number,
  ) {}
}
