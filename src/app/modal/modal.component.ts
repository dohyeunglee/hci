import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Color, RBTree } from "../models";

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  currentStage: number = 1
  rbTree: RBTree = new RBTree([12, 5, 15, 3, 10, 13, 17, 4, 7, 11, 14])
  rbTree1: RBTree = new RBTree([1, 2, 3])
  rbTree3: RBTree = new RBTree([1, 2, 3, 4, 5, 6, 7])
  Color = Color
  // rbTree: RBTree = new RBTree()

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
    this.rbTree1.root.color = Color.RED
    const node3 = this.rbTree3.root.right.right
    node3.color = Color.RED
    node3.left.color = Color.BLACK
    node3.right.color = Color.BLACK
    // this.rbTree1.
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then(result => {
      console.log(result)
    }).catch(err => {
      console.log(err)
    });
  }

  next() {
    if (this.currentStage < 10) ++this.currentStage
  }

  prev() {
    if (this.currentStage > 1) --this.currentStage
  }
}
