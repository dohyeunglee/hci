export enum Color {
  RED,
  BLACK
}

export interface Node {
  id: string;
  value: number;
  children: {
    left: Node;
    right: Node;
  };
  color: Color;
}

export interface RBTree {
  root: Node;
  violations: RBProperty[] | null;
}

export enum RBProperty {
  PROPERTY1 = '루트는 블랙이다',
  PROPERTY2 = '모든 리프는 블랙이다',
  PROPERTY3 = '노드가 레드이면 그 노드의 자식은 반드시 블랙이다',
  PROPERTY4 = '루트 노드에서 임의의 리프 노드에 이르는 경로에서 만나는 블랙 노드의 수는 모두 같다'
}
