import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Color, Node } from '../models';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit {
  @Input() root: Node;
  left: Node;
  right: Node;
  Color = Color;

  constructor() {}

  ngOnInit() {
    this.left = this.root && this.root.children.left;
    this.right = this.root && this.root.children.right;
  }
}
