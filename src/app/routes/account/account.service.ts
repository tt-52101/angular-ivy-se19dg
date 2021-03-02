import { BaseApi, BaseUrl, GET, POST, Body } from '@delon/theme';
import { Observable } from 'rxjs/Observable';
import { Injectable } from "@angular/core";

@Injectable()
export class AccountService extends BaseApi {
  /**
   * GetMe
   */
  @GET('v1/member/me')
  getMe(): Observable<any> {
    return;
  }

  /**
   * SignUp
   */
  @POST('user/registration')
  signUp(@Body payload: Object): Observable<any> {
    return;
  }

  /**
   * SignIn
   */
  @POST('auth/login')
  signIn(@Body payload: Object): Observable<any> {
    return;
  }

  /**
   * forGetPassword
   */
  @POST('user/password/forget')
  forGetPassword(@Body payload: Object): Observable<any> {
    return;
  }

  /**
   * sendOtp
   */
  @POST('open/bmp/captcha/send')
  sendOtp(@Body payload: Object): Observable<any> {
    return;
  }

  /**
   * resetPassword
   */
  @POST('user/password/raw')
  resetPassword(@Body payload: Object): Observable<any> {
    return;
  }
}
