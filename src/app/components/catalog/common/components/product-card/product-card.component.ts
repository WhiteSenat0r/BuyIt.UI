import {Component, Input} from '@angular/core';
import {GeneralizedProduct} from "../../../../../modules/shared/models/generalized-product";

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html'
})

export class ProductCardComponent {
  @Input() product!: GeneralizedProduct;

  getProductUrlCategory() : string {
    return this.pluralizeWord(
      this.product.category.toLowerCase().replaceAll(' ', '_'));
  }

  pluralizeWord(word: string): string {
    const pluralRules: [RegExp, string][] = [
      [/s$/, 's'],
      [/(ch|sh|ss|x)$/, '$1es'],
      [/(ay|ey|oy|uy)$/, '$1s'],
      [/(y)$/, 'ies'],
    ];

    for (const [rule, replacement] of pluralRules) {
      if (rule.test(word)) {
        return word.replace(rule, replacement);
      }
    }

    return word + 's';
  }
}
