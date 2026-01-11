// src/app/feature-modules/tour-purchasing/bonus-points.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { PagedResult } from '../tour-authoring/model/paged-result.model';

export interface BonusPoints {
  id: number;
  touristId: number;
  availablePoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface BonusTransaction {
  id: number;
  touristId: number;
  amount: number;
  type: BonusTransactionType;
  description: string;
  relatedTourId?: number;
  relatedPurchaseId?: number;
  createdAt: string;
}

export enum BonusTransactionType {
  EARNED_FROM_CANCELLATION = 0,
  SPENT_ON_PURCHASE = 1,
  EXPIRED = 2
}

@Injectable({
  providedIn: 'root'
})
export class BonusPointsService {
  private apiUrl = environment.apiHost + 'tourist/bonus-points';

  constructor(private http: HttpClient) {}

  getBonusPoints(): Observable<BonusPoints> {
    return this.http.get<BonusPoints>(this.apiUrl);
  }

  getTransactionHistory(page: number = 0, pageSize: number = 10): Observable<PagedResult<BonusTransaction>> {
    return this.http.get<PagedResult<BonusTransaction>>(`${this.apiUrl}/history?page=${page}&pageSize=${pageSize}`);
  }
}