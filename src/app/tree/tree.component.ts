import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { Color, Node } from '../models';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent implements OnInit, AfterViewInit {
  @Input() root: Node;
  @ViewChild('rootElem') rootElem;
  @ViewChild('leftElem') leftElem;
  left: Node;
  right: Node;

  constructor() {}

  ngOnInit() {
    this.left = this.root && this.root.children.left;
    this.right = this.root && this.root.children.right;
  }

  ngAfterViewInit() {}
}
