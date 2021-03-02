import { Component, OnInit, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { SFSchema, FormProperty, PropertyGroup } from '@delon/form';
import { AccountService } from '../account.service';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { StartupService } from '@core';
import { _HttpClient } from '@delon/theme';
import { NzModalService } from 'ng-zorro-antd/modal';
import { flyIn } from '@animations/flyIn';
import { I18NService } from '@core';
import { String } from 'typescript-string-operations';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less'],
  animations: [flyIn],
})
export class ResetPasswordComponent implements OnInit {
  public schema: SFSchema = {
    properties: {
      username: {
        title: 'Username / Email',
        type: 'string',
        ui: {
          placeholder: 'Please fill  Username / Email',
          errors: {
            required: String.Format(this.i18n.fanyi('verification.base.required'), 'Username / Email'),
          },
        },
      },
      rawPassword: {
        title: 'Old password',
        type: 'string',
        ui: {
          type: 'password',
          placeholder: 'Please fill old passowrd',
          errors: {
            required: String.Format(this.i18n.fanyi('verification.base.required'), 'Old password'),
          },
        },
      },
      password: {
        title: 'New password',
        type: 'string',
        pattern: '^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,16}$',
        ui: {
          placeholder: 'Please fill new password',
          type: 'password',
          errors: {
            required: String.Format(this.i18n.fanyi('verification.base.required'), 'New password'),
            pattern:
              'Please enter a 6-16-digit password. It must contain capital letters, lowercase letters and special characters.',
          },
          validator: (value: any, formProperty: FormProperty, form: PropertyGroup) => {
            return form.value && form.value.rawPassword !== value
              ? []
              : [{ keyword: 'required', message: 'The new password does not match the old password.' }];
          },
        },
      },
      newPassword: {
        title: 'Confim new password',
        type: 'string',
        pattern: '^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\\d]){1,})(?=(.*[\\W]){1,})(?!.*\\s).{8,16}$',
        ui: {
          type: 'password',
          placeholder: 'Please fill confim the new password',
          errors: {
            required: String.Format(this.i18n.fanyi('verification.base.required'), 'Confim new password'),
            pattern:
              'Please enter a 6-16-digit password. It must contain capital letters, lowercase letters and special characters.',
          },
          validator: (value: any, formProperty: FormProperty, form: PropertyGroup) => {
            return form.value && form.value.password === value
              ? []
              : [{ keyword: 'required', message: 'Inconsistent passwords' }];
          },
        },
      },
    },
    required: ['username', 'rawPassword', 'password', 'newPassword'],
    ui: {},
  };

  // submit form
  async onSubmit(formValue) {
    this.accountService.resetPassword(formValue).subscribe(
      res => {
        this.modal.success({
          nzTitle: 'Successful password reset',
          nzContent: 'Log in immediately after clicking on confirmation',
          nzOnOk: () => {
            this.router.navigate(['/sign-in']);
          },
        });
      },
      err => { },
    );
  }

  constructor(
    private i18n: I18NService,
    private modal: NzModalService,
    public http: _HttpClient,
    private reuseTabService: ReuseTabService,
    private router: Router,
    private accountService: AccountService,
    private startupSrv: StartupService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }

  ngOnInit() { }
}
