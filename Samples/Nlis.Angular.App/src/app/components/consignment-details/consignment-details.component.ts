import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { environment } from '../../../environments/environment';
import * as jsonpath from 'jsonpath';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchmap';
import 'rxjs/add/operator/startWith';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'

@Component({
  selector: 'app-consignment-details',
  templateUrl: './consignment-details.component.html',
  styleUrls: ['./consignment-details.component.css']
})
export class ConsignmentDetailsComponent implements OnInit, OnDestroy {
  private apiUrl: string = `${environment.eNvdV3Api}`;
  private consignmentsApiUrl: string = `${this.apiUrl}consignments`;
  private consignment: any = {};
  private availableProgramsDictionary: { program: string, displayName: string }[] = [];
  private headers = new Headers();
  private selectedProgram: string = '';
  private selectedFormSchema: any = {};
  private selectedFormModel: any = {};
  private isLoading: boolean = false;
  private materialDesign: string = 'no-framework';

  constructor(private http: Http, private route: ActivatedRoute) { }

  ngOnInit() {
    this.headers.set('Authorization', localStorage.getItem('Authorization'));
    this.headers.set('Accept', 'application/json');
    
    this.isLoading = true;
    this.route.paramMap.switchMap((params: ParamMap) => this.getConsignmentDetails(params.get('id')))
    .toPromise();
  }

  private onProgramSelected(selectedProgram: string){
    this.isLoading = true;
    this.selectedProgram = selectedProgram;
    this.getSelectedProgramDetails(selectedProgram)
      .then(result => {
        this.selectedFormSchema = result[0];
        this.selectedFormModel = result[1].Value;
        this.isLoading = false;
      });
  }

  private getSelectedProgramDetails(selectedProgram: string) {
    
    let schemaPromise = this.http.get(`${this.consignmentsApiUrl}/${this.consignment.ConsignmentNumber}/forms/$model`, { headers: this.headers })
      .toPromise()
      .then(res => { return res.json(); })
      .then(result => {
        let schemaObj = result.Value.find(i => i.Program === this.selectedProgram);
        if(schemaObj) {
          let jsonRefs = jsonpath.nodes(schemaObj.Payload, "$..*")
            .filter(f => jsonpath.stringify(f.path).indexOf('$ref') >=0 );

          return this.getAllAssociatedSubforms(jsonRefs, this.selectedProgram, schemaObj.Payload);
        }
      });

      let modelPromise = this.http.get(`${this.consignmentsApiUrl}/${this.consignment.ConsignmentNumber}/forms/${this.selectedProgram}`, 
        { headers: this.headers })
        .toPromise()
        .then(res => { return res.json(); });

      return Promise.all([schemaPromise, modelPromise]).then(values =>{
        return values;
      });
  }

  private getAvailableProgramsForConsignment(species: string) { 
    return this.http.get(`${this.apiUrl}forms/$model?species=${species}`, { headers: this.headers})
      .toPromise()
      .then(res => { return res.json(); })
      .catch(error => console.error(error));
  }

  private getConsignmentDetails(id: string) {
    
    return this.http.get(`${this.consignmentsApiUrl}/${id}`, { headers: this.headers})
      .toPromise()
      .then(res => { return res.json() })
      .then(res => {
        this.consignment = res.Value;
        if(this.consignment) {
          this.selectedProgram = this.consignment.FormPrograms[0];
          
        } else {
          throw new Error('Failed to load the consignment.')
        }
      })
      .then(() => {
        this.getAvailableProgramsForConsignment(this.consignment.Species)
        .then(res =>{
          if(!res && !res.Value && res.Value.length > 0)
            return;
  
          res.Value.forEach(element => {
            this.consignment.FormPrograms.forEach(consignmentProgram => {
              if(consignmentProgram === element.Program){
                this.availableProgramsDictionary.push({program: consignmentProgram, displayName: element.DisplayName });
              }
            });
          });
  
          var firstProgram = this.availableProgramsDictionary[0].program;
          return this.getSelectedProgramDetails(firstProgram);
        })
        .then(result => {
          this.selectedFormSchema = result[0];
          this.selectedFormModel = result[1].Value;
          this.isLoading = false;
        });
      })
      .catch(error => console.log(error));
  }

  getAllAssociatedSubforms(jsonRefs: {path: jsonpath.PathComponent[], value:any}[], program: string, formPayload: any) {
    
    let a = jsonRefs.map(ref => {
      return this.http.get(`${this.apiUrl}forms/${program}/subforms/${ref.value}/$model`, {headers: this.headers})
          .toPromise()
          .then(res => res.json())
          .then(result => {
            let path = jsonpath.stringify(ref.path.splice(0, ref.path.length - 1));
            if(result.Value.Name === ref.value && result.Value.Program === program){
              jsonpath.value(formPayload, path, result.Value.Payload);
            }
          })
          .catch(error => console.log(error));
    });
    
    return Promise.all(a).then(res => { return formPayload });
  }

  onSubmitForm(event){
    if(event){
      console.log('Write your post here!');
    }
  }
  ngOnDestroy() {
    this.availableProgramsDictionary = [];
    this.consignment = {};
    this.selectedFormSchema = null;
    this.selectedFormModel = null;
    this.selectedProgram = null;
  }
}
