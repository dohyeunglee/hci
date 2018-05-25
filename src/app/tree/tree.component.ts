import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Node, isNilNode, Color } from '../models';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, AfterViewInit {
  @Input() root: Node;
  isNilNode = isNilNode;
  Color = Color;

  constructor() {}

  ngOnInit() { }

  get left(): Node {
    return this.root && this.root.left;
  }

  get right(): Node {
    return this.root && this.root.right;
  }

  ngAfterViewInit() {}
}
