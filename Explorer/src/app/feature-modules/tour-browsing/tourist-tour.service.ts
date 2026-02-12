// src/app/feature-modules/tour-browsing/tourist-tour.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Tour } from '../tour-authoring/model/tour.model';
import { PagedResult } from '../tour-authoring/model/paged-result.model';

export interface Category {
  id: number;
  name: string;
}

export interface TourFilter {
  category?: number;
  difficulty?: number;
  maxPrice?: number;
  sortByDate?: string;  // ADDED
}

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
export class TouristTourService {
  private apiUrl = environment.apiHost + 'tourist/tours';

  constructor(private http: HttpClient) {}

  getPublishedTours(page: number, pageSize: number, sortByDate?: string): Observable<PagedResult<Tour>> {
    let params = `page=${page}&pageSize=${pageSize}`;
    
    // ADDED: Include sortByDate if provided
    if (sortByDate) {
      params += `&sortByDate=${sortByDate}`;
    }

    return this.http.get<PagedResult<Tour>>(`${this.apiUrl}?${params}`);
  }

  getTour(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/${id}`);
  }

  getFilteredTours(page: number, pageSize: number, filter: TourFilter): Observable<PagedResult<Tour>> {
    let params = `page=${page}&pageSize=${pageSize}`;
    
    if (filter.category) {
      params += `&category=${filter.category}`;
    }
    if (filter.difficulty) {
      params += `&difficulty=${filter.difficulty}`;
    }
    if (filter.maxPrice && filter.maxPrice > 0) {
      params += `&maxPrice=${filter.maxPrice}`;
    }
    // ADDED: Include sortByDate if provided
    if (filter.sortByDate) {
      params += `&sortByDate=${filter.sortByDate}`;
    }

    console.log('API request params:', params); // Debug log

    return this.http.get<PagedResult<Tour>>(`${this.apiUrl}/filter?${params}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  getTourKeyPoints(tourId: number): Observable<KeyPoint[]> {
    return this.http.get<KeyPoint[]>(`${this.apiUrl}/${tourId}/keypoints`);
  }
}