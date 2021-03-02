import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        component: SignInComponent,
        data: {
            title: '登录',
            titleI18n: 'app.action.sign_in'
        },
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        data: {
            title: '注册',
            titleI18n: 'app.action.sign_up'
        },
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        data: {
            title: '忘记密码',
            titleI18n: 'app.action.forget_password'
        },
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        data: {
            title: '重置密码',
            titleI18n: 'app.action.reset_password'
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
