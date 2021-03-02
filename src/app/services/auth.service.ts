import { Injectable, EventEmitter, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { _HttpClient, BaseApi, BaseUrl, GET } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService extends BaseApi {
  constructor(
    public injector: Injector,
    private http: _HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    super(injector);
  }

  async signOut(isLogout?) {
    try {
      if (isLogout) {
        await this.http.post('/v1/auth/logout').toPromise();
      }
      this.injector.get(Router).navigateByUrl(this.tokenService.login_url);
      this.tokenService.clear();
    } catch (error) {}
  }

  @GET('v1/auth/refreshToken')
  refreshTokenHttp(): Observable<any> {
    return;
  }

  refreshToken() {
    return new Promise((resolve, reject) => {
      this.refreshTokenHttp().subscribe(payload => {
        this.tokenService.set(payload);
        resolve(true);
      });
    });
  }
}
