import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Node, isNilNode, Color } from '../models';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, AfterViewInit {
  @Input() root: Node;
  @Output() rotateLeft = new EventEmitter<number>();
  @Output() rotateRight = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() changeColor = new EventEmitter<number>();
  isNilNode = isNilNode;
  Color = Color;

  constructor() {}

  ngOnInit() {}

  get left(): Node {
    return this.root && this.root.left;
  }

  get right(): Node {
    return this.root && this.root.right;
  }

  ngAfterViewInit() {}
}
