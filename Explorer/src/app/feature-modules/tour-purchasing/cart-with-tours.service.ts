// src/app/feature-modules/tour-purchasing/cart-with-tours.service.ts
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap, of } from 'rxjs';
import { CartService, ShoppingCart } from './cart.service';
import { TouristTourService } from '../tour-browsing/tourist-tour.service';
import { Tour } from '../tour-authoring/model/tour.model';

export interface CartWithTours {
  cart: ShoppingCart;
  tours: Tour[];
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartWithToursService {
  
  constructor(
    private cartService: CartService,
    private tourService: TouristTourService
  ) {}

  getCartWithTours(): Observable<CartWithTours> {
    return this.cartService.getCart().pipe(
      switchMap(cart => {
        if (cart.tourIds.length === 0) {
          return of({
            cart,
            tours: [],
            totalPrice: 0
          });
        }

        // Get all tours in parallel
        const tourRequests = cart.tourIds.map(id => this.tourService.getTour(id));
        
        return forkJoin(tourRequests).pipe(
          map(tours => ({
            cart,
            tours,
            totalPrice: tours.reduce((sum, tour) => sum + tour.price, 0)
          }))
        );
      })
    );
  }

  addTourAndGetUpdated(tourId: number): Observable<CartWithTours> {
    return this.cartService.addTourToCart(tourId).pipe(
      switchMap(() => this.getCartWithTours())
    );
  }

  removeTourAndGetUpdated(tourId: number): Observable<CartWithTours> {
    return this.cartService.removeTourFromCart(tourId).pipe(
      switchMap(() => this.getCartWithTours())
    );
  }

  clearCartAndGetUpdated(): Observable<CartWithTours> {
    return this.cartService.clearCart().pipe(
      switchMap(() => this.getCartWithTours())
    );
  }
}