export class CieloPaymentCards {
  public type: string;
  public brand: string;
  public cardNumber: string;
  public expirationDate: string;
  public holder: string;
  public saveCard: boolean;
  public authorizeNow: boolean;
  public endDate: Date;
  public interval: number;
  public nextRecurrency: string;
  public reasonCode: number;
  public reasonMessage: string;
  public recurrentPaymentId: string;
  public cardToken: string;
}
