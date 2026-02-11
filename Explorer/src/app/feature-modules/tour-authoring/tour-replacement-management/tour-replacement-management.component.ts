// src/app/feature-modules/tour-authoring/tour-replacement-management/tour-replacement-management.component.ts
import { Component, OnInit } from '@angular/core';
import { TourReplacementService, TourReplacement, TourReplacementStatus } from '../tour-replacement.service';
import { TourService } from '../tour.service';
import { Tour } from '../model/tour.model';

@Component({
  selector: 'xp-tour-replacement-management',
  templateUrl: './tour-replacement-management.component.html',
  styleUrls: ['./tour-replacement-management.component.css']
})
export class TourReplacementManagementComponent implements OnInit {
  myReplacements: TourReplacement[] = [];
  tours: Map<number, Tour> = new Map();
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  TourReplacementStatus = TourReplacementStatus;

  constructor(
    private replacementService: TourReplacementService,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    this.loadMyReplacements();
  }

  loadMyReplacements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.replacementService.getMyReplacementRequests(0, 20).subscribe({
      next: (result) => {
        this.myReplacements = result.results;
        this.loadTourDetails();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load replacement requests';
        console.error('Error loading replacements:', error);
        this.isLoading = false;
      }
    });
  }

  loadTourDetails(): void {
    // Load tour details for each replacement
    this.myReplacements.forEach(replacement => {
      // FIXED: Changed getTourById to getTour
      this.tourService.getTour(replacement.tourId).subscribe({
        next: (tour) => {
          this.tours.set(tour.id, tour);
        },
        error: (error) => {
          console.error(`Error loading tour ${replacement.tourId}:`, error);
        }
      });
    });
  }

  cancelReplacement(replacement: TourReplacement): void {
    if (!confirm('Are you sure you want to cancel this replacement request?')) {
      return;
    }

    this.replacementService.cancelReplacementRequest(replacement.id).subscribe({
      next: () => {
        this.successMessage = 'Replacement request cancelled successfully';
        this.loadMyReplacements();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Failed to cancel replacement request';
        console.error('Error cancelling replacement:', error);
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  getTour(tourId: number): Tour | undefined {
    return this.tours.get(tourId);
  }

  getStatusDisplayName(status: TourReplacementStatus): string {
    return this.replacementService.getStatusDisplayName(status);
  }

  getStatusColor(status: TourReplacementStatus): string {
    return this.replacementService.getStatusColor(status);
  }

  canCancel(replacement: TourReplacement): boolean {
    return replacement.status === TourReplacementStatus.PENDING;
  }
}