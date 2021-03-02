import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponseBase, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

const CODEMESSAGE = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }


  private formatMessage(body) {
    body.message = body.payload ? body.payload[0].message : body.message;
    return body;
  }

  private checkStatus(ev: HttpResponseBase) {
    if (ev instanceof HttpErrorResponse) {
      /**
       * 密码过期无需弹窗
       */
      if (ev.error.code === 'ACCOUNT_CREDENTIALS_EXPIRED') {
        return;
      }
      const errortext = ev.error.message || CODEMESSAGE[ev.status] || CODEMESSAGE[ev.error.status] || ev.statusText;
      if (!errortext) return;

      // this.notification.error(``, errortext);
      this.notification.error(`Request error `, errortext);
    }
  }

  private handleData(ev: HttpResponseBase): Observable<any> {

     // 资源文件不经过拦截器
     if (ev.url && ev.url.indexOf('assets') > -1) {
      return of(ev);
    }

    // 处理导出接口；
     if (ev.url.indexOf('export') > -1 && ev instanceof HttpResponse) {
      return of(ev);
    }

    // 可能会因为 `throw` 导出无法执行 `_HttpClient` 的 `end()` 操作
     if (ev.status > 0) {
      this.injector.get(_HttpClient).end();
    }

     this.checkStatus(ev);

    //  处理http错误的状态吗
     if (ev instanceof HttpErrorResponse) {
      if (ev.status === 504 || ev.status === 404 || ev.status === 403 || ev.status === 500) {
        this.goTo(`/exception/${ev.status}`);
      }
      if (ev.status === 401) {
        this.goTo('/sign-in');
      }
      return throwError(new HttpErrorResponse(ev));
    }

    //  处理业务状态码
     if (ev instanceof HttpResponse) {
      const body: any = ev.body;
      // 成功
      if (body.status === 200) {
        return of(new HttpResponse(Object.assign(ev, { body: body.payload })));
      }

      // 未登录或token失效
      if (body.status === 401) {
        // 清空 token 信息
        (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();

        // 密码失效，跳转至重置密码
        if (body.code === 'ACCOUNT_CREDENTIALS_EXPIRED') {
          this.goTo('/reset-password');
        } else {
          this.goTo('/sign-in');
        }

        return throwError(new HttpErrorResponse(Object.assign(ev, { error: this.formatMessage(body) })));
      }

      // 未授权
      if (body.status === 403) {
        this.goTo('/exception/403');
        return throwError(new HttpErrorResponse(Object.assign(ev, { error: this.formatMessage(body) })));
      }

      // 业务错误
      if (body.status === 504 || body.status === 404 || body.status === 500) {
        return throwError(new HttpErrorResponse(Object.assign(ev, { error: this.formatMessage(body) })));
      }
    }

    console.log(ev)

     return of(ev);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://') && !url.includes('./assets')) {
      url = environment.SERVER_URL + url;
    }

    const newReq = req.clone({ url });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponseBase) {
          return this.handleData(event);
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
