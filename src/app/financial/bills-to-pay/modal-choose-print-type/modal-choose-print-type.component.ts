import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-choose-print-type',
  templateUrl: './modal-choose-print-type.component.html',
  styleUrls: ['./modal-choose-print-type.component.css']
})
export class ModalChoosePrintTypeComponent {

  @Input()
  public modalChoosePrintType: ModalDirective;

  @Output()
  public notify: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public printBillet(): void {
    this.modalChoosePrintType.hide();
    this.notify.emit({message: "printBillet"});
  }

  public printBillet80mm(): void {
    this.modalChoosePrintType.hide();
    this.notify.emit({message: "printBillet80mm"});
  }

}
