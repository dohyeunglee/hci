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
    window['tree'] = this;
  }

  clearAll() {
    this.prepareUndo();
    this.root = null;
  }

  redo() {
    if (this.future.length !== 0) {
      this.past.push(this.root && this.root.clone());
      this.root = this.future.pop();
      console.log(this.past, this.root, this.future);
    }
  }

  findNode(id: number, value: number): Node {
    let node = this.root;
    while (node != null) {
      if (value < node.value) {
        node = node.left;
      } else if (value > node.value) {
        node = node.right;
      } else if (value === node.value) {
        if (id === node.id) {
          return node;
        } else {
          node = node.right;
        }
      } else {
        return null;
      }
    }
    return null;
  }

  removeByAlgorithm(id: number, value: number) {
    const z = this.findNode(id, value);
    if (z == null) {
      return;
    }
    let x;
    let y = z;
    let yOriginalColor = y.color;
    if (isNilNode(z.left)) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (isNilNode(z.right)) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      y = this.min(z.right);
      yOriginalColor = y.color;
      x = y.right;
      if (y.parent === z) {
        x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }
      this.transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }
    if (yOriginalColor === Color.BLACK) {
      this.removeFix(x);
    }
  }

  removeFix(node: Node) {
    while (node !== this.root && node.color === Color.BLACK) {
      if (node === node.parent.left) {
        let w = node.parent.right;
        if (w.color === Color.RED) {
          w.color = Color.BLACK;
          node.parent.color = Color.RED;
          this.rotateLeft(node.parent);
          w = node.parent.right;
        }
        if (w.left.color === Color.BLACK && w.right.color === Color.BLACK) {
          w.color = Color.RED;
          node = node.parent;
          continue;
        } else if (w.right.color === Color.BLACK) {
          w.left.color = Color.BLACK;
          w.color = Color.RED;
          w = node.parent.right;
        }
        if (w.right.color === Color.RED) {
          w.color = node.parent.color;
          node.parent.color = Color.BLACK;
          w.right.color = Color.BLACK;
          this.rotateLeft(node.parent);
          node = this.root;
        }
      } else {
        let w = node.parent.left;
        if (w.color === Color.RED) {
          w.color = Color.BLACK;
          node.parent.color = Color.RED;
          this.rotateRight(node.parent);
          w = node.parent.left;
        }
        if (w.right.color === Color.BLACK && w.left.color === Color.BLACK) {
          w.color = Color.RED;
          node = node.parent;
        } else if (w.left.color === Color.BLACK) {
          w.right.color = Color.BLACK;
          w.color = Color.RED;
          this.rotateLeft(w);
          w = node.parent.left;
        }
        if (w.left.color === Color.RED) {
          w.color = node.parent.color;
          node.parent.color = Color.BLACK;
          w.left.color = Color.BLACK;
          this.rotateRight(node.parent);
          node = this.root;
        }
      }
    }
    node.color = Color.BLACK;
  }

  transplant(u: Node, v: Node) {
    if (u.parent == null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  }

  undo() {
    if (this.past.length !== 0) {
      this.future.push(this.root && this.root.clone());
      this.root = this.past.pop();
    }
    console.log(this.past, this.root, this.future);
  }

  private prepareUndo() {
    this.past.push(this.root && this.root.clone());
    console.log(this.past, this.root, this.future);
  }

  insertByAlgorithm(value: number) {
    this.prepareUndo();
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
