import { Component } from '@angular/core';
import {AccountService} from "../account.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoginService} from "../login/common/components/login.service";

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html'
})
export class EmailVerificationComponent {
  constructor(private accountService: AccountService, private loginService: LoginService,
              private router: Router, private route: ActivatedRoute) {
    let addressParam = this.route.snapshot.queryParamMap.get('address');
    let tokenParam = this.route.snapshot.queryParamMap.get('token');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;

    if (addressParam && emailRegex.test(addressParam) && tokenParam) {
      this.accountService.verifyEmail(tokenParam, addressParam).subscribe({
        next: value => {
          if (value) {
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
