import { Component, OnInit } from '@angular/core';
import { JsonSchemaHelper } from './components/services/jsonSchemaHelper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ JsonSchemaHelper ],
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title = 'eNVd Angular Sample';
  private isAuthenticated = false;
  private consignmentNumberDetails = '';

  constructor() {
  }

  ngOnInit() {
    this.toggleLoginWindow();
  }

  private toggleLoginWindow(): void {
    this.isAuthenticated = localStorage.getItem('Authorization') && localStorage.getItem('Authorization').length > 0;
  }

  private toggleConsignmentDetails(cid: string): void {
      this.consignmentNumberDetails = cid;
  }
}
