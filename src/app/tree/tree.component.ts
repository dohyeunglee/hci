import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { Node, isNilNode, Color } from '../models';

export interface OperationInfo {
  id: number;
  value: number;
}

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, AfterViewInit {
  @Input() root: Node;
  @Output() rotateLeft = new EventEmitter<OperationInfo>();
  @Output() rotateRight = new EventEmitter<OperationInfo>();
  @Output() delete = new EventEmitter<OperationInfo>();
  @Output() changeColor = new EventEmitter<OperationInfo>();
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

  onRotateRight() {
    this.rotateRight.emit({ id: this.root.id, value: this.root.value });
  }

  onRotateLeft() {
    this.rotateLeft.emit({ id: this.root.id, value: this.root.value });
  }

  onDelete() {
    this.delete.emit({ id: this.root.id, value: this.root.value });
  }

  onChangeColor() {
    this.changeColor.emit({ id: this.root.id, value: this.root.value });
  }

  ngAfterViewInit() {}
}
