import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAddComponent } from './team-edit.component';

describe('TeamAddComponent', () => {
  let component: TeamAddComponent;
  let fixture: ComponentFixture<TeamAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
