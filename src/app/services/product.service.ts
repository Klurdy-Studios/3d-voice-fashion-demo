import { Injectable } from '@angular/core';

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
  cart = 0

  constructor() { }

  saveProduct(data: IProduct){
    this.product = data;
  }

  addToCart(){
    this.cart += 1
  }

  narrateText(){

  }
}
