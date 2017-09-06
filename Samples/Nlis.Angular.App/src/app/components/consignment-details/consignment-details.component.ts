import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchmap';

interface ProgramDictionary {
  [key:string]: Program;
}

class Program {
  DisplayName: string; 
  Schema: string;
  FormDefinition: string;
  Model: string;

  constructor(private name: string) {
    this.DisplayName = name;
  }
}

@Component({
  selector: 'app-consignment-details',
  templateUrl: './consignment-details.component.html',
  styleUrls: ['./consignment-details.component.css']
})
export class ConsignmentDetailsComponent implements OnInit, OnDestroy {
  private apiUrl: string = '/api/v3/vendordeclaration/consignments'
  private consignment: any = {};
  private availableProgramsDictionary: ProgramDictionary = {};
  private headers = new Headers();
  private selectedProgram: string = '';

  constructor(private http: Http, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.headers.set('Authorization', localStorage.getItem('Authorization'));
    this.headers.set('Accept', 'application/json');

    this.route.paramMap.switchMap((params: ParamMap) => this.getConsignmentDetails(params.get('id')))
    .toPromise();
  }

  private onProgramSelected(selectedProgram: string){
    this.selectedProgram = selectedProgram;
    this.getSelectedProgramDetails(selectedProgram);
  }

  private getSelectedProgramDetails(selectedProgram: string) {
    
    this.http.get(`/api/v3/vendordeclaration/consignments/${this.consignment.ConsignmentNumber}/forms/$model`, { headers: this.headers })
      .toPromise()
      .then(res => { return res.json(); })
      .then(result => {
        if(!result || !result.Value)
          return;
        result.Value.forEach(item => {
          if(this.availableProgramsDictionary[item.Program]) {
            console.log('schema: ' + item.Payload);
            this.availableProgramsDictionary[item.Program].Schema = item.Payload;
          }
        });
      })
      .catch(error => console.error(error));

      this.http.get(`/api/v3/vendordeclaration/forms/${selectedProgram}/$view`, { headers: this.headers })
      .toPromise()
      .then(res => { return res.json(); })
      .then(result => {
        if(!result || !result.Value)
          return;
        if(!this.availableProgramsDictionary[result.Program])
          return;

        this.availableProgramsDictionary[result.Program].FormDefinition = result.Payload;
      })
      .catch(error => console.log(error));

      this.http.get(`/api/v3/vendordeclaration/consignments/${this.consignment.ConsignmentNumber}/forms/${this.selectedProgram}`, 
        { headers: this.headers })
        .toPromise()
        .then(res => { return res.json(); })
        .then(result => {
          if(!result || !result.Value)
            return;
          
          if(!this.availableProgramsDictionary[result.Program])
            return;

          this.availableProgramsDictionary[result.Program].Model = result.Payload;
        })
        .catch(error => console.log(error));
  }

  private getAvailableProgramsForConsignment(species: string) { 
    this.http.get(`/api/v3/vendordeclaration/forms/$model?species=${species}`, { headers: this.headers})
      .toPromise()
      .then(res => { return res.json(); })
      .then(res =>{
        if(!res && !res.Value && res.Value.length > 0)
          return;

        res.Value.forEach(element => {
          
          this.availableProgramsDictionary[element.Program] = new Program(element.DisplayName);
        });

        var firstProgram = res.Value[0].Program;
        if(this.availableProgramsDictionary[firstProgram]) {
          this.getSelectedProgramDetails(firstProgram);
        }
      })
      .catch(error => console.error(error));
  }

  private getConsignmentDetails(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.headers})
      .toPromise()
      .then(res => { return res.json() })
      .then(res => {
        this.consignment = res.Value;
        if(this.consignment) {
          this.selectedProgram = this.consignment.FormPrograms[0];
          this.getAvailableProgramsForConsignment(this.consignment.Species);
        }
      })
      .catch(error => console.log(error));
  }

  ngOnDestroy() {
    this.availableProgramsDictionary = {};
    this.consignment = {};
  }
}
