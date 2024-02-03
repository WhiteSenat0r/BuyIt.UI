import {Component, OnInit} from '@angular/core';
import {BasketService} from "./components/features/basket/basket.service";
import {AccountService} from "./modules/account/account.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BuyIt.UI';

  constructor(private basketService: BasketService, private accountService: AccountService) {}

  ngOnInit() {
    this.accountService.tryAuthenticate();
    this.tryGetBasket();
  }

  private tryGetBasket() {
    const storageBasketId = localStorage.getItem('basketId');

    if (storageBasketId !== null) {
      this.basketService.getBasket(storageBasketId).subscribe({
        next: value => {
          this.basketService.basketSource.next(value);
        }
      });
    }
  }
}

