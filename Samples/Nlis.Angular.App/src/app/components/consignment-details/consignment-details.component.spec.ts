import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentDetailsComponent } from './consignment-details.component';

describe('ConsignmentDetailsComponent', () => {
  let component: ConsignmentDetailsComponent;
  let fixture: ComponentFixture<ConsignmentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsignmentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
