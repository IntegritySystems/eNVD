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
  private availableProgramsDictionary: { [key:string]: { displayName: string, schema: string }; } = {};
  private headers = new Headers();

  constructor(private http: Http, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.headers.set('Authorization', localStorage.getItem('Authorization'));
    this.headers.set('Accept', 'application/json');

    this.route.paramMap
      .switchMap((params: ParamMap) => this.getConsignmentDetails(params.get('id')))
      .subscribe(
        data => {
          this.consignment = data.Value;
          if(this.consignment){
            this.getAvailableProgramsForConsignment(this.consignment.Species)
              .subscribe(
                data => {
                  if(!data && !data.Value)
                    return;

                  data.Value.forEach(element => {
                    this.availableProgramsDictionary[element.Program] = { displayName: element.DisplayName, schema: element.Payload };
                  });
                }, error => {
                  console.error(error);
                });
                console.log(this.availableProgramsDictionary);
          }
        }, error => {
          console.error(error);
        });
  }

  private onProgramSelected(selectedProgram: string){
    
  }

  private getSelectedProgramDetails(selectedProgram: string) {
    
    this.http.get(`/api/v3/vendordeclaration/consignments/${this.consignment.ConsignmentNumber}/forms/$model`, { headers: this.headers })
      .toPromise()
      .then(res => {

      })
  }

  private getAvailableProgramsForConsignment(species: string): Observable<any> { 
    return this.http.get(`/api/v3/vendordeclaration/forms/$model?species=${species}`, { headers: this.headers})
      .map(res => { return res.json(); });
  }

  private getConsignmentDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.headers})
      .map(res => { return res.json(); })
  }
}
