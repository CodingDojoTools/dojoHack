import { TestBed, async, inject } from '@angular/core/testing';

import { AuthTeamGuard } from './auth-team.guard';

describe('AuthTeamGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthTeamGuard]
    });
  });

  it('should ...', inject([AuthTeamGuard], (guard: AuthTeamGuard) => {
    expect(guard).toBeTruthy();
  }));
});
