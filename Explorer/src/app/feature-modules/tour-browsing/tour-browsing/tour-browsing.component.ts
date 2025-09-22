// tour-browsing.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TouristTourService, Category, TourFilter } from '../tourist-tour.service';
import { Tour, TourState } from '../../tour-authoring/model/tour.model';

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

  // Difficulty levels
  difficulties = [
    { id: 1, name: 'Easy' },
    { id: 2, name: 'Moderate' },
    { id: 3, name: 'Hard' },
    { id: 4, name: 'Expert' }
  ];

  filterForm = new FormGroup({
    category: new FormControl<number | null>(null),
    difficulty: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null)
  });

  constructor(private touristTourService: TouristTourService) {}

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
      maxPrice: filterValues.maxPrice && filterValues.maxPrice > 0 ? Number(filterValues.maxPrice) : undefined
    };

    // Check if any filter is applied
    const hasFilters = filter.category || filter.difficulty || filter.maxPrice;

    console.log('Applied filters:', filter); // Debug log

    const tourObservable = hasFilters 
      ? this.touristTourService.getFilteredTours(this.currentPage, this.pageSize, filter)
      : this.touristTourService.getPublishedTours(this.currentPage, this.pageSize);

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
    // Add a small delay to prevent too many API calls while typing
    clearTimeout(this.priceFilterTimeout);
    this.priceFilterTimeout = setTimeout(() => {
      this.onFilterChange();
    }, 500);
  }

  private priceFilterTimeout: any;

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
    switch (difficultyId) {
      case 1: return '#4caf50'; // Easy - Green
      case 2: return '#ff9800'; // Moderate - Orange  
      case 3: return '#ff5722'; // Hard - Red-Orange
      case 4: return '#f44336'; // Expert - Red
      default: return '#666';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  onTourSelect(tour: Tour): void {
    // TODO: Implement tour details view or add to cart
    console.log('Selected tour:', tour);
  }
}