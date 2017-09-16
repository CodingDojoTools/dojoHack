import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMembersComponent } from './register-members.component';

describe('RegisterMembersComponent', () => {
  let component: RegisterMembersComponent;
  let fixture: ComponentFixture<RegisterMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
