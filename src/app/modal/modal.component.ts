import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, RBTree } from '../models';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  currentStage: number = 1;
  rbTree: RBTree = new RBTree()
  rbTree1: RBTree = new RBTree()
  rbTree2: RBTree = new RBTree()
  rbTree3: RBTree = new RBTree()
  Color = Color;
  // rbTree: RBTree = new RBTree()

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.resetRbTree()
  }

  resetRbTree() {
    this.rbTree = new RBTree([12, 5, 15, 3, 10, 13, 17, 4, 7, 11, 14])
    this.rbTree1 = new RBTree([1, 2, 3])
    this.rbTree2 = new RBTree([1, 2, 3])
    this.rbTree3 = new RBTree([1, 2, 3, 4, 5, 6, 7])
    this.rbTree1.root.color = Color.RED;
    const node3 = this.rbTree3.root.right.right;
    node3.color = Color.RED;
    node3.left.color = Color.BLACK;
    node3.right.color = Color.BLACK;
  }

  open(content) {
    this.modalService
      .open(content, { size: 'lg' })
      .result.then(result => {
        this.resetRbTree()
        console.log(result);
      })
      .catch(err => {
        this.resetRbTree()
        console.log(err);
      });
  }

  next() {
    if (this.currentStage < 10) ++this.currentStage;
  }

  prev() {
    if (this.currentStage > 1) --this.currentStage;
  }
}
