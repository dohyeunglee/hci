import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Color } from '../models';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit {
  @Input() value: any;
  @Input() color: Color;
  Color = Color;

  constructor() { }

  ngOnInit() {
  }

}
