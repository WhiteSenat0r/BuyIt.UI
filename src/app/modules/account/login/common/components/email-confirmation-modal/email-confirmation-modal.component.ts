import { Component } from '@angular/core';
import {loginModalBackgroundAnimation, loginModalWindowAnimation} from "../login-modal.animations";
import {LoginService} from "../login.service";

@Component({
  selector: 'app-email-confirmation-modal',
  templateUrl: './email-confirmation-modal.component.html',
  animations: [loginModalWindowAnimation, loginModalBackgroundAnimation]
})
export class EmailConfirmationModalComponent {
  constructor(public loginService: LoginService) {
  }

  toggleModal() {
    this.loginService.emailConfirmationSource.next(null);
  }
}
