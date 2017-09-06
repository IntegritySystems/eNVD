import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
interface Consignement {
  ConsignementNumber: string;
  Status: string,
  CreatedBy: string,
  CreatedAt: string,
  UpdatedAt: string
}

interface ConsignmentsListResponse {
  Value: {
    Items: Array<Consignement>;
    PageToken: string;
    NextPageToken: string
  }
}

@Component({
  selector: 'app-consignment-listing',
  templateUrl: './consignment-listing.component.html',
  styleUrls: ['./consignment-listing.component.css']
})

export class ConsignmentListingComponent implements OnInit {
  private consignments: Array<Consignement> = [];
  private isLoading: boolean = true;

  includeDrafts: boolean = true;
  pageSize: number = 10;
  consignmentNumber: string = '';

  private apiUrl = '/api/v3/vendordeclaration/consignments';
  private nextPageToken: string = '';
  private prevPageToken: string = '';

  constructor(private http: Http) { }

  ngOnInit() {
    this.onFiltersChanged();
  }

  private onFiltersChanged(){
    this.getConsignmentsList().subscribe(data => {
      this.consignments = data.Value.Items;
      this.isLoading = false;
    }, error => () => { console.error(error); });
  }

  private getConsignmentsList(){
    let headers = new Headers();
    headers.set('Authorization', localStorage.getItem('Authorization'));
    headers.set('Accept', 'application/json');

    return this.http.get(`${this.apiUrl}?${this.getQueryStringParams()}`, { headers })
      .map((res: Response) => {
        return res.json();
      });
  }

  private getQueryStringParams(): string {
    let params = new URLSearchParams();
    if(this.consignmentNumber.length > 0)
      params.set('consignmentNumber', this.consignmentNumber);
    
    params.set('noDraft', (!this.includeDrafts).toString());
    params.set('pageSize', this.pageSize.toString());
    if(this.nextPageToken.length > 0)
      params.set('pageToken', this.nextPageToken);

    return params.toString();
  }
}
