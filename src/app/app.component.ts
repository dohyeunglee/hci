import { Component } from '@angular/core';
import { RBTree, Color, RBProperty } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rbTree: RBTree = new RBTree();

  constructor() {}

  insert(value: string) {
    this.rbTree.insertByAlgorithm(Number.parseInt(value));
  }

  clearAll() {}
}
