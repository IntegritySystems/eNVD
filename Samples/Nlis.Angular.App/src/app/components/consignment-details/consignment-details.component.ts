import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchmap';

@Component({
  selector: 'app-consignment-details',
  templateUrl: './consignment-details.component.html',
  styleUrls: ['./consignment-details.component.css']
})
export class ConsignmentDetailsComponent implements OnInit {
  private apiUrl: string = '/api/v3/vendordeclaration/consignments'
  private consignment: any = {};
  
  constructor(private http: Http, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.getConsignmentDetails(params.get('id')))
      .subscribe(
        data => {
          this.consignment = data.Value;
        },
        error => {
          console.error(error);
        });
  }

  private getConsignmentDetails(id: string): Observable<any> {
    let headers = new Headers();
    headers.set('Authorization', localStorage.getItem('Authorization'));
    headers.set('Accept', 'application/json');

    return this.http.get(`${this.apiUrl}/${id}`, { headers})
      .map(res => { return res.json(); })
  }
}
