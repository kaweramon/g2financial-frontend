import {Component, Input} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap';

@Component({
  selector: 'app-info-billet-late',
  templateUrl: './info-billet-late.component.html',
  styleUrls: ['./info-billet-late.component.css']
})
export class InfoBilletLateComponent {

  @Input()
  modal: ModalDirective;

  constructor() { }

}
