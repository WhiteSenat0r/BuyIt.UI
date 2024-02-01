import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {AccountService} from "../account.service";
import {Router} from "@angular/router";
import {BasketService} from "../../../components/features/basket/basket.service";

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
      Validators.pattern('((\\+380)?\\(?\\d{2}\\)?[\\s.-]?\\d{7}|\\d{3}[\\s.-]\\d{2}[\\s.-]\\d{2}|\\d{3}-\\d{4})')]),
    email: new FormControl('', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$')]),
    password: new FormControl('', Validators.required)
  })

  responseMessage: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  errors: BehaviorSubject<string[] | null> = new BehaviorSubject<string[] | null>(null);

  constructor(private accountService: AccountService, private router: Router,
              private basketService: BasketService) {
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
    this.accountService.register(this.registrationForm.value).subscribe({
      next: user => {

      },
      error: err => {
        if (err.errors.length > 0) {
          this.errors.next(err.errors);
          return;
        }

        this.responseMessage.next(err.responseMessage);
      }
    })
  }
}
