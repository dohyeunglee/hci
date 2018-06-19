import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.css'],
})
export class InputDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('input') input;

  @Output() clickCancelButtonEmit = new EventEmitter<Object>()
  @Output() clickOkButtonEmit = new EventEmitter<number>()

  inputValue: string = ''
  error: boolean = false

  constructor() { }

  ngOnInit() {
    // d3.select('.dialog').style('transform', 'scale(0.9)').transition().duration(1000).style('transform', 'scale(1.0)')
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus()
  }

  validCheck() {
    if (this.inputValue.match(/^-{0,1}\d+$/)) {
      this.error = false
      return true
    } else {
      this.error = true
      return false
    }
  }
}
