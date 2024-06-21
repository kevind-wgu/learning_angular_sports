import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { sportsGuard } from './sports.guard';

describe('sportsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => sportsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
