import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { environment } from '../../../environments/environment';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-consignment-listing',
  templateUrl: './consignment-listing.component.html',
  styleUrls: ['./consignment-listing.component.css']
})

export class ConsignmentListingComponent implements OnInit {
  private consignments: Array<any> = [];
  private isLoading = true;
  private includeDrafts = true;
  private pageSize = 10;
  private consignmentNumber = '';
  private apiUrl = `${environment.eNvdV3Api}/consignments`;
  private nextPageToken = '';
  private prevPageToken = '';

  @Output() onConsignmentDetailsClicked: EventEmitter<string> = new EventEmitter();

  constructor(private http: Http) { }

  ngOnInit() {
    this.onFiltersChanged();
  }

  private onConsignmentLinkClicked(cid: string) {
    this.onConsignmentDetailsClicked.emit(cid);
  }

  private onFiltersChanged() {
    this.getConsignmentsList().subscribe(data => {
      this.consignments = data.Value.Items;
      this.isLoading = false;
    }, error => () => { console.error(error); });
  }

  private getConsignmentsList(): Observable<any> {
    const headers = new Headers();
    headers.set('Authorization', localStorage.getItem('Authorization'));
    headers.set('Accept', 'application/json');

    return this.http.get(`${this.apiUrl}?${this.getQueryStringParams()}`, { headers })
      .map(res => res.json());
  }

  private getQueryStringParams(): string {
    const params = new URLSearchParams();
    if (this.consignmentNumber.length > 0) {
      params.set('consignmentNumber', this.consignmentNumber);
    }

    params.set('noDraft', (!this.includeDrafts).toString());
    params.set('pageSize', this.pageSize.toString());
    if (this.nextPageToken.length > 0) {
      params.set('pageToken', this.nextPageToken);
    }

    return params.toString();
  }
}
