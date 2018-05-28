import { Component } from '@angular/core';
import { RBTree, Color, RBProperty } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rbTree: RBTree = new RBTree();

  constructor() {
    this.rbTree.insertByAlgorithm(1);
  }

  onInsert(value: number) {
    this.rbTree.insertByAlgorithm(value);
  }

  onClearAll() {
    this.rbTree.clearAll();
  }

  onRedo() {
    this.rbTree.redo();
  }

  onUndo() {
    this.rbTree.undo();
  }

  onDelete({ id, value }) {
    console.log(`Delete node ${id}:${value}`);
    this.rbTree.removeByAlgorithm(id, value);
  }

  onChangeColor({ id, value }) {
    console.log(`Change color of node ${id}:${value}`);
    this.rbTree.changeColor(id, value);
  }

  onRotateRight({ id, value }) {
    console.log(`Rotate right node ${id}:${value}`);
  }

  onRotateLeft({ id, value }) {
    console.log(`Rotate left node ${id}:${value}`);
  }
}
