import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @Input() isAuthenticated = true;
  constructor() { }

  @Output() onToggleLogin: EventEmitter<boolean> = new EventEmitter();
  ngOnInit() {
  }

  logout() {
    localStorage.clear();
  }
}
