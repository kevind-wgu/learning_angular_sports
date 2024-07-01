import { TestBed } from '@angular/core/testing';

import { ErrortrackerService } from './errortracker.service';

describe('ErrortrackerService', () => {
  let service: ErrortrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrortrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
