import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private title = 'eNVd Angular Sample';
  private isAuthenticated: boolean = false;
  private consignmentNumberDetails: string = '';

  constructor(){
  }
  
  ngOnInit(){
    this.toggleLoginWindow();
  }

  private toggleLoginWindow() {
    this.isAuthenticated = localStorage.getItem('Authorization') && localStorage.getItem('Authorization').length > 0;
  }

  private toggleConsignmentDetails(cid: string){
      this.consignmentNumberDetails = cid;
  }
}
