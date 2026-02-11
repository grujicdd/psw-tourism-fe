// src/app/feature-modules/tour-purchasing/purchase-history/purchase-history.component.ts
import { Component, OnInit } from '@angular/core';
import { PurchaseService, TourPurchase, PurchaseStatus } from '../purchase.service';
import { TouristTourService } from '../../tour-browsing/tourist-tour.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { BonusPointsService, BonusTransaction } from '../bonus-points.service';
import { TourReviewService, TourReview } from '../tour-review.service';
import { MatDialog } from '@angular/material/dialog';
import { TourReviewDialogComponent } from '../tour-review-dialog/tour-review-dialog.component';
import { forkJoin, map, switchMap } from 'rxjs';
import { ReportProblemDialogComponent } from '../report-problem-dialog/report-problem-dialog.component';

interface TourWithReview {
  tour: Tour;
  review?: TourReview;
  canReview: boolean;
}

interface PurchaseWithTours {
  purchase: TourPurchase;
  tours: TourWithReview[];
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
  currentDate = new Date();

  constructor(
    private purchaseService: PurchaseService,
    private tourService: TouristTourService,
    private bonusPointsService: BonusPointsService,
    private reviewService: TourReviewService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.loading = true;
    
    this.purchaseService.getPurchaseHistory(this.currentPage, this.pageSize).subscribe({
      next: (result) => {
        // Load tour details, reviews, and eligibility for each purchase
        const purchaseRequests = result.results.map(purchase => {
          // Get all tours for this purchase
          const tourRequests = purchase.tourIds.map(tourId =>
            forkJoin({
              tour: this.tourService.getTour(tourId),
              canReview: this.reviewService.canReviewTour(purchase.id, tourId)
            })
          );

          return forkJoin(tourRequests).pipe(
            switchMap(toursData => {
              // Get existing reviews for this purchase
              return this.reviewService.getReviewsForPurchase(purchase.id).pipe(
                map(reviews => {
                  // Combine tour data with review data
                  const tours: TourWithReview[] = toursData.map(data => ({
                    tour: data.tour,
                    canReview: data.canReview,
                    review: reviews.find(r => r.tourId === data.tour.id)
                  }));

                  return { purchase, tours };
                })
              );
            })
          );
        });

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

  openReportProblemDialog(tourData: any): void {
    const dialogRef = this.dialog.open(ReportProblemDialogComponent, {
      width: '500px',
      data: {
        tourId: tourData.tour.id,
        tourName: tourData.tour.name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Problem was reported successfully
        console.log('Problem reported for tour:', tourData.tour.name);
      }
    });
  }

  openReviewDialog(tourWithReview: TourWithReview, purchaseId: number): void {
    const dialogRef = this.dialog.open(TourReviewDialogComponent, {
      width: '600px',
      data: {
        tour: tourWithReview.tour,
        purchaseId: purchaseId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Review was submitted successfully, reload purchases to show the new review
        this.currentPage = 0;
        this.loadPurchases();
      }
    });
  }

  getReviewButtonText(tourWithReview: TourWithReview): string {
    if (tourWithReview.review) {
      return 'View Review';
    }
    if (tourWithReview.canReview) {
      return 'Write Review';
    }
    return 'Review Unavailable';
  }

  getReviewButtonIcon(tourWithReview: TourWithReview): string {
    if (tourWithReview.review) {
      return 'visibility';
    }
    if (tourWithReview.canReview) {
      return 'rate_review';
    }
    return 'block';
  }

  showReviewDetails(review: TourReview): void {
    // You can implement a dialog to show review details, or just display inline
    console.log('Review details:', review);
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

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}