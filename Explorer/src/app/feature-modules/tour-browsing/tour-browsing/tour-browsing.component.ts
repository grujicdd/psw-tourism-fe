// src/app/feature-modules/tour-browsing/tour-browsing/tour-browsing.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TouristTourService, Category, TourFilter } from '../tourist-tour.service';
import { Tour, TourState } from '../../tour-authoring/model/tour.model';
import { CartService } from '../../tour-purchasing/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-tour-browsing',
  templateUrl: './tour-browsing.component.html',
  styleUrls: ['./tour-browsing.component.css']
})
export class TourBrowsingComponent implements OnInit {

  tours: Tour[] = [];
  categories: Category[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 12;
  totalCount = 0;
  hasNextPage = false;
  addingToCart: Set<number> = new Set();
  private priceFilterTimeout: any;

  // Difficulty levels
  difficulties = [
    { id: 1, name: 'Easy' },
    { id: 2, name: 'Moderate' },
    { id: 3, name: 'Hard' },
    { id: 4, name: 'Expert' }
  ];

  // ADDED: Sort options
  sortOptions = [
    { value: '', label: 'Default' },
    { value: 'asc', label: 'Date: Earliest First' },
    { value: 'desc', label: 'Date: Latest First' }
  ];

  filterForm = new FormGroup({
    category: new FormControl<number | null>(null),
    difficulty: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
    sortByDate: new FormControl<string>('')  // ADDED: Sort control
  });

  constructor(
    private touristTourService: TouristTourService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTours();
  }

  loadCategories(): void {
    this.touristTourService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadTours(): void {
    this.loading = true;
    
    const filterValues = this.filterForm.value;
    const filter: TourFilter = {
      category: filterValues.category || undefined,
      difficulty: filterValues.difficulty || undefined,
      maxPrice: filterValues.maxPrice && filterValues.maxPrice > 0 ? 
        Number(filterValues.maxPrice) : undefined,
      sortByDate: filterValues.sortByDate || undefined  // ADDED
    };

    // Check if any filter is applied (including sort)
    const hasFilters = filter.category || filter.difficulty || filter.maxPrice || filter.sortByDate;

    console.log('Applied filters:', filter);

    const tourObservable = hasFilters 
      ? this.touristTourService.getFilteredTours(this.currentPage, this.pageSize, filter)
      : this.touristTourService.getPublishedTours(this.currentPage, this.pageSize, filter.sortByDate);

    tourObservable.subscribe({
      next: (result) => {
        if (this.currentPage === 0) {
          this.tours = result.results;
        } else {
          this.tours = [...this.tours, ...result.results];
        }
        this.totalCount = result.totalCount;
        this.hasNextPage = (this.currentPage + 1) * this.pageSize < result.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tours:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.tours = [];
    this.loadTours();
  }

  onMaxPriceChange(): void {
    clearTimeout(this.priceFilterTimeout);
    this.priceFilterTimeout = setTimeout(() => {
      this.onFilterChange();
    }, 500);
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.onFilterChange();
  }

  loadMoreTours(): void {
    if (this.hasNextPage && !this.loading) {
      this.currentPage++;
      this.loadTours();
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  getDifficultyName(difficultyId: number): string {
    const difficulty = this.difficulties.find(d => d.id === difficultyId);
    return difficulty ? difficulty.name : 'Unknown';
  }

  getDifficultyColor(difficultyId: number): string {
    const colors: { [key: number]: string } = {
      1: '#4caf50',
      2: '#ff9800', 
      3: '#f44336',
      4: '#9c27b0'
    };
    return colors[difficultyId] || '#757575';
  }

  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }

  onTourSelect(tour: Tour): void {
    this.router.navigate(['/tour-details', tour.id]);
  }

  addTourToCart(tour: Tour, event: Event): void {
    event.stopPropagation();
    
    if (this.isAddingToCart(tour.id)) {
      return;
    }

    this.addingToCart.add(tour.id);

    this.cartService.addTourToCart(tour.id).subscribe({
      next: () => {
        this.snackBar.open(`${tour.name} added to cart!`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar']
        });
        this.addingToCart.delete(tour.id);
      },
      error: (error) => {
        console.error('Error adding tour to cart:', error);
        this.snackBar.open(error.error || 'Failed to add tour to cart', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
        this.addingToCart.delete(tour.id);
      }
    });
  }

  isAddingToCart(tourId: number): boolean {
    return this.addingToCart.has(tourId);
  }

  viewCart(): void {
    this.router.navigate(['/cart']);
  }
}