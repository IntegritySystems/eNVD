import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model = { username: '', password: '' };
  @Output() onSuccessfulAuthenticated: EventEmitter<boolean> = new EventEmitter();

  private lpaSignInSettings = environment.lpaSignInRequestBody;

  constructor(private http: Http, private router: Router) { }

  ngOnInit() {
  }

  lpaSignIn(form: any) {
    const headers = new Headers();
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    const requestBody = new URLSearchParams();
    requestBody.set('client_id', this.lpaSignInSettings.clientId);
    requestBody.set('client_secret', this.lpaSignInSettings.clientSecret);
    requestBody.set('grant_type', this.lpaSignInSettings.grantType);
    requestBody.set('scope', this.lpaSignInSettings.scope);
    requestBody.set('username', this.model.username);
    requestBody.set('password', this.model.password);

    this.http.post(this.lpaSignInSettings.signinUri, requestBody.toString(), { headers })
      .toPromise()
      .then(res => {
        const obj = res.json();
        localStorage.setItem('Authorization', `${obj.token_type} ${obj.access_token}`);
        this.onSuccessfulAuthenticated.emit(true);
        this.router.navigate(['/consignments']);
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<never> {
    console.error('An error occured: ', error);
    localStorage.removeItem('Authorization');
    return Promise.reject(error.message || error);
  }
}
