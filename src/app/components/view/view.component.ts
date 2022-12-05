import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NlpService } from 'src/app/services/nlp.service';
import { ProductService } from 'src/app/services/product.service';
import { ThreedService } from 'src/app/services/threed.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas') 
  private canvasRef!: ElementRef;

  @ViewChild('transcribe') 
  private transcribeRef!: ElementRef;

  transcription: string = 'Try something like: Hey Demo, I want to see another variation';
  
  constructor(    
    private nlpService: NlpService,
    private threeService: ThreedService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.handleVoiceInteractions();
  }

  ngAfterViewInit(): void {
    this.threeService.init(this.canvasRef.nativeElement);
    this.nlpService.speechToText(this.transcribeRef.nativeElement);
  }

  handleVoiceInteractions(){
    this.nlpService.utterances$.subscribe(async (utterance) => {
      const intent = await this.nlpService.classifyText([utterance]);
      console.log(intent)

      switch(intent){
        case 'switch_material':
          this.threeService.switchMaterial();
          break;
        case 'add_to_cart':
          this.productService.addToCart();
          break;
        default:
          break;
      }
    });
  }

}
