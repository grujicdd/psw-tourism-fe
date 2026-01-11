// src/app/feature-modules/tour-purchasing/cart.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';

export interface ShoppingCart {
  id: number;
  touristId: number;
  tourIds: number[];
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = environment.apiHost + 'tourist/cart';

  constructor(private http: HttpClient) {}

  getCart(): Observable<ShoppingCart> {
    return this.http.get<ShoppingCart>(this.apiUrl);
  }

  addTourToCart(tourId: number): Observable<ShoppingCart> {
    return this.http.post<ShoppingCart>(`${this.apiUrl}/items/${tourId}`, {});
  }

  removeTourFromCart(tourId: number): Observable<ShoppingCart> {
    return this.http.delete<ShoppingCart>(`${this.apiUrl}/items/${tourId}`);
  }

  clearCart(): Observable<ShoppingCart> {
    return this.http.delete<ShoppingCart>(this.apiUrl);
  }
}