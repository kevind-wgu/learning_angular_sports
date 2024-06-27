import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreEntryItemEditComponent } from './score-entry-item-edit.component';

describe('ScoreEntryItemEditComponent', () => {
  let component: ScoreEntryItemEditComponent;
  let fixture: ComponentFixture<ScoreEntryItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreEntryItemEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreEntryItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
