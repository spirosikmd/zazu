import {Directive, ElementRef, Input, OnInit} from '@angular/core';

/**
 * Focus directive which focuses on an element when element is initialized and focus attribute is `true`.
 *
 * @example
 * <div [focus]="edit"></div>
 */
@Directive({
  selector: '[focus]'
})
export class FocusDirective implements OnInit {
  @Input() focus: boolean;
  private element: HTMLElement;

  constructor ($element: ElementRef) {
    this.element = $element.nativeElement;
  }

  ngOnInit (): void {
    if (this.focus) {
      this.element.focus();
    }
  }
}
