import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BilletShipping} from '../billet-payment/billet-shipping';
import {ModalDirective} from 'ngx-bootstrap';
import {Bank} from '../bank';

@Component({
  selector: 'app-modal-late-billet',
  templateUrl: './modal-late-billet.component.html',
  styleUrls: ['./modal-late-billet.component.css']
})
export class ModalLateBilletComponent {

  @Input()
  public billetShipping: BilletShipping;

  @Input()
  public modalLateBill: ModalDirective;

  @Input()
  public codeBar: string;

  @Input()
  public bank: Bank;

  @Output()
  public notify: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  public codeBarFirstGroup: string;
  @Input()
  public codeBarSecondGroup: string;
  @Input()
  public codeBarThirdGroup: string;
  @Input()
  public verifyDigit: string;
  @Input()
  public codeBarFourGroup: string;

  constructor() {

  }

  public printBillet(): void {
    this.notify.emit({message: "printBillet"});
  }

  public printBillet80mm(): void {
    this.notify.emit({message: "printBillet80mm"});
  }

}

