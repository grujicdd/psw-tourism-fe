// src/app/feature-modules/tour-purchasing/purchase.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { PagedResult } from '../tour-authoring/model/paged-result.model';

export interface TourPurchase {
  id: number;
  touristId: number;
  tourIds: number[];
  totalAmount: number;
  bonusPointsUsed: number;
  finalAmount: number;
  purchaseDate: string;
  status: PurchaseStatus;
}

export enum PurchaseStatus {
  Completed = 0,
  Cancelled = 1,
  Refunded = 2
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = environment.apiHost + 'tourist/purchases';

  constructor(private http: HttpClient) {}

  processPurchase(bonusPointsToUse: number = 0): Observable<TourPurchase> {
    return this.http.post<TourPurchase>(this.apiUrl, bonusPointsToUse, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getPurchaseHistory(page: number = 0, pageSize: number = 10): Observable<PagedResult<TourPurchase>> {
    return this.http.get<PagedResult<TourPurchase>>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  getPurchase(purchaseId: number): Observable<TourPurchase> {
    return this.http.get<TourPurchase>(`${this.apiUrl}/${purchaseId}`);
  }
}