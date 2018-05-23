import { RBProperty } from './property';
import { Node, createLeafNode } from './node';
import { Color } from './color';

export class RBTree {
  root: Node;
  violations: RBProperty[] = [];

  constructor() {
    this.root = null;
  }

  clearAll() {
    this.root = null;
  }

  insertByAlgorithm(key: number) {
    const newNode = new Node(key);
    if (!this.root) {
      this.root = newNode;
      newNode.left = createLeafNode(newNode);
      newNode.right = createLeafNode(newNode);
    } else {
      let parent = null;
      let search = this.root;
      while (!search.isNil) {
        parent = search;
        if (newNode.key < search.key) {
          search = search.left;
        } else {
          search = search.right;
        }
      }
      newNode.parent = parent;
      if (newNode.key < parent.key) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
      newNode.left = createLeafNode(newNode);
      newNode.right = createLeafNode(newNode);
      newNode.color = Color.RED;
      this.fixTree(newNode);
    }
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
    if (y.left.isNil) {
      node.right = createLeafNode(node);
    } else {
      node.right = y.left;
    }

    if (!y.left.isNil) {
      y.left.parent = node;
    }
    y.parent = node.parent;
    if (node.parent.isNil) {
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

    if (y.right.isNil) {
      node.left = createLeafNode(node);
    } else {
      node.left = y.right;
    }

    if (!y.right.isNil) {
      y.right.parent = node;
    }
    y.parent = node.parent;
    if (node.parent.isNil) {
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
