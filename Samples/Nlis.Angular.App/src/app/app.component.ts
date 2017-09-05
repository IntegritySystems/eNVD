import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  canShowLoginWindow: boolean = false;
  isAuthenticated: boolean = false;

  toggleLoginWindow(isVisible: boolean) {
    this.canShowLoginWindow = !isVisible;
    this.isAuthenticated = localStorage.getItem('Authorization') && localStorage.getItem('Authorization').length > 0;
  }
}
