import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Color } from '../models';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})

export class NodeComponent implements OnInit {
  @Input() value: any;
  @Input() color: Color;
  @Output() rotateLeft = new EventEmitter<void>();
  @Output() rotateRight = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() changeColor = new EventEmitter<void>();
  @ViewChild('p') popover: NgbPopover;
  popoverOpen = false;
  Color = Color;

  constructor() {}

  ngOnInit() {}

  onClick() {
    this.popoverOpen = !this.popoverOpen;
    if (this.popoverOpen) {
      this.popover.open();
    } else {
      this.popover.close();
    }
  }

  onOutsideChange(event: boolean) {
    this.popoverOpen = event;
    if (this.popoverOpen) {
      this.popover.open();
    } else {
      this.popover.close();
    }
  }
}
