import { Injectable, Logger } from '@nestjs/common';
import { Offer } from './offer.dto';
import { QueryOffer } from './queryoffer.dto';
import axios from 'axios';
import { Polybase } from '@polybase/client';
import { Client } from '@googlemaps/google-maps-services-js';
@Injectable()
export class AppService {
  // private readonly logger = new Logger(AppService.name);
  private db = new Polybase({
    defaultNamespace: process.env.POLYBASE_NAME_SPACE ?? '',
  });

  getHello(): string {
    return 'Hello World!';
  }

  async queryCAElectricityPrice() {
    // this.logger.debug('Called when the current second is 45');
    let url_ravg =
      'http://ets.aeso.ca/ets_web/ip/Market/Reports/SMPriceReportServlet?contentType=html';
    try {
      var re: RegExp = /\d+(\.\d+)/g; // match all floating numbers
      const maxprice = 1000; // regulated max price: 1000 $/MWh
      const response = await axios.get(url_ravg);
      var data = response.data.match(re);
      let price = +data[1]; // take the latest 30Ravg (30-day rolling average)
      // if last hour's 30Ravg is not ready, take previous hour's
      if (price > maxprice) {
        price = +data[3];
      }
      // return price in CAD $/kWh
      return price / 1000;
    } catch (exception) {
      process.stderr.write(`ERROR received from ${url_ravg}: ${exception}\n`);
    }
  }

  async queryUSElectricityPrice(stateid: string) {
    const APIKey = process.env.EIA_API_KEY ?? '';
    const BASEURL = 'https://api.eia.gov/v2/electricity/retail-sales/data?';
    let url =
      BASEURL +
      `api_key=${APIKey}&data[]=price&frequency=monthly&facets[sectorid][]=RES&facets[stateid][]=${stateid}&sort[0][column]=period&sort[0][direction]=desc`;
    const response = await axios.get(url);
    const price = response.data.response.data[0].price;
    // return price in US $/kWh
    return price / 100;
  }

  async storeOffer(offer: Offer) {
    const locationSegs = offer.location.split(', ');
    const city = locationSegs[locationSegs.length - 3];
    await this.db
      .collection('Offer')
      .create([
        offer.offerID,
        offer.sellerAccount,
        offer.amount,
        offer.price,
        offer.location,
        city,
        offer.submitTime,
        offer.status,
      ]);
  }

  async searchOffers(queryoffer: QueryOffer) {
    const locationSegs = queryoffer.location.split(', ');
    const city = locationSegs[locationSegs.length - 3];
    // query offers located in the same city
    // default max return 100 records
    const offerRecords = await this.db
      .collection('Offer')
      .where('city', '==', city)
      .get();
    const dests: string[] = [];
    const offers = [];
    offerRecords.data.forEach((record) => {
      dests.push(record.data.location);
      offers.push(record.data);
    });
    // calculate the distance matrix from buyer location to potential offers
    const distanceArray = await this.calculateDistances(
      [queryoffer.location],
      dests,
    );
    offers.forEach((offer, index) => {
      offer.distance = distanceArray[index];
    });
    return offers;
  }

  async calculateDistances(_origins: string[], _dests: string[]) {
    var client = new Client({});
    const distanceMatrixRes = await client.distancematrix({
      params: {
        origins: _origins,
        destinations: _dests,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    });
    // distances data from buyer location to all offers
    const distances = distanceMatrixRes.data.rows[0].elements;
    return distances;
  }
}
