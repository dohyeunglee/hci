import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RBProperty } from '../models/property';
import { Color, RBTree } from '../models';

@Component({
  selector: 'help-modals',
  templateUrl: './help-modals.component.html',
  styleUrls: ['./help-modals.component.css']
})
export class HelpModalsComponent implements OnInit {
  @Output() sendOk = new EventEmitter<Object>();

  currIndex: number = 0;
  maxIndex: number = 13;
  startPolicy: string = 'default';
  properties = [
    RBProperty.PROPERTY1,
    RBProperty.PROPERTY2,
    RBProperty.PROPERTY3,
    RBProperty.PROPERTY4
  ];
  tree1: RBTree = new RBTree();

  constructor() {}

  ngOnInit() {
    this.tree1.insertByAlgorithm(2);
    this.tree1.insertByAlgorithm(3);
    this.tree1.insertByAlgorithm(1);
    this.tree1.root.color = Color.RED;
  }

  initPage() {
    switch (this.currIndex) {
      case 2:
        this.tree1 = new RBTree();
        this.tree1.insertByAlgorithm(2);
        this.tree1.insertByAlgorithm(3);
        this.tree1.insertByAlgorithm(1);
        this.tree1.root.color = Color.RED;
        break;
      case 4:
        this.tree1 = new RBTree();
        this.tree1.insertByAlgorithm(2);
        this.tree1.insertByAlgorithm(4);
        this.tree1.insertByAlgorithm(6);
        this.tree1.insertByAlgorithm(3);
        break;
    }
  }

  getNext() {
    this.currIndex += 1;
    this.startPolicy = 'right';
    this.initPage();
  }

  getPrev() {
    this.currIndex -= 1;
    this.startPolicy = 'left';
    this.initPage();
  }
}
