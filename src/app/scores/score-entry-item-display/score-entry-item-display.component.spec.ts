import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreEntryItemDisplayComponent } from './score-entry-item-display.component';

describe('ScoreEntryItemDisplayComponent', () => {
  let component: ScoreEntryItemDisplayComponent;
  let fixture: ComponentFixture<ScoreEntryItemDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreEntryItemDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreEntryItemDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
