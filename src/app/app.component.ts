import { Component } from '@angular/core';
import { RBTreeService } from './rb-tree.service';
import { RBTree } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  rbTree: RBTree = {
    root: null,
    violations: null
  };
  constructor(private tree: RBTreeService) {}
}
