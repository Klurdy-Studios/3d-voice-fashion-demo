import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
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
export class AppComponent implements AfterViewInit{
  title = '3D Voice Demo';
  mode='view';
  cartItems$;
  ideas: string[] = [];

  @ViewChild('canvas') 
  private canvasRef!: ElementRef;
  
  form: FormGroup;

  constructor(
    fb: FormBuilder,
    private productService: ProductService,
    private nlpService: NlpService,
    private threeService: ThreedService
  ){
    this.form = fb.group({
      title: ['Running Shoe', Validators.required],
      description: ['A unisex sports shoe ideal for running', Validators.required],
      category: ['shoe', Validators.required],
      model: ['', Validators.required]
    });

    this.cartItems$ = this.productService.cart;
  }

  ngAfterViewInit(): void {
    this.threeService.init(this.canvasRef.nativeElement);
  }

  async genIdeas(){
    const description = this.form.get('description')?.value;
    this.ideas = await this.nlpService.generateText(description)
  }

  save(){
    if(this.form.valid){
      this.productService.saveProduct(this.form.value);
    }
  }

  selectIdea(e: any){
    this.form.patchValue({ description: e.target.value })
  }
}
