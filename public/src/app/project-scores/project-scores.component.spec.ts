import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectScoresComponent } from './project-scores.component';

describe('ProjectScoresComponent', () => {
  let component: ProjectScoresComponent;
  let fixture: ComponentFixture<ProjectScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectScoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
