import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../account.service';
import { NzMessageService,  } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema, FormProperty, PropertyGroup, SFObjectWidgetSchema } from '@delon/form';
import { I18NService } from '@core';
import { zip, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.less'],
})
export class ForgetPasswordComponent implements OnInit {
  
  public schema: SFSchema = {
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
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.public.otp')}),
          i18n: 'app.public.otp',
          widget: 'otp',
          config: {
            reqMethod: 'POST',
            reqUrl: '/captcha/send',
            hadAreaCode: true,
            tragetKey: 'type'
          },
          grid: {
            span:24
          },
          errors: {
            pattern: this.i18n.fanyi('app.form.vaild.pattern.otp')
          }
        },
      },
      password: {
        type: 'string',
        title: 'password',
        pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$',
        ui: {
          i18n: 'app.user.new_password',
          type: 'password',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.user.new_password')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.vaild.pattern.password'),
          },
          grid: {
            span:24
          },
        },
      },
      confirmPassword: {
        type: 'string',
        title: 'Confirm new password',
        pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,16})$',
        ui: {
          i18n: 'app.user.confirm_new_password',
          type: 'password',
          placeholder: this.i18n.fanyi('app.action.input', {name: this.i18n.fanyi('app.user.confirm_new_password')}),
          errors: {
            pattern: this.i18n.fanyi('app.form.vaild.pattern.password'),
          },
          grid: {
            span:24
          },
          validator: (value: any, formProperty: FormProperty, form: PropertyGroup) => {
            return form.value && form.value.newPassword === value
              ? []
              : [{ keyword: 'required', message: 'app.form.vaild.diff.password' }];
          },
        },
      },
    },
    ui: {
      grid: { 
        span: 12, 
        gutter: 16 
      },
    } as SFObjectWidgetSchema,
    required: ['type', 'vcode', 'password', 'confirmPassword'],
  };

  constructor(
    public i18n: I18NService,
    public http: _HttpClient,
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private modal: NzModalService
  ) { }

  onSubmit(formValue) {
    this.accountService.forGetPassword(formValue).subscribe(
      payload => {
        this.modal.success({
          nzTitle: this.i18n.fanyi('app.forget_password.successful'),
          nzContent: this.i18n.fanyi('app.forget_password.successful_tips'),
          nzMaskClosable: false,
          nzOnOk: () => {
            this.router.navigate(['/sign-in']);
          },
        });
      },
      err => { },
    );
  }

  ngOnInit() { 
    
  }

  
}
