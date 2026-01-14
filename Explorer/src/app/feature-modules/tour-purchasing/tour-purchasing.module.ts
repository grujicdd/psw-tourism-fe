// src/app/feature-modules/tour-purchasing/tour-purchasing.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../../infrastructure/material/material.module';

// Components
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { TourReviewDialogComponent } from './tour-review-dialog/tour-review-dialog.component';

@NgModule({
  declarations: [
    ShoppingCartComponent,
    PurchaseHistoryComponent,
    TourReviewDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ],
  exports: [
    ShoppingCartComponent,
    PurchaseHistoryComponent
  ]
})
export class TourPurchasingModule { }