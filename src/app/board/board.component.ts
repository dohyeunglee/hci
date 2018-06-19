import { Component, Input, OnInit } from "@angular/core";
import { RBTree, Node, Color, createNode, isNilNode } from "../models";
import * as d3 from 'd3'


const BLACK = '#003545'
const RED = '#ed6363'
const START_POS = {x: 650, y: 0}
const END_POS = {x: 650, y: 100}
const DELTA = {x: 200, y: 100}

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  isHelpModalOpen: boolean = false
  isDialogOpen: boolean = false
  isAlertOpen: boolean = true
  board = null
  lineGroup = null
  @Input() tree: RBTree
  duration: number = 500
  mode: string = 'normal'
  insertValue: number = 0
  changeColor = null
  rotateLeft = null
  rotateRight = null
  selectedNode: Node = null
  message: string = '반갑습니다! 화면을 클릭해서 노드를 만들어 보세요!'
  remove = null

  constructor() { }

  ngOnInit() {
    this.board = d3.select('svg')
    this.lineGroup = this.board.append('g')
    this.board.on('click', () => {
      if (this.changeColor) {
        this.changeColor.remove()
        this.rotateLeft.remove()
        this.rotateRight.remove()
        this.changeColor = null
        this.rotateRight = null
        this.rotateLeft = null
        this.selectedNode = null
      } else if (this.remove) {
        this.selectedNode = null
        this.remove.remove()
        this.remove = null
      } else if (this.mode === 'normal') {
        this.isDialogOpen = true
      }
    })
    this.drawNode(this.tree.root, START_POS, END_POS, DELTA)
  }

  modeSet() {
    const prevMode = this.mode
    this.tree.checkViolations()
    this.mode = this.tree.violations.length ? 'violate' : 'normal'
    if (this.changeColor) {
      this.changeColor.remove()
      this.rotateLeft.remove()
      this.rotateRight.remove()
      this.changeColor = null
      this.rotateRight = null
      this.rotateLeft = null
    }
    if (this.remove) {
      this.remove.remove()
      this.remove = null
    }
    this.selectedNode = null
  }

  enterInsertMode(value) {
    this.isDialogOpen = false
    this.insertValue = Number.parseInt(value)
    this.mode = 'insert'
    this.isAlertOpen = true
    this.message = '올바른 리프 노드를 클릭하여 숫자를 직접 넣어보세요!'
  }

  startDrag(node) {
    node.view.classed('active', true)
    // if (node.leftLine) node.leftLine.style('stroke', '#ed6363')
    // if (node.rightLine) node.rightLine.style('stroke', '#ed6363')
    // if (node.parentLine) node.parentLine.style('stroke', '#ed6363')
  }

  drag(node) {
    let x = Math.min(Math.max(d3.event.x, node.left ? node.left.x + 10 : 10), node.right ? node.right.x : 990)
    const y = Math.min(Math.max(d3.event.y, node.parent ? node.parent.y + 10 : 10), node.left ? node.left.y - 10 : 990, node.right ? node.right.y - 10 : 990)
    node.view.attr('transform', `translate(${x}, ${y})`)
    if (node.parentLine) {
      node.parentLine.attr('x2', x).attr('y2', y)
    }
    if (node.leftLine) {
      node.leftLine.attr('x1', x).attr('y1', y)
    }
    if (node.rightLine) {
      node.rightLine.attr('x1', x).attr('y1', y)
    }
    node.x = x
    node.y = y
  }

  endDrag(node) {
    node.view.classed('active', false)
    // if (node.leftLine) node.leftLine.style('stroke', '#003545')
    // if (node.rightLine) node.rightLine.style('stroke', '#003545')
    // if (node.parentLine) node.parentLine.style('stroke', '#003545')
  }

  drawNodeWhole() {
    this.board.selectAll('*').remove()
    this.lineGroup = this.board.append('g')
    this.drawNode(this.tree.root, START_POS, END_POS, DELTA)
  }

  undo() {
    this.tree.undo()
    console.log(this.tree)
    this.drawNodeWhole()
    this.mode = 'normal'
  }

  redo() {
    this.tree.redo()
    this.drawNodeWhole()
    this.modeSet()
  }

  refreshNode(node: Node, endPos = END_POS, delta = DELTA) {
    if (!node) {
      return
    }
    if (node.leftLine) node.leftLine.transition().duration(this.duration).attr('x1', endPos.x).attr('y1', endPos.y).attr('x2', endPos.x - delta.x).attr('y2', endPos.y + delta.y)
    if (node.rightLine) node.rightLine.transition().duration(this.duration).attr('x1', endPos.x).attr('y1', endPos.y).attr('x2', endPos.x + delta.x).attr('y2', endPos.y + delta.y)
    node.x = endPos.x
    node.y = endPos.y
    node.view.transition().duration(this.duration).attr('transform', `translate(${endPos.x}, ${endPos.y})`)
    this.refreshNode(node.left, {x: endPos.x - delta.x, y: endPos.y + delta.y}, {x: delta.x / 2, y: delta.y})
    this.refreshNode(node.right, {x: endPos.x + delta.x, y: endPos.y + delta.y}, {x: delta.x / 2, y: delta.y})
  }

  removeCascadeNode(node: Node) {
    if (!node) {
      return
    }
    if (node.leftLine) {
      node.leftLine.transition().duration(this.duration).attr('x2', node.x).attr('y2', node.y)
        .on('end', () => node.leftLine.remove())
    }
    if (node.rightLine) {
      node.rightLine.transition().duration(this.duration).attr('x2', node.x).attr('y2', node.y)
        .on('end', () => node.rightLine.remove())
    }
    if (node.view) {
      node.view.transition().duration(this.duration).select('circle').attr('r', 0).on('end', () => node.view.remove())
      node.view.transition().duration(this.duration).select('text').attr('font-size', '0px')
    }
    this.removeCascadeNode(node.left)
    this.removeCascadeNode(node.right)
  }

  drawNode(node: Node, startPos, endPos, delta) {
    if (!node) {
      return;
    }
    const leftLine = node.leftLine = node.left ? this.lineGroup.append('line').attr('x1', endPos.x).attr('y1', endPos.y).attr('x2', endPos.x).attr('y2', endPos.y) : null
    const rightLine = node.rightLine = node.right ? this.lineGroup.append('line').attr('x1', endPos.x).attr('y1', endPos.y).attr('x2', endPos.x).attr('y2', endPos.y) : null
    const group = node.view = this.board.append('g')
    node.x = endPos.x
    node.y = endPos.y
    if (node.left) {
      node.left.parentLine = node.leftLine
      node.left.parentView = node.view
    }
    if (node.right) {
      node.right.parentLine = node.rightLine
      node.right.parentView = node.view
    }
    const parentLine = node.parentLine
    const circle = group.append('circle')
      .attr('fill', node.color === Color.BLACK ? BLACK : RED)
    const text = group.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(node.value === null ? 'NIL' : node.value)
    group.call(d3.drag()
      .on('start', () => this.startDrag(node))
      .on('drag', () => this.drag(node))
      .on('end', () => this.endDrag(node))
    )
    group.on('click', () => {
      if (node.value == null) {
        if (this.mode === 'insert') {
          if (this.tree.locate(this.tree.root, this.insertValue) === node) {
            this.tree.prepareUndo()
            node.setValue(this.insertValue)
            node.view.remove()
            this.drawNode(node, { x: node.x, y: node.y }, { x: node.x, y: node.y }, { x: 50, y: 100 })
            this.modeSet()
          } else {

          }
        }
      } else {
        if (this.mode === 'violate') {
          if (this.changeColor) {
            this.changeColor.remove()
            this.rotateLeft.remove()
            this.rotateRight.remove()
          }
          this.selectedNode = node
          this.changeColor = group.append('circle')
            .attr('cx', 0)
            .attr('cy', 60)
            .attr('r', 15)
            .attr('fill', node.color === Color.BLACK ? RED : BLACK)
          this.changeColor.on('click', () => {
            node.color = 1 - node.color
            node.view.select('circle').transition().duration(this.duration).attr('fill', node.color === Color.RED ? RED : BLACK)
            this.modeSet()
          })
          this.rotateLeft = group.append('g')
            .attr('transform', `translate(-40, 40)`)
          this.rotateLeft.on('click', () => {
            if (node.left.color === Color.RED) {
              this.tree.rotateLeft2(node)
              this.refreshNode(this.tree.root, END_POS, DELTA)
              this.modeSet()
            } else if (node.right.color === Color.RED) {
              this.tree.rotateLeft2(node)
              this.refreshNode(this.tree.root, END_POS, DELTA)
              this.modeSet()
            }
          })
          this.rotateLeft.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 15)
            .attr('fill', 'white')
          this.rotateLeft.append('text')
            .attr('text-anchor', 'middle')
            .attr('fill', BLACK)
            .attr('y', 5)
            .text('⟲')
          this.rotateRight = group.append('g')
            .attr('transform', `translate(40, 40)`)
          this.rotateRight.on('click', () => {
            if (node.right.color === Color.RED) {
              this.tree.rotateRight2(node)
              this.refreshNode(this.tree.root, END_POS, DELTA)
              this.modeSet()
            } else if (node.left.color === Color.RED) {
              this.tree.rotateRight2(node)
              this.refreshNode(this.tree.root, END_POS, DELTA)
              this.modeSet()
            }
          })
          this.rotateRight.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 20)
            .attr('fill', 'white')
          this.rotateRight.append('text')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('y', 10)
            .text('⟳')
        } else if (this.mode === 'normal') {
          if (this.remove) {
            this.remove.remove()
          }

          this.remove = group.append('g')
            .attr('transform', `translate(0, -50)`)
          this.remove.on('click', () => {
            this.tree.prepareUndo()
            this.tree.remove2(node)
            console.log(this.tree)
            this.removeCascadeNode(node)
            this.refreshNode(this.tree.root, END_POS, DELTA)
            this.modeSet()
          })
          this.remove.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 15)
            .attr('fill', 'white')
          this.remove.append('text')
            .attr('text-anchor', 'middle')
            .attr('fill', BLACK)
            .attr('y', 5)
            .text('✗')
        }
      }
      d3.event.stopPropagation()
    })
    group.transition().on('start', () => {
      group.attr('transform', `translate(${startPos.x}, ${startPos.y})`)
        .transition().duration(this.duration)
        .attr('transform', `translate(${endPos.x}, ${endPos.y})`)
        .on('end', () => {
          this.drawNode(node.left, endPos, {x: endPos.x - delta.x, y: endPos.y + delta.y}, {x: delta.x / 2, y: delta.y})
          this.drawNode(node.right, endPos, {x: endPos.x + delta.x, y: endPos.y + delta.y}, {x: delta.x / 2, y: delta.y})
          if (leftLine) {
            leftLine.transition().duration(this.duration)
              .attr('x2', endPos.x - delta.x).attr('y2', endPos.y + delta.y)
          }
          if (rightLine) {
            rightLine.transition().duration(this.duration)
              .attr('x2', endPos.x + delta.x).attr('y2', endPos.y + delta.y)
          }
        })
      circle.attr('r', 0)
        .transition().duration(this.duration)
        .attr('r', node.value === null ? '20' : '30')
      text.attr('font-size', '0px')
        .transition().duration(this.duration)
        .attr('font-size', node.value === null ? '10px' : '20px')
    })
  }
}
