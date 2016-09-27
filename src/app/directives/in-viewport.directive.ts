import {Directive, ElementRef, OnInit, EventEmitter, Output} from '@angular/core';

export interface InViewportData {
  inViewport: boolean;
  offset: number;
}

/**
 * Execute callback with result whether element is in viewport
 * and its offsetTop when elements' offsetTop changes.
 */
@Directive({
  selector: '[inViewport]'
})
export class InViewportDirective implements OnInit {
  private element: HTMLElement;
  @Output() inViewport = new EventEmitter<InViewportData>();

  /**
   * Determine if element is in viewport.
   * @param {HTMLElement} el The element.
   */
  static elementInViewport (el: HTMLElement): boolean {
    let top = el.offsetTop;
    let left = el.offsetLeft;
    let width = el.offsetWidth;
    let height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent as HTMLElement;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top >= window.pageYOffset &&
      left >= window.pageXOffset &&
      (top + height) <= (window.pageYOffset + window.innerHeight) &&
      (left + width) <= (window.pageXOffset + window.innerWidth)
    );
  }

  constructor (private $element: ElementRef) {
    this.element = $element.nativeElement;
  }

  ngOnInit (): void {
    const isInViewport = InViewportDirective.elementInViewport(this.element);
    const parent = this.element.offsetParent as HTMLElement;
    this.inViewport.emit({inViewport: isInViewport, offset: parent.offsetTop});
  }
}
