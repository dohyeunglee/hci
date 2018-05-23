import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import { Color, Node } from '../models';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() root: Node;
  left: Node;
  right: Node;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    this.left = this.root && this.root.children.left;
    this.right = this.root && this.root.children.right;
  }

  ngAfterViewInit() {}
}
