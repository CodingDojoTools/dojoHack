import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamJudgeComponent } from './team-judge.component';

describe('TeamJudgeComponent', () => {
  let component: TeamJudgeComponent;
  let fixture: ComponentFixture<TeamJudgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamJudgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamJudgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
