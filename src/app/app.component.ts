import { Component } from '@angular/core';
import { RBTree, Color, RBProperty, Node } from './models';

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
    this.rbTree.prepareUndo();
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
    this.rbTree.removeByAlgorithm(id, value);
  }

  onChangeColor({ id, value }) {
    this.rbTree.changeColorByUser(id, value);
  }

  onRotateRight({ id, value }) {
    this.rbTree.rotateRightByUser(id, value);
  }

  onRotateLeft({ id, value }) {
    this.rbTree.rotateLeftByUser(id, value);
  }
}
