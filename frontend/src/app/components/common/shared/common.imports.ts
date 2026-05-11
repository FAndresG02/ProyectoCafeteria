import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export const COMMON_IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
] as const;