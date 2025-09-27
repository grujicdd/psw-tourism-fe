// src/app/feature-modules/tour-purchasing/shopping-cart/shopping-cart.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartWithToursService, CartWithTours } from '../cart-with-tours.service';
import { BonusPointsService, BonusPoints } from '../bonus-points.service';
import { PurchaseService } from '../purchase.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cartData: CartWithTours | null = null;
  bonusPoints: BonusPoints | null = null;
  bonusPointsToUse: number = 0;
  loading = false;
  purchasing = false;

  constructor(
    private cartWithToursService: CartWithToursService,
    private bonusPointsService: BonusPointsService,
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartData();
    this.loadBonusPoints();
  }

  loadCartData(): void {
    this.loading = true;
    this.cartWithToursService.getCartWithTours().subscribe({
      next: (cartData) => {
        this.cartData = cartData;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.loading = false;
        this.snackBar.open('Error loading cart', 'Close', { duration: 3000 });
      }
    });
  }

  loadBonusPoints(): void {
    this.bonusPointsService.getBonusPoints().subscribe({
      next: (bonusPoints) => {
        this.bonusPoints = bonusPoints;
      },
      error: (error) => {
        console.error('Error loading bonus points:', error);
      }
    });
  }

  removeTourFromCart(tourId: number): void {
    this.cartWithToursService.removeTourAndGetUpdated(tourId).subscribe({
      next: (updatedCart) => {
        this.cartData = updatedCart;
        this.snackBar.open('Tour removed from cart', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error removing tour:', error);
        this.snackBar.open('Error removing tour', 'Close', { duration: 3000 });
      }
    });
  }

  clearCart(): void {
    this.cartWithToursService.clearCartAndGetUpdated().subscribe({
      next: (updatedCart) => {
        this.cartData = updatedCart;
        this.bonusPointsToUse = 0;
        this.snackBar.open('Cart cleared', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this.snackBar.open('Error clearing cart', 'Close', { duration: 3000 });
      }
    });
  }

  onBonusPointsChange(): void {
    // Ensure bonus points don't exceed available or total price
    if (this.bonusPoints && this.cartData) {
      const maxUsable = Math.min(this.bonusPoints.availablePoints, this.cartData.totalPrice);
      if (this.bonusPointsToUse > maxUsable) {
        this.bonusPointsToUse = maxUsable;
      }
      if (this.bonusPointsToUse < 0) {
        this.bonusPointsToUse = 0;
      }
    }
  }

  processPurchase(): void {
    if (!this.cartData || this.cartData.tours.length === 0) {
      this.snackBar.open('Cart is empty', 'Close', { duration: 3000 });
      return;
    }

    this.purchasing = true;
    this.purchaseService.processPurchase(this.bonusPointsToUse).subscribe({
      next: (purchase) => {
        this.purchasing = false;
        this.snackBar.open('Purchase completed successfully!', 'Close', { duration: 5000 });
        
        // Reload cart and bonus points
        this.loadCartData();
        this.loadBonusPoints();
        this.bonusPointsToUse = 0;
        
        // Navigate to purchase history or success page
        this.router.navigate(['/purchase-history']);
      },
      error: (error) => {
        this.purchasing = false;
        console.error('Error processing purchase:', error);
        this.snackBar.open('Error processing purchase. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/browse-tours']);
  }

  getCategoryName(categoryId: number): string {
    const categories = [
      { id: 1, name: 'Nature' },
      { id: 2, name: 'Art' },
      { id: 3, name: 'Sport' },
      { id: 4, name: 'Shopping' },
      { id: 5, name: 'Food' }
    ];
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  getDifficultyName(difficultyId: number): string {
    const difficulties = [
      { id: 1, name: 'Easy' },
      { id: 2, name: 'Moderate' },
      { id: 3, name: 'Hard' },
      { id: 4, name: 'Expert' }
    ];
    const difficulty = difficulties.find(d => d.id === difficultyId);
    return difficulty ? difficulty.name : 'Unknown';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  get finalAmount(): number {
    if (!this.cartData) return 0;
    return this.cartData.totalPrice - this.bonusPointsToUse;
  }

  get maxUsableBonusPoints(): number {
    if (!this.bonusPoints || !this.cartData) return 0;
    return Math.min(this.bonusPoints.availablePoints, this.cartData.totalPrice);
  }
}