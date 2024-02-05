import { Component } from '@angular/core';
import {AccountService} from "../services/account.service";
import {BasketService} from "../../../components/features/basket/basket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account-data',
  templateUrl: './account-data.component.html'
})

export class AccountDataComponent {
  constructor(public accountService: AccountService,
              private basketService: BasketService,
              private router: Router) {
    this.accountService.tryAuthenticate();

    this.accountService.currentUserSource$.subscribe({
      next: user => {
        if (!user) {
          this.router.navigateByUrl('/');
        }
      }
    });
  }

  logout() {
    localStorage.removeItem('basketId');
    this.basketService.basketSource.next(null);
    this.basketService.isAddedToBasketSources = {};

    this.accountService.logout();

    this.router.navigateByUrl('/');
  }
}
