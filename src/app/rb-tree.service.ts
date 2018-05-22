import { Injectable } from '@angular/core';
import { Node, RBTree, RBTreeProperty, Color } from './models';

@Injectable({
  providedIn: 'root'
})
export class RBTreeService {
  constructor() {}

  insert(tree: RBTree, node: Node): RBTree {
    return tree;
  }
}
