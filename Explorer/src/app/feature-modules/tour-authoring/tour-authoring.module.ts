// src/app/feature-modules/tour-authoring/tour-authoring.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../infrastructure/material/material.module';

// Import missing Material modules explicitly
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { TourManagementComponent } from './tour-management/tour-management.component';
import { KeyPointManagementComponent } from './keypoint-management/keypoint-management.component';
import { MapComponent } from './map/map.component';
import { GuideTourProblemsComponent } from './guide-tour-problems/guide-tour-problems.component';
import { TourReplacementManagementComponent } from './tour-replacement-management/tour-replacement-management.component';
import { AvailableReplacementsComponent } from './available-replacements/available-replacements.component';

@NgModule({
  declarations: [
    TourManagementComponent,
    KeyPointManagementComponent,
    MapComponent,
    GuideTourProblemsComponent,
    TourReplacementManagementComponent,
    AvailableReplacementsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    // Explicit Material imports to fix missing module errors
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule
  ],
  exports: [
    TourManagementComponent
  ]
})
export class TourAuthoringModule { }