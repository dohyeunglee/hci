import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Color, Node, RBTree } from '../models';
import * as d3 from 'd3';

const BLACK = '#003545';
const RED = '#ed6363';
const START_POS = { x: 225, y: 0 };
const END_POS = { x: 225, y: 40 };
const DELTA = { x: 100, y: 60 };

@Component({
  selector: 'mini-board',
  templateUrl: './mini-board.component.html',
  styleUrls: ['./mini-board.component.css']
})
export class MiniBoardComponent implements OnInit {
  board = null;
  lineGroup = null;
  @Input() tree: RBTree;
  duration: number = 500;
  mode: string = 'normal';
  insertValue: number = 0;
  changeColor = null;
  rotateLeft = null;
  rotateRight = null;
  selectedNode: Node = null;
  style: number = 1;
  errorEmit = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit() {
    this.board = d3.select('#mini-board');
    console.log(this.board);
    this.lineGroup = this.board.append('g');
    this.board.on('click', () => {
      if (this.changeColor) {
        this.changeColor.remove();
        this.rotateLeft.remove();
        this.rotateRight.remove();
        this.changeColor = null;
        this.rotateRight = null;
        this.rotateLeft = null;
        this.selectedNode = null;
      }
    });
    this.drawNode(this.tree.root, START_POS, END_POS, DELTA);
  }

  modeSet() {
    this.tree.checkViolations();
    this.mode = this.tree.violations.length ? 'violate' : 'normal';
    this.changeColor.remove();
    this.rotateLeft.remove();
    this.rotateRight.remove();
    this.changeColor = null;
    this.rotateRight = null;
    this.rotateLeft = null;
    this.selectedNode = null;
  }

  startDrag(node) {
    node.view.classed('active', true);
  }

  drag(node) {
    const x = d3.event.x + 250;
    const y = d3.event.y + 250;
    node.view.attr('transform', `translate(${x}, ${y})`);
    if (node.parentLine) {
      node.parentLine.attr('x2', x).attr('y2', y);
    }
    if (node.leftLine) {
      node.leftLine.attr('x1', x).attr('y1', y);
    }
    if (node.rightLine) {
      node.rightLine.attr('x1', x).attr('y1', y);
    }
    node.x = x;
    node.y = y;
  }

  endDrag(node) {
    node.view.classed('active', false);
  }

  refreshNode(node: Node, endPos, delta) {
    if (!node) {
      return;
    }
    if (node.leftLine)
      node.leftLine
        .transition()
        .duration(this.duration)
        .attr('x1', endPos.x)
        .attr('y1', endPos.y)
        .attr('x2', endPos.x - delta.x)
        .attr('y2', endPos.y + delta.y)
        .style('z-index', -1);
    if (node.rightLine)
      node.rightLine
        .transition()
        .duration(this.duration)
        .attr('x1', endPos.x)
        .attr('y1', endPos.y)
        .attr('x2', endPos.x + delta.x)
        .attr('y2', endPos.y + delta.y)
        .style('z-index', -1);
    node.x = endPos.x;
    node.y = endPos.y;
    node.view
      .transition()
      .duration(this.duration)
      .attr('transform', `translate(${endPos.x}, ${endPos.y})`);
    this.refreshNode(
      node.left,
      { x: endPos.x - delta.x, y: endPos.y + delta.y },
      { x: delta.x / 2, y: delta.y }
    );
    this.refreshNode(
      node.right,
      { x: endPos.x + delta.x, y: endPos.y + delta.y },
      { x: delta.x / 2, y: delta.y }
    );
  }

