import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBilletLateComponent } from './info-billet-late.component';

describe('InfoBilletLateComponent', () => {
  let component: InfoBilletLateComponent;
  let fixture: ComponentFixture<InfoBilletLateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoBilletLateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBilletLateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
