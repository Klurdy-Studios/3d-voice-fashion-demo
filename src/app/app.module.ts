import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NlpService } from './services/nlp.service';
import { ThreedService } from './services/threed.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [ NlpService, ThreedService ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(nlp: NlpService){
    // nlp.classifyText(['switch materials'])
  }
 }
