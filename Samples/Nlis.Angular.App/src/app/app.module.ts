import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { ConsignmentListingComponent } from './components/consignment-listing/consignment-listing.component';
import { ConsignmentDetailsComponent } from './components/consignment-details/consignment-details.component';
import { FormDetailsComponent } from './form-details/form-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    ConsignmentListingComponent,
    ConsignmentDetailsComponent,
    FormDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
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
