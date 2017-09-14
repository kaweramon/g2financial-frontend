import {CieloPaymentCards} from './cielo-payment-cards';

export class CieloPayment {
  public id: number;
  public amount: number;
  public authenticate: boolean;
  public authorizationCode: string;
  public capture: boolean;
  public country: string;
  public currency: string;
  public installments: number;
  public interest: number;
  public paymentId: number;
  public proofOfSale: string;
  public provider: string;
  public receivedDate: Date;
  public recurrent: boolean;
  public returnCode: string;
  public returnMessage: string;
  public serviceTaxAmount: number;
  public softDescriptor: string;
  public status: number;
  public tid: string;
  public type: string;
  public cieloPaymentCards: CieloPaymentCards;
  public clientId: number;
  public isForSale: boolean;
  public description: string;
  public countOrderId: number;
}
