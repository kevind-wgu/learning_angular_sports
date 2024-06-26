import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsSelectComponent } from './sports-select.component';

describe('SportsSelectComponent', () => {
  let component: SportsSelectComponent;
  let fixture: ComponentFixture<SportsSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportsSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SportsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
