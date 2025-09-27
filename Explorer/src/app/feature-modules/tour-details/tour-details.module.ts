// src/app/feature-modules/tour-details/tour-details.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../infrastructure/material/material.module';
import { TourDetailsComponent } from './tour-details/tour-details.component';

@NgModule({
  declarations: [
    TourDetailsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    TourDetailsComponent
  ]
})
export class TourDetailsModule { }