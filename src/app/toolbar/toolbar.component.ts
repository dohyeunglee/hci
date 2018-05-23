import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Output() insert = new EventEmitter<number>();
  @Output() clearAll = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();
  @Output() redo = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onInsert(value: string) {
    const parsed = Number.parseInt(value);
    if (Number.isInteger(parsed)) {
      this.insert.emit(parsed);
    }
  }
}
