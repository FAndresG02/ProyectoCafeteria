import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { MATERIAL_IMPORTS } from '../../shared/material.imports';
import { COMMON_IMPORTS } from '../../shared/common.imports';
@Component({
  selector: 'app-full',
  imports: [
    ...MATERIAL_IMPORTS,
    ...COMMON_IMPORTS,
    Header,
    Sidebar
],
  templateUrl: './full.html',
  styleUrl: './full.scss',
})
export class Full implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  private media = inject(MediaMatcher);
  private changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    this.mobileQuery = this.media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  ngAfterViewInit(): void { }
}
