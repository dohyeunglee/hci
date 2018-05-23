import {
  Component,
  OnInit,
  Input,
  AfterViewInit
} from '@angular/core';
import { Color, Node, isNilNode } from '../models';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, AfterViewInit {
  @Input() root: Node;
  toolbarOpen = false;
  Color = Color;
  isNilNode = isNilNode;

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
