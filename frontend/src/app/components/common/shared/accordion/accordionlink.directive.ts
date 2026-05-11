import {
  Directive,
  HostBinding,
  Input,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { AccordionDirective } from './accordion.directive';

@Directive({
  selector: '[appAccordionLink]',
  standalone: true
})
export class AccordionLinkDirective implements OnInit, OnDestroy {
  @Input()
  public group: any;

  @HostBinding('class.selected')
  @Input()
  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    this._selected = value;
    if (value) {
      this.nav.closeOtherLinks(this);
    }
  }

  protected _selected: boolean = false;
  private nav = inject(AccordionDirective);

  ngOnInit(): void {
    this.nav.addLink(this);
  }

  ngOnDestroy(): void {
    this.nav.removeGroup(this);
  }

  toggle(): void {
    this.selected = !this.selected;
  }
}