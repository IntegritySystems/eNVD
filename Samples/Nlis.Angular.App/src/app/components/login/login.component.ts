import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = { username: '', password: '' };

  private lpaSignInSettings = environment.lpaSignInRequestBody;

  constructor(private http: HttpClient) { }

  @Output() bearerToken: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

  lpaSignIn(form: any){
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Access-Control-Allow-Origin', '*')
      .set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    let requestBody = new URLSearchParams();
    requestBody.set('client_id', this.lpaSignInSettings.clientId);
    requestBody.set('client_secret', this.lpaSignInSettings.clientSecret);
    requestBody.set('grant_type', this.lpaSignInSettings.grantType);
    requestBody.set('scope', this.lpaSignInSettings.scope);
    requestBody.set('username', this.model.username);
    requestBody.set('password', this.model.password);
    
    this.http.post(this.lpaSignInSettings.signinUri, requestBody.toString(), { headers })
      .toPromise()
      .then(response => {
        localStorage.setItem('Authorization', `${response['token_type']} ${response['access_token']}`);
      })
      .catch(this.handleError);
  }

  private handleError(error: any){
    console.error('An error occured: ', error);
    return Promise.reject(error.message || error);
  }
}
