import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoosePrintTypeComponent } from './modal-choose-print-type.component';

describe('ModalChoosePrintTypeComponent', () => {
  let component: ModalChoosePrintTypeComponent;
  let fixture: ComponentFixture<ModalChoosePrintTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChoosePrintTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalChoosePrintTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
