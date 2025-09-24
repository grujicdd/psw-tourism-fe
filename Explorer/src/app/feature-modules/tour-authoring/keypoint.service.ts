// src/app/feature-modules/tour-authoring/keypoint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

export interface KeyPoint {
  id: number;
  tourId: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class KeyPointService {
  private apiUrl = environment.apiHost + 'author/keypoints';

  constructor(private http: HttpClient) {}

  createKeyPoint(keyPoint: KeyPoint): Observable<KeyPoint> {
    return this.http.post<KeyPoint>(this.apiUrl, keyPoint);
  }

  updateKeyPoint(keyPoint: KeyPoint): Observable<KeyPoint> {
    return this.http.put<KeyPoint>(`${this.apiUrl}/${keyPoint.id}`, keyPoint);
  }

  deleteKeyPoint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getKeyPoint(id: number): Observable<KeyPoint> {
    return this.http.get<KeyPoint>(`${this.apiUrl}/${id}`);
  }

  getKeyPointsByTourId(tourId: number): Observable<KeyPoint[]> {
    return this.http.get<KeyPoint[]>(`${this.apiUrl}/tour/${tourId}`);
  }
}