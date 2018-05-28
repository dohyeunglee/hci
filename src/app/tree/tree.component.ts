import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Node, isNilNode, Color } from '../models';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, AfterViewInit {
  @Input() root: Node;
  @Output() rotateLeft = new EventEmitter<Node>();
  @Output() rotateRight = new EventEmitter<Node>();
  @Output() delete = new EventEmitter<Node>();
  @Output() changeColor = new EventEmitter<Node>();
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
