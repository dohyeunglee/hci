import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() message: string = '';
  @Input() type: string = '';
  @Output() closeAlertEmit = new EventEmitter<Object>();
  timer = null;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.timer = setTimeout(() => this.closeAlertEmit.emit({}), 10000);
  }

  ngOnChanges() {
    console.log('hee')
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.closeAlertEmit.emit({}), 10000);
  }
}
