export class BilletShipping {
  public id: number;
  public counter: number;
  public maturityDate: Date;
  public billValue: number;
  public dischargeDate: Date;
  public dischargeValue: number;
  public clientId: number;
  public ourNumber: string;
  public isCancel: boolean;
  public chargingType: string;
  public partialPayment: string;
  public documentNumber: string;

  constructor() {
    this.ourNumber = "";
  }
}
