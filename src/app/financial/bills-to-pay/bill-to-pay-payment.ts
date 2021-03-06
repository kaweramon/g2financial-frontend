export class BillToPayPayment {

  public id: number;
  public billToPayId: number;
  public isPay: string;
  public operator: string;
  public maturity: Date;
  public hourDate: Date;
  public observation: string;
  public amountPaid: number;
  public amount: number;
  public amountInterest: number;
  public amountLiveDays: number;
  public amountCharges: number;
  public interest: number;
  public ourNumber: string;
  public description: string;
  public isChecked: boolean;
  public subTotal: number;
  public daysInArrears: number;
  public dateStatus: string;

  constructor() {
    this.amount = 0.0;
    this.amountInterest = 0.0;
    this.amountCharges = 0.0;
    this.amountLiveDays = 0.0;
    this.amountPaid = 0.0;
    this.subTotal = 0.0;
  }
}
