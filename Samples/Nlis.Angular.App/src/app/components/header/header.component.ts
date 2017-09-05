import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  @Input() disabled: boolean = true;
  constructor() { }

  @Output() onToggleLogin: EventEmitter<boolean> = new EventEmitter();
  ngOnInit() {
  }

  toggle() {
    this.disabled = !this.disabled;
    this.onToggleLogin.emit(this.disabled);
  }
}
