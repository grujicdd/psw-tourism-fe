// src/app/feature-modules/tour-purchasing/tour-purchasing.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Modules - Import explicitly
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

// Components
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { TourReviewDialogComponent } from './tour-review-dialog/tour-review-dialog.component';
import { MyTourProblemsComponent } from './my-tour-problems/my-tour-problems.component';
import { ReportProblemDialogComponent } from './report-problem-dialog/report-problem-dialog.component';


@NgModule({
  declarations: [
    ShoppingCartComponent,
    PurchaseHistoryComponent,
    TourReviewDialogComponent,
    MyTourProblemsComponent,
    ReportProblemDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    // Material Modules
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule,
    MatChipsModule
  ]
})
export class TourPurchasingModule { }