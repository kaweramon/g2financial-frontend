import {CreditCard} from './credit-card-payment/credit-card';
import {DebitCard} from './debit-card-payment/debit-card';
import {RecurrentPayment} from './recurrent-payment/recurrent-payment';
export class Payment {
  public Type: string;
  public Amount: number;
  public Installments: number;
  public SoftDescriptor: string;
  public ReturnUrl: string;
  public CreditCard: CreditCard;
  public DebitCard: DebitCard;
  public RecurrentPayment: RecurrentPayment;

  constructor() {
    this.CreditCard = new CreditCard();
    this.DebitCard = new DebitCard();
    this.RecurrentPayment = new RecurrentPayment();
  }
}
