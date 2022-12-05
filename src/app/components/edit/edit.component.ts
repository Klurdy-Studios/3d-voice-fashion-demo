import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NlpService } from 'src/app/services/nlp.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  ideas: string[] = [];
  form: FormGroup;

  constructor(    
    fb: FormBuilder,
    private productService: ProductService,
    private nlpService: NlpService,
  ) { 
    this.form = fb.group({
      title: ['Running Shoe', Validators.required],
      description: ['A unisex sports shoe ideal for running', Validators.required],
      category: ['shoe', Validators.required],
      model: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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
