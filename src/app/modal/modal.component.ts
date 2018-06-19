import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit, AfterViewInit {
  @Input() title: string = ''
  @Input() clearMission: boolean = true
  @Input() startPolicy: string = 'default' // 'left' 'right'
  @Input() hasPrev: boolean = true
  @Input() hasNext: boolean = true

  @Output() swipeLeftEvent = new EventEmitter<Object>()
  @Output() swipeRightEvent = new EventEmitter<Object>()
  @Output() clickButtonEvent = new EventEmitter<Object>()

  modal = null
  width: number = 500
  height: number = 500

  /* FOR DRAG */
  x: number = 0
  dx: number = 0
  accumx: number = 0

  constructor() {}

  startTransition() {
    this.modal.transition()
      .style('left', '50%')
      .style('width', `${this.width}px`)
      .style('height', `${this.height}px`)
  }

  startDrag() {
    this.x = d3.event.x
    this.dx = 0
    this.accumx = 0
    d3.selectAll('.modal__arrow').classed('invisible', true)
  }

  drag() {
    this.dx = d3.event.x - this.x
    this.accumx += this.dx
    this.x = d3.event.x
    this.modal.style('left', `${50 + this.accumx * 100 / window.innerWidth}%`)
  }

  endDrag() {
    const xRatio = 50 + this.accumx * 100 / window.innerWidth
    if (xRatio < 30 && this.hasNext) {
      this.modal.transition().style('left', '-50%').on('end', () => this.swipeLeftEvent.emit({}))
    } else if (xRatio > 80 && this.hasPrev) {
      this.modal.transition().style('left', '150%').on('end', () => this.swipeRightEvent.emit({}))
    } else {
      this.modal.transition().style('left', '50%')
    }
    d3.selectAll('.modal__arrow').classed('invisible', false)
  }

  clickButton() {
    if (this.clearMission)
      this.clickButtonEvent.emit({})
  }

  ngOnInit() {
    this.modal = d3.select('.modal__my')
    switch (this.startPolicy) {
      case 'default':
        this.modal.style('left', '50%')
        break
      case 'left':
        this.modal.style('left', '0%')
        break
      case 'right':
        this.modal.style('left', '100%')
        break
    }
    this.modal.style('width', `${this.width * 0.9}px`).style('height', `${this.height * 0.9}px`)
    this.modal.on('start', this.startTransition())
    this.modal.call(d3.drag()
      .on('start', () => this.startDrag())
      .on('drag', () => this.drag())
      .on('end', () => this.endDrag())
    )
  }

  ngAfterViewInit() {
  }
}
