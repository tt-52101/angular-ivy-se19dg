import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AccountService } from './account.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AccountComponent } from './account.component';
import { AccountRoutingModule } from './account-routing.module';

const COMPONENTS = [SignInComponent, SignUpComponent, AccountComponent, ForgetPasswordComponent, ResetPasswordComponent];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, AccountRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
  providers: [AccountService],
})
export class AccountModule {}
