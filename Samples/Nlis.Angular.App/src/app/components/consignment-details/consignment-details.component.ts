import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-consignment-details',
  templateUrl: './consignment-details.component.html',
  styleUrls: ['./consignment-details.component.css']
})
export class ConsignmentDetailsComponent implements OnInit {
  private apiUrl: string = '/api/v3/vendordeclaration/consignments'
  private consignment: any = {};

  @Input() consignmentNumber: string = '';
  @Output() clearConsignmentNumber: EventEmitter<any> = new EventEmitter();
  constructor(private http: Http) { }

  ngOnInit() {
    this.getConsignmentDetails().subscribe(
      data => {
        this.consignment = data.Value;
      },
      error => {
        console.error(error);
      }
    )
  }

  private goBackToConsignmentListing(){
    this.clearConsignmentNumber.emit(null);
  }

  private getConsignmentDetails(): Observable<any> {
    let headers = new Headers();
    headers.set('Authorization', localStorage.getItem('Authorization'));
    headers.set('Accept', 'application/json');

    return this.http.get(`${this.apiUrl}/${this.consignmentNumber}`, { headers})
      .map(res => { return res.json(); })
  }
}
