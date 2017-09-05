import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentListingComponent } from './consignment-listing.component';

describe('ConsignmentListingComponent', () => {
  let component: ConsignmentListingComponent;
  let fixture: ComponentFixture<ConsignmentListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsignmentListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
