import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NlpService } from './services/nlp.service';
import { ProductService } from './services/product.service';
import { ThreedService } from './services/threed.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = '3D Voice Demo';
  mode='view';
  cartItems$ = 0 ;
  constructor(private productService: ProductService){ }

  ngOnInit(): void {
    this.productService.cartItems$.subscribe((cart: any) => {
      this.cartItems$ = cart;
    });
  }

  
}
