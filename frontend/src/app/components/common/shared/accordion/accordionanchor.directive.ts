import { Directive, HostListener, inject } from '@angular/core';
import { AccordionLinkDirective } from './accordionlink.directive';

@Directive({
  selector: '[appAccordionToggle]',
  standalone: true
})
export class AccordionAnchorDirective {
  private navlink = inject(AccordionLinkDirective);

  @HostListener('click', ['$event'])
  onClick(e: any): void {
    this.navlink.toggle();
  }
}