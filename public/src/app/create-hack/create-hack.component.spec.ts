import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHackComponent } from './create-hack.component';

describe('CreateHackComponent', () => {
  let component: CreateHackComponent;
  let fixture: ComponentFixture<CreateHackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
