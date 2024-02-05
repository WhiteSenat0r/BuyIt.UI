import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {ProductList} from "../common/models/product-list";
import {BasketItem} from "../common/models/basket-item";
import {HttpClient} from "@angular/common/http";
import {GeneralizedProduct} from "../../../modules/shared/models/generalized-product";
import {Product} from "../../../modules/shared/models/product";
import {AccountService} from "../../../modules/account/services/account.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../../modules/account/services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl: string = environment.apiUrl;
  basketSource: BehaviorSubject<ProductList<BasketItem>| null> =
    new BehaviorSubject<ProductList<BasketItem> | null>(null);
  isAddedToBasketSources: Record<string, BehaviorSubject<boolean>> = {};

  constructor(private http: HttpClient, private authService: AuthenticationService, private accountService: AccountService) { }

  getBasket(id: string) {
    return this.http.get<ProductList<BasketItem>>(this.baseUrl + "Basket/?listid=" + id);
  }

  setBasket(basket: ProductList<BasketItem>) {
    return this.http.post<ProductList<BasketItem>>(
      this.baseUrl + "Basket/CreateOrUpdate", basket, { withCredentials: true })
      .subscribe({
        next: basket => this.basketSource.next(basket)
      });
  }

  deleteBasket(id: string) {
    return this.http.delete(this.baseUrl + "Basket/Delete?listid=" + id,
      { responseType: 'text' })
      .subscribe({
        next: () => {
          this.basketSource.next(null);
          localStorage.removeItem('basketId')
        },
        error: error => {
          console.error('Failed to delete basket:', error);
        }
      });
  }

  getBasketValue() {
    return this.basketSource.value;
  }

  getBasketBadgeCount(items: BasketItem[] | undefined): string {
    if (!items) return '0';

    let result: number = items.reduce((totalItemsQuantity, item) =>
      totalItemsQuantity + item.quantity, 0);

    if (result > 9) return '9+';

    return result.toString();
  }

  getItemsCount(items: BasketItem[] | undefined): number {
    if (!items) return 0;

    return items.reduce((totalItemsQuantity, item) =>
      totalItemsQuantity + item.quantity, 0);
  }

  addItemToBasket(item: GeneralizedProduct | Product, quantity = 1) {
    const addedItem = this.mapProductToBasketItem(item);
    const basket = this.getBasketValue() ?? this.createNewBasket();

    basket.items = this.addOrUpdateItem(basket.items, addedItem, quantity);
    this.setBasket(basket);
  }

  isAddedToBasket$(productCode: string) {
    if (!this.isAddedToBasketSources[productCode]) {
      this.isAddedToBasketSources[productCode] = new BehaviorSubject<boolean>(false);
    }
    return this.isAddedToBasketSources[productCode];
  }

  setAddedToBasketStatus(productCode: string, status: boolean) {
    if (!this.isAddedToBasketSources[productCode]) {
      this.isAddedToBasketSources[productCode] = new BehaviorSubject<boolean>(false);
    }
    this.isAddedToBasketSources[productCode].next(status);
  }

  getTotalBasketPrice(items: BasketItem[] | undefined): number {
    if (!items) return 0;

    const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return Number(total.toFixed(3));
  }

  synchronizeBasketWithUser() {
    return this.http.put<any>(
      this.baseUrl + "Basket/SynchronizeList?listId=" + this.basketSource.value?.id! + "&listType=BASKET",
      null, { withCredentials: true })
  }

  private mapProductToBasketItem(product: GeneralizedProduct | Product): BasketItem {
    return {
      name: product.name,
      category: product.category,
      price: product.price,
      productCode: product.productCode,
      imageUrl: product.images[0],
      quantity: 0
    }
  }

  private createNewBasket(): ProductList<BasketItem> {
    const basket = new ProductList<BasketItem>();

    this.accountService.currentUserSource$.subscribe({
      next: user => {
        if (user && user.basketId) {
          basket.id = user!.basketId;
        }
      }
    });

    localStorage.setItem('basketId', basket.id);

    return basket;
  }

  private addOrUpdateItem(items: BasketItem[], addedItem: BasketItem, quantity: number) {
    const searchedItem = items.find(i => i.productCode == addedItem.productCode)

    if (searchedItem) {
      searchedItem.quantity += quantity;
    }
    else {
      addedItem.quantity = quantity;
      items.push(addedItem);
    }

    return items;
  }
}
