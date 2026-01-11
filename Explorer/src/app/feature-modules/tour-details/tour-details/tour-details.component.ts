// src/app/feature-modules/tour-details/tour-details/tour-details.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TouristTourService, KeyPoint } from '../../tour-browsing/tourist-tour.service';
import { CartService } from '../../tour-purchasing/cart.service';
import { Tour } from '../../tour-authoring/model/tour.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as L from 'leaflet';

@Component({
  selector: 'xp-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent implements OnInit, OnDestroy {
  tour: Tour | null = null;
  keyPoints: KeyPoint[] = [];
  loading = false;
  addingToCart = false;
  map: L.Map | null = null;
  
  // Category and difficulty mappings
  categories = [
    { id: 1, name: 'Nature' },
    { id: 2, name: 'Art' },
    { id: 3, name: 'Sport' },
    { id: 4, name: 'Shopping' },
    { id: 5, name: 'Food' }
  ];

  difficulties = [
    { id: 1, name: 'Easy', color: '#4caf50' },
    { id: 2, name: 'Moderate', color: '#ff9800' },
    { id: 3, name: 'Hard', color: '#ff5722' },
    { id: 4, name: 'Expert', color: '#f44336' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TouristTourService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const tourId = +params['id'];
      if (tourId) {
        this.loadTourDetails(tourId);
        this.loadKeyPoints(tourId);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  loadTourDetails(tourId: number): void {
    this.loading = true;
    this.tourService.getTour(tourId).subscribe({
      next: (tour) => {
        this.tour = tour;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tour details:', error);
        this.loading = false;
        this.snackBar.open('Error loading tour details', 'Close', { duration: 3000 });
        this.router.navigate(['/browse-tours']);
      }
    });
  }

  loadKeyPoints(tourId: number): void {
    this.tourService.getTourKeyPoints(tourId).subscribe({
      next: (keyPoints) => {
        this.keyPoints = keyPoints;
        console.log('Loaded keypoints:', keyPoints); // Debug log
        this.initializeMap();
      },
      error: (error) => {
        console.error('Error loading key points:', error);
        // Initialize map anyway, even without keypoints
        this.keyPoints = [];
        this.initializeMap();
      }
    });
  }

  initializeMap(): void {
    // Wait a bit for the DOM to be ready
    setTimeout(() => {
      if (this.keyPoints.length === 0) {
        // If no key points, center on Serbia
        this.map = L.map('map').setView([44.8125, 20.4612], 7);
      } else {
        // Center on first key point
        this.map = L.map('map').setView([this.keyPoints[0].latitude, this.keyPoints[0].longitude], 13);
      }

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Add key points as markers
      this.addKeyPointsToMap();
    }, 100);
  }

  addKeyPointsToMap(): void {
    if (!this.map || this.keyPoints.length === 0) return;

    const markers: L.LatLng[] = [];

    // Custom icon for key points
    const keyPointIcon = L.divIcon({
      className: 'key-point-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    this.keyPoints.forEach((keyPoint, index) => {
      const latLng = L.latLng(keyPoint.latitude, keyPoint.longitude);
      markers.push(latLng);

      // Create marker with popup
      const marker = L.marker(latLng, { icon: keyPointIcon })
        .addTo(this.map!)
        .bindPopup(`
          <div class="key-point-popup">
            <h4>${keyPoint.name}</h4>
            <p>${keyPoint.description}</p>
            <small>Stop ${keyPoint.order}</small>
            ${keyPoint.imageUrl ? `<img src="${keyPoint.imageUrl}" alt="${keyPoint.name}" style="width: 100%; max-width: 200px; margin-top: 8px; border-radius: 4px;">` : ''}
          </div>
        `);

      // Add order number to marker
      const orderIcon = L.divIcon({
        className: 'order-marker',
        html: `<span>${keyPoint.order}</span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker(latLng, { icon: orderIcon }).addTo(this.map!);
    });

    // Draw route lines between key points
    if (markers.length > 1) {
      L.polyline(markers, {
        color: '#2196F3',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(this.map!);
    }

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.FeatureGroup();
      this.map!.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          group.addLayer(layer);
        }
      });
      this.map!.fitBounds(group.getBounds().pad(0.1));
    }
  }

  addTourToCart(): void {
    if (!this.tour || this.addingToCart) return;

    this.addingToCart = true;
    this.cartService.addTourToCart(this.tour.id).subscribe({
      next: (cart) => {
        this.addingToCart = false;
        this.snackBar.open(`"${this.tour!.name}" added to cart!`, 'View Cart', { 
          duration: 4000 
        }).onAction().subscribe(() => {
          this.router.navigate(['/cart']);
        });
      },
      error: (error) => {
        this.addingToCart = false;
        console.error('Error adding tour to cart:', error);
        
        let errorMessage = 'Failed to add tour to cart';
        if (error.error?.detail) {
          if (error.error.detail.includes('past tours')) {
            errorMessage = 'Cannot add tours from the past to cart';
          } else if (error.error.detail.includes('not published')) {
            errorMessage = 'This tour is not available for booking';
          }
        }
        
        this.snackBar.open(errorMessage, 'Close', { duration: 4000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/browse-tours']);
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  getDifficultyInfo(difficultyId: number): {name: string, color: string} {
    const difficulty = this.difficulties.find(d => d.id === difficultyId);
    return difficulty ? {name: difficulty.name, color: difficulty.color} : {name: 'Unknown', color: '#666'};
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
}