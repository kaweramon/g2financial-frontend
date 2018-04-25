import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLateBilletComponent } from './modal-late-billet.component';

describe('ModalLateBilletComponent', () => {
  let component: ModalLateBilletComponent;
  let fixture: ComponentFixture<ModalLateBilletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLateBilletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLateBilletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
