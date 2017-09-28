import { TestBed, async, inject } from '@angular/core/testing';

import { AuthAdminGuardGuard } from './auth-admin-guard.guard';

describe('AuthAdminGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthAdminGuardGuard]
    });
  });

  it('should ...', inject([AuthAdminGuardGuard], (guard: AuthAdminGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
