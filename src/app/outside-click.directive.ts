import { Directive, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription, merge, fromEvent } from 'rxjs';

@Directive({
  selector: '[outsideClick]'
})
export class OutsideClickDirective implements OnInit, OnDestroy {
  @Input() outside: boolean;
  @Output() outsideChange: EventEmitter<boolean> = new EventEmitter();

  outsideClick: Subscription;
  init = true;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.addEventListener();
  }

  addEventListener() {
    if (!this.outsideClick) {
      this.outsideClick = merge(
        fromEvent(document, 'click'),
        fromEvent(document, 'touchstart')
      ).subscribe((event: any) => {
        if (!this.init) {
          this.outsideChange.emit(this.findHost(event));
        } else {
          this.init = false;
        }
      });
    }
  }

  unsubscribe() {
    if (this.outsideClick) {
      this.outsideClick.unsubscribe();
    }
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  findHostRecursive(element: any): boolean {
    if (element === document.documentElement) {
      return false;
    } else if (!element) {
      return true;
    } else if (
      element.ignoreOutsideClick ||
      element === this.element.nativeElement
    ) {
      return true;
    } else {
      return this.findHostRecursive(element.parentElement);
    }
  }

  findHost(event: any): boolean {
    const path = event.path;
    if (path) {
      for (let i = 0; i < path.length; i++) {
        if (
          path[i].ignoreOutsideClick ||
          path[i] === this.element.nativeElement
        ) {
          return true;
        }
      }
      return false;
    } else {
      return this.findHostRecursive(event.target && event.target.parentElement);
    }
  }


}
