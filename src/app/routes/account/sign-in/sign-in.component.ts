import { Component, OnInit, OnDestroy, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { flyIn } from '@animations/flyIn';
import { SFComponent, SFObjectWidgetSchema, SFSchema } from '@delon/form';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../account.service';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { StartupService } from '@core';
import { _HttpClient } from '@delon/theme';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { I18NService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less'],
  animations: [flyIn],
})
export class SignInComponent implements OnInit, AfterViewInit {

  @ViewChild('pwdSf') pwdSf: SFComponent;

  @ViewChild('otpSf') otpSf: SFComponent;

  public modeIndex;

  public default;

  public pwdSchema: SFSchema = {
      properties: {
        type: {
          type: 'string',
          title: 'type',
          ui: {
            widget: 'radio',
            i18n: 'app.public.type',
            grid: {
              span:19
            },
            change: (value)=> {
              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: {
                  ...this.activatedRoute.snapshot.queryParams,
                  type: value
                }}
              );
            },
            asyncData: () =>
              of([
                { value: 'username', label: this.i18n.fanyi('app.user.username') },
                { value: 'email', label: this.i18n.fanyi('app.user.email')},
                { value: 'cellphone', label: this.i18n.fanyi('app.user.cellphone') },
            ]),
          },
          default: 'username',
        },
        areaCode: {
          type: 'string',
          title: 'areaCode',
          default: '86',
          ui: {
            grid: {
              span:8
            },
            widget: 'select',
            i18n: 'app.public.area_code',
            placeholder: this.i18n.fanyi('app.public.area_code'),
            visibleIf: { type: ['cellphone'] },
            showRequired: true,
            validator: val => (!val ? [{ keyword: 'required', message: this.i18n.fanyi('app.form.required', {name: this.i18n.fanyi('app.user.cellphone')})}] : []),
            asyncData: () =>
              zip(this.http.get(`./assets/tmp/regions/${this.i18n.currentLang}.json`), this.http.get(`./assets/tmp/areaCode.json`)).pipe(map(([regionRes, areaCodeRes])=> {
                return regionRes.map(item=> {
                  return {
                    label: item.name + `+${areaCodeRes[item.alpha2.toUpperCase()]}`,
                    value: areaCodeRes[item.alpha2.toUpperCase()]
                  }
                }).filter(item=> item.value);
              }))
          },
        },
        cellphone: {
          type: 'string',
          title: 'cellphone',
          pattern: '^\\d{6,}$',
          ui: {
            grid: {
              span:16
            },
            i18n: 'app.user.cellphone',
            placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.user.cellphone')}),
            visibleIf: { type: ['cellphone'] },
            showRequired: true,
            validator: val => (!val ? [{ keyword: 'required', message: this.i18n.fanyi('app.form.required', {name: this.i18n.fanyi('app.user.cellphone')})}] : []),
            errors: {
              pattern: this.i18n.fanyi('app.form.vaild.pattern.cellphone'),
            }
          },
        },
        username: {
          type: 'string',
          title: 'Username',
          ui: {
            i18n: 'app.user.username',
            placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.user.username')}),
            visibleIf: { type: ['username'] },
            showRequired: true,
            validator: val => (!val ? [{ keyword: 'required', message: this.i18n.fanyi('app.form.required', {name: this.i18n.fanyi('app.user.username')}) }] : []),
            grid: {
              span: 24
            },
          },
        },
        email: {
          type: 'string',
          title: 'Email',
          pattern: '^([A-Za-z0-9_\\-\\.\u4e00-\u9fa5])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,8})$',
          ui: {
            i18n: 'app.user.email',
            placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.user.email')}),
            visibleIf: { type: ['email'] },
            showRequired: true,
            validator: val => (!val ? [{ keyword: 'required', message: this.i18n.fanyi('app.form.required', {name: this.i18n.fanyi('app.user.email')}) }] : []),
            grid: {
              span:24
            },
            errors: {
              pattern: this.i18n.fanyi('app.form.vaild.pattern.email'),
            }
          },
        },
        password: {
          type: 'string',
          title: 'Password',
          pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$',
          ui: {
            i18n: 'app.user.password',
            placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.user.password')}),
            type: 'password',
            grid: {
              span:24
            },
            errors: {
              pattern: this.i18n.fanyi('app.form.vaild.pattern.password'),
            }
          },
        }
      },
      ui: {
        grid: { 
          span: 12, 
          gutter: 16 
        },
      } as SFObjectWidgetSchema,
      required: ['type', 'password'],
  };

  public otpSchema: SFSchema = {
      properties: {
        type: {
          type: 'string',
          title: 'type',
          ui: {
            widget: 'radio',
            i18n: 'app.public.type',
            grid: {
              span: 24
            },
            change: (value)=> {
              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: {
                  ...this.activatedRoute.snapshot.queryParams,
                  type: value
                }}
              );
            },
            asyncData: () =>
              of([
                { value: 'email', label: this.i18n.fanyi('app.user.email')},
                { value: 'cellphone', label: this.i18n.fanyi('app.user.cellphone') },
            ]),
          },
          default: 'email',
        },
        areaCode: {
          type: 'string',
          title: 'areaCode',
          default: '86',
          ui: {
            grid: {
              span:8
            },
            widget: 'select',
            i18n: 'app.public.area_code',
            placeholder: this.i18n.fanyi('app.public.area_code'),
            visibleIf: { type: ['cellphone'] },
            showRequired: true,
            validator: val => (!val ? [{ keyword: 'required', message: this.i18n.fanyi('app.form.required', {name: this.i18n.fanyi('app.user.cellphone')})}] : []),
            asyncData: () =>
              zip(this.http.get(`./assets/tmp/regions/${this.i18n.currentLang}.json`), this.http.get(`./assets/tmp/areaCode.json`)).pipe(map(([regionRes, areaCodeRes])=> {
                return regionRes.map(item=> {
                  return {
                    label: item.name + `+${areaCodeRes[item.alpha2.toUpperCase()]}`,
                    value: areaCodeRes[item.alpha2.toUpperCase()]
                  }
                }).filter(item=> item.value);
              }))
          },
        },
        cellphone: {
          type: 'string',
          title: 'cellphone',
          pattern: '^\\d{6,}$',
          ui: {
            grid: {
              span:16
            },
            i18n: 'app.user.cellphone',
            placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.user.cellphone')}),
            visibleIf: { type: ['cellphone'] },
            showRequired: true,
            validator: val => (!val ? [{ keyword: 'required', message: this.i18n.fanyi('app.form.required', {name: this.i18n.fanyi('app.user.cellphone')})}] : []),
            errors: {
              pattern: this.i18n.fanyi('app.form.vaild.pattern.cellphone'),
            }
          },
        },
        email: {
          type: 'string',
          title: 'Email', 
          pattern: '^([A-Za-z0-9_\\-\\.\u4e00-\u9fa5])+\\@([A-Za-z0-9_\\-\\.])+\\.([A-Za-z]{2,8})$',
          ui: {
            i18n: 'app.user.email',
            placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.user.email')}),
            visibleIf: { type: ['email'] },
            showRequired: true,
            validator: val => (!val ? [
              { keyword: 'required', message: this.i18n.fanyi('app.form.required', {name: this.i18n.fanyi('app.user.email')}) },
              { keyword: 'pattern', message: this.i18n.fanyi('app.form.required', {name: this.i18n.fanyi('app.user.email')}) },
            ] : []),
            grid: {
              span:24
            },
            errors: {
              pattern: this.i18n.fanyi('app.form.vaild.pattern.email'),
            }
          },
        },
        vcode: {
          type: 'string',
          title: 'Otp',
          pattern: '^\\d{6,8}$',
          ui: {
            widget: 'otp',
            config: {
              reqMethod: 'POST',
              reqUrl: '/captcha/send',
              hadAreaCode: true,
              tragetKey: 'type'
            },
            i18n: 'app.public.otp',
            placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.public.otp')}),
            grid: {
              span:24
            },
            errors: {
              pattern: this.i18n.fanyi('app.form.vaild.pattern.otp'),
            }
          },
        }
      },
      required: ['type', 'vcode'],
      ui: {
        grid: { 
          span: 12, 
          gutter: 16 
        },
      } as SFObjectWidgetSchema,
  };


  /**
   * 切换登录模式
   * @param tabIndex 
   */
  handleModeChange(tabIndex) {
    this.modeIndex = tabIndex; 

    const _type = this.activatedRoute.snapshot.queryParamMap.get('type');
    if (this.modeIndex == 1 && _type === 'username') {
      this.otpSf.setValue('/type', 'email');
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        mode: tabIndex
      }}
    );
  }

  /**
   * 登录
   * @param formValue
   */
  onSubmit(formValue) {
    let payload = {
      ...formValue
    }
    switch (formValue.type){
      case 'cellphone':
        payload['username'] = formValue.areaCode + formValue.cellphone
        break;
      case 'email':
        payload['username'] = formValue.email
        break;
      default:
        break;
    }
    this.accountService.signIn(payload).subscribe(
      response => {
        this.tokenService.set(response);

        this.reuseTabService.clear();

        this.startupSrv.load().then(() => {
          let url = this.tokenService.referrer!.url || '/dashboard';
          if (url.includes('/passport')) url = '/';
          this.router.navigateByUrl(url);
        });
      },
      err => {},
    );
  }

  constructor(
    private i18n: I18NService,
    public http: _HttpClient,
    private reuseTabService: ReuseTabService,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private startupSrv: StartupService,
    private modalSrv: NzModalService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    modalSrv.closeAll();
  }

  ngOnInit() {
    this.modeIndex = parseInt(this.activatedRoute.snapshot.queryParamMap.get('mode'), 10) || 0;
    const _type = this.activatedRoute.snapshot.queryParamMap.get('type');
    this.default = {
      type: this.modeIndex === 0 ? _type : _type === 'username'?'email': _type
    }
  }

  ngAfterViewInit() { 
  }
}
