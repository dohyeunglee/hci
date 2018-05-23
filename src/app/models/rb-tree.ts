import { RBProperty } from './property';
import { Node, createLeafNode, isNilNode } from './node';
import { Color } from './color';

export class RBTree {
  past: Node[] = [];
  root: Node;
  future: Node[] = [];
  violations: RBProperty[] = [];

  constructor() {
    this.root = null;
  }

  clearAll() {
    this.root = null;
  }

  redo() {
    this.past.push(this.root && this.root.clone());
    if (this.future.length !== 0) {
      this.root = this.future.pop();
    }
    console.log(this.past, this.root, this.future);
  }

  undo() {
    this.future.push(this.root && this.root.clone());
    if (this.past.length !== 0) {
      this.root = this.past.pop();
    }
    console.log(this.past, this.root, this.future);
  }

  insertByAlgorithm(value: number) {
    this.past.push(this.root && this.root.clone());
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
    } else {
      let parent = null;
      let search = this.root;
      while (!isNilNode(search)) {
        parent = search;
        if (newNode.value < search.value) {
          search = search.left;
        } else {
          search = search.right;
        }
      }
      newNode.parent = parent;
      if (newNode.value < parent.value) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
      newNode.left = createLeafNode(newNode);
      newNode.right = createLeafNode(newNode);
      newNode.color = Color.RED;
      this.fixTree(newNode);
    }
    console.log(this.past, this.root, this.future);
  }

  fixTree(node: Node) {
    while (node.parent != null && node.parent.color === Color.RED) {
      let uncle = null;
      if (node.parent === node.parent.parent.left) {
        uncle = node.parent.parent.right;

        if (uncle != null && uncle.color === Color.RED) {
          node.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          node = node.parent.parent;
          continue;
        }
        if (node === node.parent.right) {
          node = node.parent;
          this.rotateLeft(node);
        }
        node.parent.color = Color.BLACK;
        node.parent.parent.color = Color.RED;
        this.rotateRight(node.parent.parent);
      } else {
        uncle = node.parent.parent.left;
        if (uncle != null && uncle.color === Color.RED) {
          node.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          node = node.parent.parent;
          continue;
        }
        if (node === node.parent.left) {
          node = node.parent;
          this.rotateRight(node);
        }
        node.parent.color = Color.BLACK;
        node.parent.parent.color = Color.RED;
        this.rotateLeft(node.parent.parent);
      }
    }
    this.root.color = Color.BLACK;
  }

  rotateLeft(node: Node) {
    const y = node.right;
    if (isNilNode(y.left)) {
      node.right = createLeafNode(node);
    } else {
      node.right = y.left;
    }

    if (!isNilNode(y.left)) {
      y.left.parent = node;
    }
    y.parent = node.parent;
    if (isNilNode(node.parent)) {
      this.root = y;
    } else {
      if (node === node.parent.left) {
        node.parent.left = y;
      } else {
        node.parent.right = y;
      }
    }
    y.left = node;
    node.parent = y;
  }

  rotateRight(node: Node) {
    const y = node.left;

    if (isNilNode(y.right)) {
      node.left = createLeafNode(node);
    } else {
      node.left = y.right;
    }

    if (!isNilNode(y.right)) {
      y.right.parent = node;
    }
    y.parent = node.parent;
    if (isNilNode(node.parent)) {
      this.root = y;
    } else {
      if (node === node.parent.right) {
        node.parent.right = y;
      } else {
        node.parent.left = y;
      }
    }
    y.right = node;
    node.parent = y;
  }
}
