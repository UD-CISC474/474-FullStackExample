import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [HttpClientModule]});
    
    service = TestBed.inject(LoginService);
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
