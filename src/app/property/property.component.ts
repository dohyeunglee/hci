import { Component, OnInit, Input } from '@angular/core';
import { RBProperty } from '../models';

@Component({
  selector: 'property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  @Input() violations: RBProperty[] = [];
  properties: string[];
  toggleView: boolean = false

  constructor() {}

  ngOnInit() {
    this.properties = Object.values(RBProperty);
  }
}
