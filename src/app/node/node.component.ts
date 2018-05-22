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
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent implements OnInit {
  @Input() node: Node;
  left: Node;
  right: Node;
  Color = Color;

  constructor() {}

  ngOnInit() {
    this.left = this.node && this.node.children.left;
    this.right = this.node && this.node.children.right;
  }
}
