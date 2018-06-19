import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: '[svg-tree]',
  templateUrl: './svg-tree.component.html',
  styleUrls: ['./svg-tree.component.css']
})
export class SvgTreeComponent implements OnInit {
  @Input() node: Node

  constructor() { }

  ngOnInit() {
    this.node.nodeValue = '3'
  }

}
