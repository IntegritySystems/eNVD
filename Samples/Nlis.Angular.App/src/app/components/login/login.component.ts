import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
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
  @Output() onToggleLogin: EventEmitter<boolean> = new EventEmitter();

  private lpaSignInSettings = environment.lpaSignInRequestBody;

  constructor(private http: Http) { }

  ngOnInit() {
  }

  lpaSignIn(form: any){
    let headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    let requestBody = new URLSearchParams();
    requestBody.set('client_id', this.lpaSignInSettings.clientId);
    requestBody.set('client_secret', this.lpaSignInSettings.clientSecret);
    requestBody.set('grant_type', this.lpaSignInSettings.grantType);
    requestBody.set('scope', this.lpaSignInSettings.scope);
    requestBody.set('username', this.model.username);
    requestBody.set('password', this.model.password);
    
    this.http.post(this.lpaSignInSettings.signinUri, requestBody.toString(), { headers })
      .toPromise()
      .then(res => {
        let obj = res.json();
        localStorage.setItem('Authorization', `${obj.token_type} ${obj.access_token}`);
        this.onToggleLogin.emit(true);
      })
      .catch(this.handleError);
  }

  private handleError(error: any){
    console.error('An error occured: ', error);
    localStorage.removeItem('Authorization');
    return Promise.reject(error.message || error);
  }
}