  drawNode(node: Node, startPos, endPos, delta) {
    if (!node) {
      return;
    }
    const leftLine = (node.leftLine = node.left
      ? this.lineGroup
          .append('line')
          .attr('x1', endPos.x)
          .attr('y1', endPos.y)
          .attr('x2', endPos.x)
          .attr('y2', endPos.y)
      : null);
    const rightLine = (node.rightLine = node.right
      ? this.lineGroup
          .append('line')
          .attr('x1', endPos.x)
          .attr('y1', endPos.y)
          .attr('x2', endPos.x)
          .attr('y2', endPos.y)
      : null);
    const group = (node.view = this.board.append('g'));
    node.x = endPos.x;
    node.y = endPos.y;
    if (node.left) {
      node.left.parentLine = node.leftLine;
      node.left.parentView = node.view;
    }
    if (node.right) {
      node.right.parentLine = node.rightLine;
      node.right.parentView = node.view;
    }
    const parentLine = node.parentLine;
    const circle = group
      .append('circle')
      .attr('fill', node.color === Color.BLACK ? BLACK : RED);
    const text = group
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(node.value === null ? 'NIL' : node.value);
    group.call(
      d3
        .drag()
        .on('start', () => this.startDrag(node))
        .on('drag', () => this.drag(node))
        .on('end', () => this.endDrag(node))
    );
    group.on('click', () => {
      if (node.value != null) {
        if (this.changeColor) {
          this.changeColor.remove();
          this.rotateLeft.remove();
          this.rotateRight.remove();
        }
        this.selectedNode = node;
        this.changeColor = group
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 60)
          .attr('r', 15)
          .attr('fill', node.color === Color.BLACK ? RED : BLACK);
        this.changeColor.on('click', () => {
          if (this.style === 1) {
            if (node === this.tree.root) {
              node.color = 1 - node.color;
              node.view
                .select('circle')
                .transition()
                .duration(this.duration)
                .attr('fill', node.color === Color.RED ? RED : BLACK);
              this.modeSet();
            } else {
              this.errorEmit.emit();
            }
          }
        });
        this.rotateLeft = group
          .append('g')
          .attr('transform', `translate(-40, 40)`);
        this.rotateLeft.on('click', () => {
          if (node.left.color === Color.RED) {
            this.tree.rotateLeft2(node);
            this.refreshNode(this.tree.root, END_POS, DELTA);
            this.modeSet();
          } else if (node.right.color === Color.RED) {
            this.tree.rotateLeft2(node);
            this.refreshNode(this.tree.root, END_POS, DELTA);
            this.modeSet();
          }
        });
        this.rotateLeft
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 15)
          .attr('fill', 'white');
        this.rotateLeft
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', BLACK)
          .attr('y', 5)
          .text('⟲');
        this.rotateRight = group
          .append('g')
          .attr('transform', `translate(40, 40)`);
        this.rotateRight.on('click', () => {
          if (node.right.color === Color.RED) {
            this.tree.rotateRight2(node);
            this.refreshNode(this.tree.root, END_POS, DELTA);
            this.modeSet();
          } else if (node.left.color === Color.RED) {
            this.tree.rotateRight2(node);
            this.refreshNode(this.tree.root, END_POS, DELTA);
            this.modeSet();
          }
        });
        this.rotateRight
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 15)
          .attr('fill', 'white');
        this.rotateRight
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('fill', 'black')
          .attr('y', 5)
          .text('⟳');
      }
      d3.event.stopPropagation();
    });
    group.transition().on('start', () => {
      group
        .attr('transform', `translate(${startPos.x}, ${startPos.y})`)
        .transition()
        .duration(this.duration)
        .attr('transform', `translate(${endPos.x}, ${endPos.y})`)
        .on('end', () => {
          this.drawNode(
            node.left,
            endPos,
            { x: endPos.x - delta.x, y: endPos.y + delta.y },
            { x: delta.x / 2, y: delta.y }
          );
          this.drawNode(
            node.right,
            endPos,
            { x: endPos.x + delta.x, y: endPos.y + delta.y },
            { x: delta.x / 2, y: delta.y }
          );
          if (leftLine) {
            leftLine
              .transition()
              .duration(this.duration)
              .attr('x2', endPos.x - delta.x)
              .attr('y2', endPos.y + delta.y);
          }
          if (rightLine) {
            rightLine
              .transition()
              .duration(this.duration)
              .attr('x2', endPos.x + delta.x)
              .attr('y2', endPos.y + delta.y);
          }
        });
      circle
        .attr('r', 0)
        .transition()
        .duration(this.duration)
        .attr('r', node.value === null ? '20' : '30');
      text
        .attr('font-size', '0px')
        .transition()
        .duration(this.duration)
        .attr('font-size', node.value === null ? '10px' : '20px');
    });
  }
}
