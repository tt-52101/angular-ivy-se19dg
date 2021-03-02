import { Injectable, EventEmitter } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class UserInfoService {
  constructor(private http: _HttpClient) {}
}
