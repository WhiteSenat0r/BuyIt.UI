import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../login/common/components/login.service";
import {EmailService} from "../services/email.service";
import {CredentialsService} from "../services/credentials.service";

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html'
})
export class EmailVerificationComponent {
  constructor(private loginService: LoginService, private emailService: EmailService,
              private credentialsService: CredentialsService,
              private router: Router, private route: ActivatedRoute) {
    let addressParam = this.route.snapshot.queryParamMap.get('address');
    let tokenParam = this.route.snapshot.queryParamMap.get('token');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;

    if (addressParam && emailRegex.test(addressParam) && tokenParam) {
      this.credentialsService.verifyEmail(tokenParam, addressParam).subscribe({
        next: value => {
          if (value) {
            this.emailService.sendEmailSuccessfulVerificationLetter(addressParam!).subscribe();
            this.loginService.emailConfirmationSource.next(true);
            this.router.navigateByUrl('/account/login');
          }
        },
        error: err => {
          this.router.navigateByUrl('/');
        }
      });
    }
    else {
      this.router.navigateByUrl('/');
    }
  }
}
