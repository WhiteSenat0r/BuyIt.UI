import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {AccountService} from "../services/account.service";
import {Router} from "@angular/router";
import {RegisterService} from "./common/components/register.service";
import {EmailService} from "../services/email.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registrationForm = new FormGroup({
    firstName: new FormControl('', [Validators.required,
      Validators.minLength(1), Validators.maxLength(64)]),
    middleName: new FormControl('', [Validators.required,
      Validators.minLength(1), Validators.maxLength(64)]),
    lastName: new FormControl('', [Validators.required,
      Validators.minLength(1), Validators.maxLength(64)]),
    phoneNumber: new FormControl('', [Validators.required,
      Validators.pattern(
        '((\\+380)?\\(?\\d{2}\\)?[\\s.-]?\\d{7}|\\d{3}[\\s.-]\\d{2}[\\s.-]\\d{2}|\\d{3}-\\d{4})')]),
    email: new FormControl('', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$')]),
    password: new FormControl('', Validators.required)
  })

  responseMessageSource: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  errors: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);

  constructor(private accountService: AccountService, private router: Router,
              public registerService: RegisterService, private emailService: EmailService) {
    this.accountService.currentUserSource$.subscribe(
      {
        next: user => {
          if (user !== null) {
            this.router.navigateByUrl('/');
          }
        }
      });
  }

  onSubmit() {
    this.responseMessageSource.next(null);
    this.errors.next(null);

    this.accountService.register(this.registrationForm.value).subscribe({
      next: user => {
        if (user) {
          this.emailService.sendEmailConfirmationLetter(
            this.registrationForm.controls['email'].value!).subscribe();
          this.registerService.registrationSource.next(true);
          this.registerService.emailSource.next(this.registrationForm.controls['email'].value);
        }
      },
      error: err => {
        if (err.errors !== null) {
          this.errors.next(err.errors);
          return;
        }

        this.responseMessageSource.next(err.responseMessage);
      },
    });
  }
}
