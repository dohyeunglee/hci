import { Color } from './color';

export class Node {
  key: number;
  color: Color;
  parent: Node;
  left: Node;
  right: Node;

  constructor(key: number, color = Color.BLACK) {
    this.key = key;
    this.color = color;
    this.parent = null;
    this.left = null;
    this.right = null;
  }

  get isNil() {
    return (
      this.key === null &&
      this.color === Color.BLACK &&
      this.left === null &&
      this.right === null
    );
  }
}

export function createNode(key: number): Node {
  const node = new Node(key);
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
