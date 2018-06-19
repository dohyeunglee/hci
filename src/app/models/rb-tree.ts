import { RBProperty } from './property';
import { Node, createLeafNode, isNilNode, createNode } from "./node";
import { Color } from './color';
import { P } from "@angular/core/src/render3";

window['trees'] = [];

export class RBTree {
  past: Node[] = [];
  root: Node;
  future: Node[] = [];
  violations: RBProperty[] = [];

  constructor(obj?) {
    this.root = null;
    window['trees'].push(this);
    if (Array.isArray(obj)) {
      obj.forEach(v => this.insertByAlgorithm(v));
    }
  }

  changeColorByUser(id, value) {
    const target = this.findNode(id, value);
    const color = target.color;
    if (target) {
      this.prepareUndo();
      target.color = 1 - target.color;
      this.checkViolations();
    }
  }

  locate(node: Node = this.root, value: number) {
    if (node.value === value || node.value === null) {
      return node
    } else if (node.value < value) {
      return this.locate(node.right, value)
    } else {
      return this.locate(node.left, value)
    }
  }

  clearAll() {
    this.prepareUndo();
    this.root = null;
    this.checkViolations();
  }

  private violateRule1(): boolean {
    return this.root.color === Color.RED;
  }

  private violateRule2(): boolean {
    return false;
  }

  private violateRule3(node = this.root): boolean {
    if (!node) {
      return false;
    }
    return (
      this.violateRule3(node.left) ||
      this.violateRule3(node.right) ||
      (node.color === Color.RED &&
        ((node.left && node.left.color === Color.RED) ||
          (node.right && node.right.color === Color.RED)))
    );
  }

  private getBlackNum(node: Node): number {
    if (!node || node.value === null) {
      return 0;
    }
    const childNum = this.getBlackNum(node.left);
    if (childNum !== this.getBlackNum(node.right)) {
      return -1;
    } else {
      return childNum + (node.color === Color.BLACK ? 1 : 0);
    }
  }

  private violateRule4(): boolean {
    return this.getBlackNum(this.root) === -1;
  }

  checkViolations() {
    this.violations = [
      this.violateRule1() && RBProperty.PROPERTY1,
      this.violateRule2() && RBProperty.PROPERTY2,
      this.violateRule3() && RBProperty.PROPERTY3,
      this.violateRule4() && RBProperty.PROPERTY4
    ].filter(rule => rule);
  }

  rotateRightByUser(id: number, value: number) {
    const target = this.findNode(id, value);
    if (target) {
      this.prepareUndo();
      this.rotateRight(target);
      this.checkViolations();
    }
  }

  rotateLeftByUser(id: number, value: number) {
    const target = this.findNode(id, value);
    if (target) {
      this.prepareUndo();
      this.rotateLeft(target);
      this.checkViolations();
    }
  }

  redo() {
    if (this.future.length !== 0) {
      this.past.push(this.root && this.root.clone());
      this.root = this.future.pop();
      this.checkViolations();
      console.log(this.past, this.root, this.future);
    }
  }

