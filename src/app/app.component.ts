import { Component } from '@angular/core';
import { RBTreeService } from './rb-tree.service';
import { RBTree, Color } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rbTree: RBTree = {
    root: {
      id: '1',
      value: 1,
      children: {
        left: {
          id: '2',
          value: 2,
          children: {
            left: {
              value: 3,
              id: '3',
              children: {
                left: null,
                right: null
              },
              color: Color.RED
            },
            right: null
          },
          color: Color.RED
        },
        right: null
      },
      color: Color.BLACK
    },
    violations: null
  };
  constructor(private tree: RBTreeService) {}

  insert(value) {
    this.rbTree = this.tree.insert(this.rbTree, value);
  }

  clearAll() {}
}
