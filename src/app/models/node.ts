import { Color } from './color';

let id = 0;

export class Node {
  id = id++;
  value: number;
  color: Color;
  parent: Node;
  left: Node;
  right: Node;
  // FOR D3
  view = null;
  leftLine = null;
  rightLine = null;
  parentLine = null;
  parentView = null;
  x = null;
  y = null;

  constructor(value: number, color = Color.BLACK) {
    this.value = value;
    this.color = color;
    this.parent = null;
    this.left = null;
    this.right = null;
  }

  clone(parent?: Node): Node {
    const cloned = new Node(this.value, this.color);
    cloned.parent = parent || (this.parent && this.parent.clone());
    cloned.left = this.left && this.left.clone(cloned);
    cloned.right = this.right && this.right.clone(cloned);
    return cloned;
  }

  setValue(value: number) {
    this.value = value
    this.left = new Node(null)
    this.left.parent = this
    this.right = new Node(null)
    this.right.parent = this
  }
}

export function isNilNode(node: Node) {
  return (
    node === null ||
    (node.value === null &&
      node.color === Color.BLACK &&
      node.left === null &&
      node.right === null)
  );
}

export function createNode(value: number): Node {
  const node = new Node(value);
  const leftLeaf = new Node(null);
  leftLeaf.parent = node;
  const rightLeaf = new Node(null);
  rightLeaf.parent = node;

  node.left = leftLeaf;
  node.right = rightLeaf;
  return node;
}

export function createLeafNode(parent: Node): Node {
  const node = new Node(null);
  node.parent = parent;
  return node;
}
