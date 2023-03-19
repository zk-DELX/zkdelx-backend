import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Offer } from './dtos/offer.dto';
import { QueryOffer } from './dtos/queryoffer.dto';
import { QueryHistoricalOffers } from './dtos/queryhistoffers.dto';
import { UpdateOffer } from './dtos/updateoffer.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Offers')
@Controller()
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
  @ApiOperation({
    summary: 'Store an offer to Polybase',
    description:
      'Store an offer to Polybase. Offer fields include: offerID, sellerAccount, amount, price, location, submitTime, status, buyerAccount',
  })
  @ApiResponse({
    status: 201,
    description: 'Offer data sucessfully stored to Polybase',
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not configured correctly',
  })
  async storeOffer(@Body() offer: Offer) {
    await this.appService.storeOffer(offer);
  }

  @Get('/searchoffers')
  @ApiOperation({
    summary: 'Queriy listing offers from Polybase',
    description: 'A buyer queries all listing offers within the same city',
  })
  @ApiResponse({
    status: 200,
    description: 'Sucessfully query valid listing offers from Polybase',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async searchListingOffers(@Body() queryoffer: QueryOffer) {
    const offerRecords = await this.appService.searchListingOffers(queryoffer);
    return offerRecords;
  }

  @Get('/queryhistoricaloffers')
  @ApiOperation({
    summary: 'Queriy historical offers from Polybase',
    description: 'A user queries all his/her historical offers',
  })
  @ApiResponse({
    status: 200,
    description: 'Sucessfully query historical offer data from Polybase',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async queryHistoricalOffers(@Body() queryhistoffer: QueryHistoricalOffers) {
    const historicalOfferRecords = await this.appService.searchHistoricalOffers(
      queryhistoffer,
    );
    return historicalOfferRecords;
  }

  @Post('/acceptoffer')
  @ApiOperation({
    summary: 'Accept a listing offer',
    description:
      'A buyer accepts an offer, updates its status to Pending, and adds buyerAccount',
  })
  @ApiResponse({
    status: 201,
    description: 'Sucessfully update offer data to Polybase',
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async acceptOffer(@Body() acceptofferReq: UpdateOffer) {
    const res = await this.appService.acceptOffer(acceptofferReq);
    return res;
  }

  @Post('/completeoffer')
  @ApiOperation({
    summary: 'Complete a listing offer',
    description:
      'A buyer completes an offer, updates its status to Complete, and adds finalAmount',
  })
  @ApiResponse({
    status: 201,
    description: 'Sucessfully update offer data to Polybase',
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Collection function error: can only complete Pending offer',
  })
  async completeOffer(@Body() completeofferReq: UpdateOffer) {
    const res = await this.appService.completeOffer(completeofferReq);
    return res;
  }

  @Post('/canceloffer')
  @ApiOperation({
    summary: 'Cancel a pending offer',
    description:
      'A buyer cancels an accepted pending offer, updates its status back to Listing, and remove buyerAccount & acceptTime',
  })
  @ApiResponse({
    status: 201,
    description: 'Sucessfully update offer data to Polybase',
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Collection function error: can only cancel Pending offer',
  })
  @ApiResponse({
    status: 401,
    description: 'collection function error: cannot cancel others offer',
  })
  async cancelOffer(@Body() cancelofferReq: UpdateOffer) {
    const res = await this.appService.cancelOffer(cancelofferReq);
    return res;
  }

  @Post('/expireoffer')
  @ApiOperation({
    summary: 'Expire a pending offer',
    description:
      'A seller expires an accepted pending offer, updates its status back to Listing, and remove buyerAccount & acceptTime',
  })
  @ApiResponse({
    status: 201,
    description: 'Sucessfully update offer data to Polybase',
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Collection function error: can only expire Pending offer',
  })
  @ApiResponse({
    status: 401,
    description: 'collection function error: cannot expire others offer',
  })
  async expireOffer(@Body() expireofferReq: UpdateOffer) {
    const res = await this.appService.expireOffer(expireofferReq);
    return res;
  }

  @Post('/deleteoffer')
  @ApiOperation({
    summary: 'Delete a listing offer',
    description: 'A seller deletes a listing offer from Polybase',
  })
  @ApiResponse({
    status: 201,
    description: 'Sucessfully delete offer data from Polybase',
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Collection function error: can only delete Listing offer',
  })
  @ApiResponse({
    status: 401,
    description: 'collection function error: cannot delete others offer',
  })
  async deleteOffer(@Body() deleteofferReq: UpdateOffer) {
    const res = await this.appService.deleteOffer(deleteofferReq);
    return res;
  }
}
