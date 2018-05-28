import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RBTree } from "../models";

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  currentStage: number = 3
  rbTree: RBTree = new RBTree([12, 5, 15, 3, 10, 13, 17, 4, 7, 11, 14, 6, 8])
  // rbTree: RBTree = new RBTree()

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
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
