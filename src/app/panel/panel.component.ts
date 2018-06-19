import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  @Output() undoEmit = new EventEmitter<Object>();
  @Output() redoEmit = new EventEmitter<Object>();
  @Output() refreshEmit = new EventEmitter<Object>();
  @Output() helpEmit = new EventEmitter<Object>();

  toggleView: boolean = false

  constructor() {}

  ngOnInit() {}
}
