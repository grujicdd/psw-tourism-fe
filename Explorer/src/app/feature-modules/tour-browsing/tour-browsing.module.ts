// tour-browsing.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../infrastructure/material/material.module';

// Import specific Material modules that might be missing
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TourBrowsingComponent } from './tour-browsing/tour-browsing.component';
import { ShoppingCartComponent } from '../tour-purchasing/shopping-cart/shopping-cart.component';
import { PurchaseHistoryComponent } from '../tour-purchasing/purchase-history/purchase-history.component';
import { TourPurchasingModule } from '../tour-purchasing/tour-purchasing.module';


@NgModule({
  declarations: [
    TourBrowsingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    // Add these if missing from your MaterialModule
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    TourPurchasingModule
  ],
  exports: [
    TourBrowsingComponent
  ]
})
export class TourBrowsingModule { }