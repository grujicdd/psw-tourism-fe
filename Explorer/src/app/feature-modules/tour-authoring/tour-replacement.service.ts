// src/app/feature-modules/tour-authoring/tour-replacement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { PagedResult } from './model/paged-result.model';

export interface TourReplacement {
  id: number;
  tourId: number;
  originalGuideId: number;
  replacementGuideId?: number;
  status: TourReplacementStatus;
  requestedAt: string;
  acceptedAt?: string;
  cancelledAt?: string;
}

export interface AvailableTourReplacement {
  replacementId: number;
  tourId: number;
  tourName: string;
  tourDescription: string;
  tourDate: string;
  tourDifficulty: number;
  tourCategory: number;
  tourPrice: number;
  originalGuideId: number;
  requestedAt: string;
}

export interface TourReplacementRequest {
  tourId: number;
}

export enum TourReplacementStatus {
  PENDING = 0,
  ACCEPTED = 1,
  CANCELLED = 2,
  EXPIRED = 3
}

@Injectable({
  providedIn: 'root'
})
export class TourReplacementService {
  private apiUrl = environment.apiHost + 'guide/tour-replacement';

  constructor(private http: HttpClient) {}

  // Request replacement for a tour
  requestReplacement(tourId: number): Observable<TourReplacement> {
    const request: TourReplacementRequest = { tourId };
    return this.http.post<TourReplacement>(`${this.apiUrl}/request`, request);
  }

  // Cancel a replacement request
  cancelReplacementRequest(replacementId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${replacementId}/cancel`);
  }

  // Get available tours for replacement
  getAvailableReplacements(page: number = 0, pageSize: number = 10): Observable<PagedResult<AvailableTourReplacement>> {
    return this.http.get<PagedResult<AvailableTourReplacement>>(
      `${this.apiUrl}/available?page=${page}&pageSize=${pageSize}`
    );
  }

  // Accept a replacement request
  acceptReplacement(replacementId: number): Observable<TourReplacement> {
    return this.http.post<TourReplacement>(`${this.apiUrl}/${replacementId}/accept`, {});
  }

  // Get my replacement requests
  getMyReplacementRequests(page: number = 0, pageSize: number = 10): Observable<PagedResult<TourReplacement>> {
    return this.http.get<PagedResult<TourReplacement>>(
      `${this.apiUrl}/my-requests?page=${page}&pageSize=${pageSize}`
    );
  }

  // Get replacement details
  getReplacementDetails(replacementId: number): Observable<AvailableTourReplacement> {
    return this.http.get<AvailableTourReplacement>(`${this.apiUrl}/${replacementId}`);
  }

  // Helper method to get status display name
  getStatusDisplayName(status: TourReplacementStatus): string {
    switch (status) {
      case TourReplacementStatus.PENDING:
        return 'Pending';
      case TourReplacementStatus.ACCEPTED:
        return 'Accepted';
      case TourReplacementStatus.CANCELLED:
        return 'Cancelled';
      case TourReplacementStatus.EXPIRED:
        return 'Expired';
      default:
        return 'Unknown';
    }
  }

  // Helper method to get status color
  getStatusColor(status: TourReplacementStatus): string {
    switch (status) {
      case TourReplacementStatus.PENDING:
        return 'warn';
      case TourReplacementStatus.ACCEPTED:
        return 'primary';
      case TourReplacementStatus.CANCELLED:
        return 'accent';
      case TourReplacementStatus.EXPIRED:
        return '';
      default:
        return '';
    }
  }
}