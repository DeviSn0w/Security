import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDetailsComponent } from './complaint-details.component';

describe('ComplaintDetailsComponent', () => {
  let component: ComplaintDetailsComponent;
  let fixture: ComponentFixture<ComplaintDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComplaintDetailsComponent]
    });
    fixture = TestBed.createComponent(ComplaintDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
