// src/app/feature-modules/tour-purchasing/tour-review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

export interface TourReview {
  id: number;
  tourPurchaseId: number;
  tourId: number;
  touristId: number;
  rating: number;
  comment?: string;
  reviewDate: Date;
}

export interface TourReviewCreate {
  tourPurchaseId: number;
  tourId: number;
  rating: number;
  comment?: string;
}

export interface TourReviewStatistics {
  tourId: number;
  averageRating: number;
  totalReviews: number;
  rating5Count: number;
  rating4Count: number;
  rating3Count: number;
  rating2Count: number;
  rating1Count: number;
}

@Injectable({
  providedIn: 'root'
})
export class TourReviewService {
  private apiUrl = environment.apiHost + 'tourist/tour-reviews';

  constructor(private http: HttpClient) {}

  createReview(review: TourReviewCreate): Observable<TourReview> {
    return this.http.post<TourReview>(this.apiUrl, review);
  }

  getReview(reviewId: number): Observable<TourReview> {
    return this.http.get<TourReview>(`${this.apiUrl}/${reviewId}`);
  }

  getReviewsForPurchase(purchaseId: number): Observable<TourReview[]> {
    return this.http.get<TourReview[]>(`${this.apiUrl}/purchase/${purchaseId}`);
  }

  getReviewsForTour(tourId: number): Observable<TourReview[]> {
    return this.http.get<TourReview[]>(`${this.apiUrl}/tour/${tourId}`);
  }

  getTourStatistics(tourId: number): Observable<TourReviewStatistics> {
    return this.http.get<TourReviewStatistics>(`${this.apiUrl}/tour/${tourId}/statistics`);
  }

  canReviewTour(purchaseId: number, tourId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/can-review`, {
      params: { purchaseId: purchaseId.toString(), tourId: tourId.toString() }
    });
  }
}