  min(node: Node): Node {
    if (node == null || node === undefined) {
      return {} as Node;
    }
    while (!isNilNode(node.left)) {
      node = node.left;
    }
    return node;
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
    this.prepareUndo();
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
    this.checkViolations();
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
      this.checkViolations();
    }
    console.log(this.past, this.root, this.future);
  }

  prepareUndo() {
    this.past.push(this.root && this.root.clone());
    this.future = [];
    console.log(this.past, this.root, this.future);
  }

  insertByAlgorithm(value: number) {
    const newNode = createNode(value);
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
      newNode.color = Color.RED;
      this.fixTree(newNode);
    }
    this.checkViolations();
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

  private checkIfChildrenNil(node: Node) {
    return isNilNode(node) || (isNilNode(node.left) && isNilNode(node.right));
  }

  rotateLeft(node: Node) {
    if (!this.checkIfChildrenNil(node)) {
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
  }

  rotateLeft2(node: Node) {
    if (isNilNode(node.right)) {
      return
    }
    const right = node.right
    if (!node.parent) {
      this.root = right
    } else if (node.parent.right === node) {
      node.parent.right = right
    } else if (node.parent.left === node) {
      node.parent.left = right
    }
    node.right = right.left
    right.parent = node.parent
    node.parent = right
    node.parent.left = node

    /* LINE BINDING */
    if (right.parent) {
      if (right.parent.value < right.value)
        right.parentLine = right.parent.leftLine
      else
        right.parentLine = right.parent.rightLine
    } else {
      right.parentLine = null
    }
    node.right.parentLine = node.rightLine
    node.parentLine = right.leftLine
  }

  rotateRight2(node: Node) {
    if (isNilNode(node.left)) {
      return
    }
    const left = node.left
    if (!node.parent) {
      this.root = left
    } else if (node.parent.right === node) {
      node.parent.right = left
    } else if (node.parent.left === node) {
      node.parent.left = left
    }
    node.left = left.right
    left.parent = node.parent
    node.parent = left
    node.parent.right = node

    /* LINE BINDING */
    if (left.parent) {
      if (left.parent.value < left.value)
        left.parentLine = left.parent.rightLine
      else
        left.parentLine = left.parent.leftLine
    } else {
      left.parentLine = null
    }
    if (left.parent) left.parentLine = left.parent.rightLine
    node.left.parentLine = node.leftLine
    node.parentLine = left.rightLine
  }

  rotateRight(node: Node) {
    if (!this.checkIfChildrenNil(node)) {
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

  remove2(node: Node) {
    if (isNilNode(node.left) && isNilNode(node.right)) {
      if (node.parent) {
        if (node.parent.right === node) {
          node.parent.right = node.right
          node.right = null
          node.parent.right.parentLine = node.parentLine
          node.parent.right.parent = node.parent
        } else {
          node.parent.left = node.left
          node.left = null
          node.parent.left.parentLine = node.parentLine
          node.parent.left.parent = node.parent
        }
      }
    } else if (!isNilNode(node.left) && isNilNode(node.right)) {
      if (!node.parent) {
        this.root = node.left
        this.root.parentLine = null
        this.root.parent = null
      } else if (node.parent.right === node) {
        node.parent.right = node.left
        node.parent.right.parentLine = node.parentLine
        node.parent.right.parent = node.parent
      } else {
        node.parent.left = node.left
        node.parent.left.parentLine = node.parentLine
        node.parent.left.parent = node.parent
      }
      node.left = null
    } else if (!isNilNode(node.right) && isNilNode(node.left)) {
      if (!node.parent) {
        this.root = node.right
        this.root.parentLine = null
        this.root.parent = null
      } else if (node.parent.left === node) {
        node.parent.left = node.right
        node.parent.left.parentLine = node.parentLine
        node.parent.left.parent = node.parent
      } else {
        node.parent.right = node.right
        node.parent.right.parentLine = node.parentLine
        node.parent.right.parent = node.parent
      }
      node.right = null
    } else if (!isNilNode(node.right) && !isNilNode(node.left)) {
      let replacer = node.left
      while (!isNilNode(replacer.right)) {
        replacer = replacer.right
      }
      if (replacer === node.left) {
        if (!node.parent) {
          this.root = replacer
        } else {
          if (node.parent.right === node) {
            node.parent.right = replacer
          } else {
            node.parent.left = replacer
          }
        }
        replacer.parent = node.parent
        replacer.parentLine = node.parentLine
        const right = replacer.right
        const rightLine = replacer.rightLine
        replacer.right = node.right
        replacer.rightLine = node.rightLine
        replacer.right.parent = replacer
        replacer.right.parentLine = replacer.rightLine
        node.left = null
        node.right = right
        node.rightLine = rightLine
      } else {
        if (!node.parent) {
          this.root = replacer
        } else {
          if (node.parent.right === node) {
            node.parent.right = replacer
          } else {
            node.parent.left = replacer
          }
        }
        replacer.parent.right = replacer.left
        replacer.left.parent = replacer.parent
        replacer.left.parentLine = replacer.parentLine
        replacer.parent = node.parent
        replacer.parentLine = node.parentLine
        const right = replacer.right
        const rightLine = replacer.rightLine
        const leftLine = replacer.leftLine
        replacer.left = node.left
        replacer.leftLine = node.leftLine
        replacer.left.parent = replacer
        replacer.left.parentLine = replacer.leftLine
        replacer.right = node.right
        replacer.rightLine = node.rightLine
        replacer.right.parent = replacer
        replacer.right.parentLine = replacer.rightLine
        node.left = null
        node.right = right
        node.rightLine = rightLine
        node.leftLine = leftLine
      }
    }
  }
}
