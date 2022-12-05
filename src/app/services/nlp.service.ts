import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const cohere = require('cohere-ai');
import { Subject } from "rxjs";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
// Intiatilize an instance of SpeechRecognition from the Web-Speech-API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

@Injectable({
  providedIn: 'root'
})
export class NlpService {
  // Set your wake word
  WAKE_WORD = ["demo"];
  utterances$ = new Subject();
  
  utterances = [
    { text: 'Next one', label: 'switch_material'},
    { text: 'Show me a different variation', label: 'switch_material'},
    { text: 'This is not the color I want. do you have others?', label: 'switch_material'},
    { text: 'Add this item to the cart', label: 'add_to_cart'},
    { text: 'Throw this item to the basket', label: 'add_to_cart'},
    { text: 'I want to buy this item', label: 'add_to_cart'}
  ]

  constructor() { 
    cohere.init(environment.cohereApiKey);
  }

  async generateText(prompt: string){
    const generated = [];
    for(let i=0;i<5;i++){
      const response = await cohere.generate({
        model: "large",
        prompt: prompt,
        max_tokens: 100,
        temperature: 1,
      });
      // concatenate the prompt and the generated text to
      generated.push(prompt + response.body.generations[0].text);
    }
    return generated;
  }

  async classifyText(inputs: any) {
    const response = await cohere.classify({
      inputs: inputs,
      examples: this.utterances,
    });
    // intent
    const intent = response.body.classifications[0].prediction;
    return intent;
  }


  speechToText(textEl: HTMLElement){
    recognition.start();
    recognition.onresult = (event: any) => {
      let utteranceList = event.results;
      let latestUtterance = utteranceList[utteranceList.length-1];
      let speechRecognition = latestUtterance[latestUtterance.length-1];
  
      // Update text object with speech recognition transcription
      let transcript  = speechRecognition.transcript.toLowerCase();
      textEl.innerHTML = transcript;

      if(latestUtterance.isFinal) {
        // Exit the function if the wake word was not triggered to respect user privacy
        if(!transcript.includes(`hey ${this.WAKE_WORD}`)) {
          // Provide the user with a suggestion on voice commands they can say
          textEl.innerHTML = `Try saying: 'Hey ${this.WAKE_WORD}, show me a different color'`;
          return;
        }
        
        // Extract the utterance from the wake word
        let utterance = transcript.split(`hey ${this.WAKE_WORD}`)[1];
        this.utterances$.next(utterance);
      }
    };
  }


}
