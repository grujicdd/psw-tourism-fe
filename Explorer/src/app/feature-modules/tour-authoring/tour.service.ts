// tour.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Tour } from './model/tour.model';
import { PagedResult } from './model/paged-result.model';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = environment.apiHost + 'author/tours';

  constructor(private http: HttpClient) {}

  getTours(page: number, pageSize: number): Observable<PagedResult<Tour>> {
    return this.http.get<PagedResult<Tour>>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`);
  }

  createTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(this.apiUrl, tour);
  }

  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(`${this.apiUrl}/${tour.id}`, tour);
  }

  deleteTour(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTourById(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/${id}`);
  }
}