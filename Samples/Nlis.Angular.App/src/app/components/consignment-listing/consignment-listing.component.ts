import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

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

export class ConsignmentListingComponent implements OnInit, OnChanges {
  model: Array<Consignement> = [];
  includeDrafts: boolean = true;
  pageSize: number = 10;
  consignmentNumber: string = '';

  private apiUrl = '/api/v3/vendordeclaration/consignments';
  private nextPageToken: string = '';
  private prevPageToken: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getConsignmentsList();
  }

  ngOnChanges(){
    console.log('I am here')

  }

  private getConsignmentsList(){
    let params = new URLSearchParams();
    if(this.consignmentNumber.length > 0)
      params.set('consignmentNumber', this.consignmentNumber);
    
    params.set('noDraft', (!this.includeDrafts).toString());
    params.set('pageSize', this.pageSize.toString());
    if(this.nextPageToken.length > 0)
      params.set('pageToken', this.nextPageToken);

    let headers = new HttpHeaders()
      .set('Authorization', localStorage.getItem('Authorization'))
      .set('Accept', 'application/json');

    return this.http.get<ConsignmentsListResponse>(`${this.apiUrl}?${params.toString()}`, { headers })
      .toPromise()
      .then(response => {
        this.model = response.Value.Items;
      })
      .catch(error => console.error(error));
  }
}
