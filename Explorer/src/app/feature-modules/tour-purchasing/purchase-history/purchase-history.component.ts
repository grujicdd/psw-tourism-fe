// src/app/feature-modules/tour-purchasing/purchase-history/purchase-history.component.ts
import { Component, OnInit } from '@angular/core';
import { PurchaseService, TourPurchase, PurchaseStatus } from '../purchase.service';
import { TouristTourService } from '../../tour-browsing/tourist-tour.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { BonusPointsService, BonusTransaction } from '../bonus-points.service';
import { forkJoin, map, switchMap } from 'rxjs';

interface PurchaseWithTours {
  purchase: TourPurchase;
  tours: Tour[];
}

@Component({
  selector: 'xp-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.css']
})
export class PurchaseHistoryComponent implements OnInit {
  purchases: PurchaseWithTours[] = [];
  bonusTransactions: BonusTransaction[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 10;
  totalCount = 0;
  hasNextPage = false;
  selectedTab = 0; // 0 = purchases, 1 = bonus history

  constructor(
    private purchaseService: PurchaseService,
    private tourService: TouristTourService,
    private bonusPointsService: BonusPointsService
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.loading = true;
    
    this.purchaseService.getPurchaseHistory(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        // Load tour details for each purchase
        const purchaseRequests = result.results.map(purchase => 
          forkJoin(purchase.tourIds.map(id => this.tourService.getTour(id))).pipe(
            map(tours => ({ purchase, tours }))
          )
        );

        if (purchaseRequests.length === 0) {
          this.purchases = [];
          this.totalCount = 0;
          this.hasNextPage = false;
          this.loading = false;
          return;
        }

        forkJoin(purchaseRequests).subscribe({
          next: (purchasesWithTours) => {
            if (this.currentPage === 0) {
              this.purchases = purchasesWithTours;
            } else {
              this.purchases = [...this.purchases, ...purchasesWithTours];
            }
            this.totalCount = result.totalCount;
            this.hasNextPage = (this.currentPage + 1) * this.pageSize < result.totalCount;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading tour details:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading purchases:', error);
        this.loading = false;
      }
    });
  }

  loadBonusHistory(): void {
    if (this.bonusTransactions.length > 0) return; // Already loaded
    
    this.loading = true;
    this.bonusPointsService.getTransactionHistory(0, 50).subscribe({
      next: (result) => {
        this.bonusTransactions = result.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bonus history:', error);
        this.loading = false;
      }
    });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    if (index === 1) {
      this.loadBonusHistory();
    }
  }

  loadMorePurchases(): void {
    if (this.hasNextPage && !this.loading && this.selectedTab === 0) {
      this.currentPage++;
      this.loadPurchases();
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getStatusColor(status: PurchaseStatus): string {
    switch (status) {
      case PurchaseStatus.Completed: return '#4caf50';
      case PurchaseStatus.Cancelled: return '#f44336';
      case PurchaseStatus.Refunded: return '#ff9800';
      default: return '#666';
    }
  }

  getStatusName(status: PurchaseStatus): string {
    switch (status) {
      case PurchaseStatus.Completed: return 'Completed';
      case PurchaseStatus.Cancelled: return 'Cancelled';
      case PurchaseStatus.Refunded: return 'Refunded';
      default: return 'Unknown';
    }
  }

  getTransactionTypeIcon(type: number): string {
    switch (type) {
      case 0: return 'star'; // EARNED_FROM_CANCELLATION
      case 1: return 'shopping_cart'; // SPENT_ON_PURCHASE
      case 2: return 'schedule'; // EXPIRED
      default: return 'help';
    }
  }

  getTransactionTypeColor(type: number): string {
    switch (type) {
      case 0: return '#4caf50'; // Earned - Green
      case 1: return '#f44336'; // Spent - Red
      case 2: return '#ff9800'; // Expired - Orange
      default: return '#666';
    }
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

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }
}