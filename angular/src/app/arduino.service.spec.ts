import { TestBed } from '@angular/core/testing';

import { ArduinoService } from './arduino.service';

describe('ArduinoServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArduinoService = TestBed.get(ArduinoService);
    expect(service).toBeTruthy();
  });
});
