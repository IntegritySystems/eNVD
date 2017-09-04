import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  showLoginWindow: boolean = false;

  showLoginBox(isVisible: boolean) {
    this.showLoginWindow = !isVisible;
  }
}
