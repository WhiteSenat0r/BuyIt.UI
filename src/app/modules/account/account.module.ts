import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {AccountRoutingModule} from "./account-routing.module";
import {SharedModule} from "../shared/shared.module";
import { AccountDataComponent } from './account-data/account-data.component';
import { RegisterSuccessModalComponent } from './register/common/components/register-success-modal/register-success-modal.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { EmailConfirmationModalComponent } from './login/common/components/email-confirmation-modal/email-confirmation-modal.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AccountDataComponent,
    RegisterSuccessModalComponent,
    EmailVerificationComponent,
    EmailConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }
