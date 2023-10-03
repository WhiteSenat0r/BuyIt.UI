import {Component, Input} from '@angular/core';
import {GeneralizedProduct} from "../../modules/shared/models/generalized-product";


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})

export class ProductCardComponent {
  @Input() product!: GeneralizedProduct;
  @Input() url!: string;
}
