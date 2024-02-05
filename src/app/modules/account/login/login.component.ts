import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../services/account.service";
import {Router} from "@angular/router";
import {BasketService} from "../../../components/features/basket/basket.service";
import {BehaviorSubject} from "rxjs";
import {Guid} from "guid-typescript";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$')]),
    password: new FormControl('', Validators.required)
  })

  responseMessage: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

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
    this.accountService.login(this.loginForm.value).subscribe({
      next: user =>{
        this.synchronizeUserBasket();

        this.router.navigateByUrl('/');
      },
      error: err => {
        this.responseMessage.next(err.responseMessage);
      }
    })
  }

  private synchronizeUserBasket() {
    this.accountService.currentUserSource$.subscribe({
      next: user => {
        if (user && localStorage.getItem('basketId') !== null && (user.basketId == null || user.basketId != null)) {
          this.basketService.synchronizeBasketWithUser().subscribe({
            next: value => {
              this.basketService.getBasket(localStorage.getItem('basketId')!)
                .subscribe({
                  next: value => {
                    this.basketService.basketSource.next(value);
                  }
                });
            }
          });
        }
        else if (user && localStorage.getItem('basketId') == null && user.basketId !== null) {
          localStorage.setItem('basketId', user.basketId);
          this.basketService.getBasket(localStorage.getItem('basketId')!)
            .subscribe({
              next: value => {
                this.basketService.basketSource.next(value);
              }
          });
        }
        else if (user && localStorage.getItem('basketId') == null && user.basketId == null) {
          localStorage.setItem('basketId', Guid.create().toString())
          this.basketService.getBasket(localStorage.getItem('basketId')!)
            .subscribe({
              next: value => {
                this.basketService.basketSource.next(value);
              },
              complete: () => this.basketService.synchronizeBasketWithUser().subscribe()
            });
        }
      }
    });
  }
}
