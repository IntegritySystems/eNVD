import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { JsonSchemaFormModule } from 'angular2-json-schema-form';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { ConsignmentListingComponent } from './components/consignment-listing/consignment-listing.component';
import { ConsignmentDetailsComponent } from './components/consignment-details/consignment-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ConsignmentListingComponent,
    ConsignmentDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonSchemaFormModule,
    RouterModule.forRoot([
      {
        path: 'consignments',
        component: ConsignmentListingComponent
      },
      {
        path: 'consignments/:id',
        component: ConsignmentDetailsComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
