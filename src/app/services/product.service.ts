import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface IProduct{
  title: string;
  description: string;
  category: string;
  cost: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  product: IProduct = {} as any;
  private cart = 0;
  cartItems$ = new Subject();

  constructor() { }

  saveProduct(data: IProduct){
    this.product = data;
  }

  addToCart(){
    this.cart += 1;
    this.cartItems$.next(this.cart);
  }

  narrateText(){

  }
}
