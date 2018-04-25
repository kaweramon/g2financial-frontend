import {BillToPayPayment} from './bill-to-pay-payment';
export class BillToPay {
  public id: number;
  public clientName: string;
  public description: string;
  public observation: string;
  public type: string;
  public isCredit: boolean;
  public isCancel: boolean;
  public clientId: number;
  public listBillToPayPayment: Array<BillToPayPayment>;

  constructor() {
    this.listBillToPayPayment = [];
  }
}
