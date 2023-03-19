import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  HttpException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Offer } from './dtos/offer.dto';
import { QueryOffer } from './dtos/queryoffer.dto';
import { QueryHistoricalOffers } from './dtos/queryhistoffers.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Offers')
@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('helloworld')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/queryprice/:stateid')
  @ApiOperation({
    summary: 'Query current electricity price in a state or province',
    description: `Query current electricity price in a state/province based on the given stateid.

    - For stateid in US, refer to "https://www.sinfin.net/railways/world/usa/stateids.html" plus the following regions.
        (ENC) East North Central || (ESC) East South Central || (MAT) Middle Atlantic
        || (MTN) Mountain || (NEW) New England || (PACC) Pacific Contiguous 
        || (PACN) Pacific Noncontiguous || (SAT) South Atlantic
        || (WNC) West North Central || (WSC) West South Central 
        || (US) United States (not including territory data)
    - For stateid in CA, refer to "https://www150.statcan.gc.ca/n1/pub/92-195-x/2011001/geo/prov/tbl/tbl8-eng.htm". 
      Now only AB supported.`,
  })
  @ApiResponse({
    status: 200,
    description: 'Real-time average electricity price in $/kWh',
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not configured correctly',
    type: HttpException,
  })
  async queryRealtimeElectricityPrice(@Param('stateid') stateid: string) {
    if (stateid == '') return 0;
    let price: number = 0;
    switch (stateid) {
      case 'AB':
        price = await this.appService.queryCAElectricityPrice();
        break;
      default:
        price = await this.appService.queryUSElectricityPrice(stateid);
        if (price == undefined) return 0;
    }
    return price;
  }

  @Post('/storeoffer')
  async storeOffer(@Body() offer: Offer) {
    await this.appService.storeOffer(offer);
  }

  @Get('/searchoffers')
  async searchListingOffers(@Body() queryoffer: QueryOffer) {
    const offerRecords = await this.appService.searchListingOffers(queryoffer);
    return offerRecords;
  }

  @Get('/queryhistoricaloffers')
  async queryHistoricalOffers(@Body() queryhistoffer: QueryHistoricalOffers) {
    const historicalOfferRecords = await this.appService.searchHistoricalOffers(
      queryhistoffer,
    );
    return historicalOfferRecords;
  }
}
