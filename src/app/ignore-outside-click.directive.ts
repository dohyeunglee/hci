import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[ignoreOutsideClick]'
})
export class IgnoreOutsideClickDirective {

  @Input()
  set ignoreOutsideClick(ignore: boolean) {
    this.elementRef.nativeElement.ignoreOutsideClick = ignore;
  }

  constructor(private elementRef: ElementRef) {}
}
