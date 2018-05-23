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

  insert(key: string) {
    this.rbTree.insertByAlgorithm(Number.parseInt(key));
    console.log(this.rbTree);
  }

  clearAll() {}
}
